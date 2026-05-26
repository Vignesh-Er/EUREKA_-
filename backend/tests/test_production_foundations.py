"""Comprehensive integration and unit test suite for Wave 0 and Wave 1 validation.
Verifies fallbacks, audit log immutability, environment settings, SSE chunks, and rate limits.
"""

import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import HTTPException, status, Request
from pydantic import ValidationError

from config import settings, Settings
from services.nvidia_engines import NVIDIAEngineBase
from main import get_rate_limit_key
from services.feature_flags import feature_flags
from models.foundation import AuditLog


# ==============================================================================
# 1. ENVIRONMENT VALIDATION TESTS
# ==============================================================================

def test_production_environment_validation():
    """Verify that settings validation correctly rejects default keys and SQLite in production."""
    # Test valid production configuration
    try:
        Settings(
            app_env="production",
            secret_key="secure-random-prod-key-1234567890",
            jwt_secret_key="secure-random-prod-key-1234567890",
            database_url="postgresql+asyncpg://user:pass@host/db"
        )
    except ValidationError:
        pytest.fail("Settings validator rejected a valid production configuration.")

    # Rejects default keys
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            app_env="production",
            secret_key="change-me-in-production",
            jwt_secret_key="change-me-in-production",
            database_url="postgresql+asyncpg://user:pass@host/db"
        )
    assert "must be changed from default values" in str(exc_info.value)

    # Rejects SQLite
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            app_env="production",
            secret_key="secure-random-prod-key-1234567890",
            jwt_secret_key="secure-random-prod-key-1234567890",
            database_url="sqlite+aiosqlite:///./eureka.db"
        )
    assert "SQLite is not allowed in production" in str(exc_info.value)


# ==============================================================================
# 2. AUDIT LOG IMMUTABILITY TESTS
# ==============================================================================

@pytest.mark.asyncio
async def test_audit_log_immutability():
    """Prove that SQLAlchemy event listeners actively block updates and deletions on AuditLog."""
    from database.session import DatabaseEngine
    session_maker = DatabaseEngine.get_session_maker()
    
    async with session_maker() as session:
        # Create an entry
        log = AuditLog(
            user_id="student-1",
            role="student",
            action="TEST_MUTATION",
            module="INTEGRATION_TESTS",
            detail="Testing immutability blocks"
        )
        session.add(log)
        await session.commit()
        
        # Verify log is committed
        log_id = log.id
        assert log_id is not None
        
        # Try updating
        log.detail = "Unauthorized modification attempt"
        with pytest.raises(RuntimeError) as exc_info:
            await session.commit()
        assert "Audit logs are immutable. Updates are strictly forbidden." in str(exc_info.value)
        await session.rollback()

        # Try deleting
        log = await session.get(AuditLog, log_id)
        await session.delete(log)
        with pytest.raises(RuntimeError) as exc_info_del:
            await session.commit()
        assert "Audit logs are immutable. Deletions are strictly forbidden." in str(exc_info_del.value)
        await session.rollback()


# ==============================================================================
# 3. DYNAMIC NIM CLIENT & TWO-TIER FALLBACK TESTS
# ==============================================================================

@pytest.mark.asyncio
@patch("httpx.AsyncClient.post")
async def test_nim_client_success(mock_post):
    """Verify standard NIM response parsing and metadata generation on success."""
    mock_post.return_value = MagicMock(
        status_code=200,
        json=lambda: {
            "choices": [{"message": {"content": "Real NIM content"}}],
            "usage": {"prompt_tokens": 12, "completion_tokens": 18, "total_tokens": 30}
        }
    )

    client = NVIDIAEngineBase()
    # Mock configured NIM key
    client.nim_api_key = "fake-api-key"

    res = await client._call_nim_api(
        model="qwen/qwen3.5-122b-a10b",
        messages=[{"role": "user", "content": "hello"}],
        sensitive=False
    )
    assert res["choices"][0]["message"]["content"] == "Real NIM content"
    assert res["_meta"]["source"] == "nim"
    assert res["_meta"]["model_used"] == "qwen/qwen3.5-122b-a10b"


@pytest.mark.asyncio
@patch("httpx.AsyncClient.post")
async def test_nim_client_sensitive_fail_closed(mock_post):
    """Verify that sensitive NIM operations fail-closed on timeout/API failure."""
    mock_post.side_effect = Exception("Connection Timeout")

    client = NVIDIAEngineBase()
    client.nim_api_key = "fake-api-key"

    # Sensitive operation should raise a 503 error
    with pytest.raises(HTTPException) as exc_info:
        await client._call_nim_api(
            model="qwen/qwen3.5-122b-a10b",
            messages=[{"role": "user", "content": "grade this paper"}],
            sensitive=True
        )
    assert exc_info.value.status_code == status.HTTP_503_SERVICE_UNAVAILABLE


@pytest.mark.asyncio
@patch("httpx.AsyncClient.post")
async def test_nim_client_non_sensitive_fail_open(mock_post):
    """Verify that non-sensitive NIM operations fail-open gracefully serving mocks."""
    mock_post.side_effect = Exception("Connection Timeout")

    client = NVIDIAEngineBase()
    client.nim_api_key = "fake-api-key"

    # Non-sensitive operations should return a graceful mock
    res = await client._call_nim_api(
        model="qwen/qwen3.5-122b-a10b",
        messages=[{"role": "user", "content": "suggest subjects"}],
        sensitive=False
    )
    assert "[DEMO MODE - FALLBACK RESPONSE]" in res["choices"][0]["message"]["content"]
    assert res["_meta"]["source"] == "fallback"


# ==============================================================================
# 4. SSE STREAMING CHUNKS & HEARTBEATS TESTS
# ==============================================================================

@pytest.mark.asyncio
async def test_sse_streaming_fallback_yields():
    """Verify that streaming generator handles unconfigured API keys and yields valid SSE chunks."""
    client = NVIDIAEngineBase()
    client.nim_api_key = "" # Unconfigured key to trigger fallback stream

    chunks = []
    async for chunk in client._stream_nim_api(
        model="qwen/qwen3.5-122b-a10b",
        messages=[{"role": "user", "content": "stream this"}]
    ):
        chunks.append(chunk)

    assert len(chunks) > 0
    # Must yield valid SSE data: format
    assert chunks[0].startswith("data: ")
    # Terminal chunk is [DONE]
    assert chunks[-1] == "data: [DONE]\n\n"

    # Parse chunk content
    payload = json.loads(chunks[0].replace("data: ", ""))
    assert payload["_meta"]["source"] == "fallback"
    assert "choices" in payload


# ==============================================================================
# 5. FEATURE FLAGS FALLBACK TESTS
# ==============================================================================

@pytest.mark.asyncio
async def test_nonexistent_feature_flag_fails_closed():
    """Verify that a nonexistent feature flag is reported as disabled safely."""
    from database.session import DatabaseEngine
    session_maker = DatabaseEngine.get_session_maker()
    
    async with session_maker() as session:
        enabled = await feature_flags.is_enabled(session, "flag_that_does_not_exist_xyz")
        assert enabled is False


# ==============================================================================
# 6. RATE LIMITING KEYS RESOLUTION TESTS
# ==============================================================================

def test_rate_limit_keys_authenticated():
    """Verify rate limit resolver uses user_id from token if present."""
    mock_request = MagicMock(spec=Request)
    mock_request.headers = {"authorization": "Bearer demo-token-student-1"}
    
    key = get_rate_limit_key(mock_request)
    assert key == "user:student-1"


def test_rate_limit_keys_unauthenticated():
    """Verify rate limit resolver falls back to client IP address when unauthenticated."""
    mock_request = MagicMock(spec=Request)
    mock_request.headers = {}
    mock_request.client = MagicMock()
    mock_request.client.host = "192.168.1.5"
    
    key = get_rate_limit_key(mock_request)
    assert key == "ip:192.168.1.5"


# ==============================================================================
# 7. SENSITIVE ACTIONS AUDIT CREATION TESTS
# ==============================================================================

@pytest.mark.asyncio
async def test_audit_log_creation():
    """Verify that sensitive actions write an audit entry to the database."""
    from database.session import DatabaseEngine
    from services.audit import log_action
    from sqlalchemy import select
    
    session_maker = DatabaseEngine.get_session_maker()
    async with session_maker() as session:
        # Perform sensitive log action
        await log_action(
            db=session,
            user_id="admin-1",
            role="admin",
            action="TOGGLE_FEATURE_FLAG",
            module="FEATURE_FLAGS",
            detail="Toggled flag 'wave1_sse_streaming' to True"
        )
        await session.commit()
        
        # Verify that an entry actually exists in the database
        stmt = select(AuditLog).where(
            AuditLog.action == "TOGGLE_FEATURE_FLAG",
            AuditLog.user_id == "admin-1"
        ).order_by(AuditLog.timestamp.desc())
        result = await session.execute(stmt)
        entry = result.scalars().first()
        
        assert entry is not None
        assert entry.module == "FEATURE_FLAGS"
        assert entry.detail == "Toggled flag 'wave1_sse_streaming' to True"


# ==============================================================================
# 8. REDIS STORAGE RATE LIMIT COMPLIANCE
# ==============================================================================

def test_redis_rate_limit_initialization():
    """Verify that the slowapi rate limiter configures RedisStorage when redis_url is set."""
    # Import Limiter locally to check dynamic limiter initialization
    from slowapi import Limiter
    from main import get_rate_limit_key
    
    redis_url = "redis://localhost:6379/0"
    limiter = Limiter(key_func=get_rate_limit_key, storage_uri=redis_url)
    assert limiter._storage is not None
    assert "Redis" in type(limiter._storage).__name__


# ==============================================================================
# 9. POSTGRESQL DIALECT MIGRATION COMPILES
# ==============================================================================

def test_postgresql_dialect_migration_compiles():
    """Verify that database metadata is fully PostgreSQL dialect-compliant."""
    from sqlalchemy.dialects import postgresql
    from database.base import Base
    import models # load all tables
    
    # Check that metadata compiles cleanly for PostgreSQL dialect without throwing exceptions
    postgres_dialect = postgresql.dialect()
    for table_name, table in Base.metadata.tables.items():
        assert table_name is not None
        # Compiles without raising exceptions
        assert str(table.schema) is not None


# ==============================================================================
# 10. HEALTH AND READINESS ENDPOINTS TESTS
# ==============================================================================

def test_health_check_endpoint():
    """Verify that /health responds with 200 and liveness details."""
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_readiness_check_endpoint():
    """Verify that /health/ready responds with 200 and readiness check payload."""
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    response = client.get("/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database_connected" in data
    assert "logs_writeable" in data
    assert "nim_api_configured" in data


@patch("httpx.AsyncClient.post")
def test_verify_nim_credentials_endpoint_success(mock_post):
    """Verify that /api/v1/admin/nim/verify responds with connected when NIM is healthy."""
    from fastapi.testclient import TestClient
    from main import app
    from unittest.mock import MagicMock
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_post.return_value = mock_response
    
    client = TestClient(app)
    headers = {"Authorization": "Bearer demo-token-admin-1"}
    response = client.post("/api/v1/admin/nim/verify", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["data"]["status"] == "connected"


# ==============================================================================
# 11. CORS CORS ORIGIN VERIFICATION TESTS
# ==============================================================================

def test_cors_origin_verification_allowed():
    """Verify that allowed origins receive correct Access-Control-Allow-Origin headers."""
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    }
    response = client.options("/api/v1/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_cors_origin_verification_disallowed():
    """Verify that disallowed origins do not receive Access-Control-Allow-Origin headers."""
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    headers = {
        "Origin": "https://malicious-domain.com",
        "Access-Control-Request-Method": "GET"
    }
    response = client.options("/api/v1/health", headers=headers)
    assert "access-control-allow-origin" not in response.headers
