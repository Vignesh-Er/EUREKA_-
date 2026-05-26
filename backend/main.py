"""Project Eureka - Main FastAPI Application."""

import os
import time
import uuid
import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from api.routes import (
    admin_router,
    auth_router,
    professor_router,
    student_router,
    translation_router,
    accreditation_router,
    syllabus_router,
    staff_performance_router,
    placement_router,
    tool_utilization_router,
    parent_portal_router,
    industry_connect_router,
    research_grants_router,
    alumni_router,
    admin_status_router,
)
from api.routes.exam_prep import router as exam_prep_router
from config import settings
from services.auth import decode_access_token

Path("logs").mkdir(exist_ok=True)

logger.remove()
logger.add("logs/app.log", rotation="10 MB", level=settings.log_level)
logger.add(lambda msg: print(msg, end=""), level=settings.log_level)


def get_rate_limit_key(request: Request) -> str:
    """Use user_id from token if authenticated, otherwise IP."""
    auth_header = request.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            token_data = decode_access_token(auth_header[7:])
            if token_data and token_data.get("user_id"):
                return f"user:{token_data['user_id']}"
        except Exception:
            pass
    return f"ip:{request.client.host if request.client else 'unknown'}"


# Configure Redis storage for multi-instance production rate limiting
redis_url = getattr(settings, "redis_url", None) or os.getenv("REDIS_URL")
if redis_url:
    logger.info(f"Configuring slowapi rate limiter to use Redis storage at {redis_url}")
    limiter = Limiter(key_func=get_rate_limit_key, storage_uri=redis_url)
else:
    limiter = Limiter(key_func=get_rate_limit_key)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} in {settings.app_env} mode")
    
    # Auto-run Alembic migrations for local development convenience
    if settings.app_env == "development":
        logger.info("Auto-running Alembic migrations for local development...")
        try:
            from alembic.config import Config
            from alembic import command
            alembic_cfg = Config("alembic.ini")
            command.upgrade(alembic_cfg, "head")
            logger.info("Alembic migrations completed successfully.")
        except Exception as e:
            logger.error(f"Failed to auto-run Alembic migrations: {e}")
            
    yield
    logger.info("Shutting down application")


app = FastAPI(
    lifespan=lifespan,
    title=settings.app_name,
    description="AI Academic Intelligence Platform - Project Eureka Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3})(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(student_router, prefix="/api/v1")
app.include_router(professor_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(translation_router, prefix="/api/v1")
app.include_router(exam_prep_router, prefix="/api/v1")
app.include_router(accreditation_router, prefix="/api/v1")
app.include_router(syllabus_router, prefix="/api/v1")
app.include_router(staff_performance_router, prefix="/api/v1")
app.include_router(placement_router, prefix="/api/v1/placement")
app.include_router(tool_utilization_router, prefix="/api/v1/tool-utilization")
app.include_router(parent_portal_router, prefix="/api/v1/parent-portal")
app.include_router(industry_connect_router, prefix="/api/v1/industry-connect")
app.include_router(research_grants_router, prefix="/api/v1/research-grants")
app.include_router(alumni_router, prefix="/api/v1/alumni")
app.include_router(admin_status_router, prefix="/api/v1")


@app.middleware("http")
async def add_request_context(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000

    response.headers["x-request-id"] = request_id
    response.headers["x-response-time-ms"] = f"{duration_ms:.2f}"
    
    # Extract user ID if token present
    user_id = None
    auth_header = request.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            token_data = decode_access_token(auth_header[7:])
            if token_data:
                user_id = token_data.get("user_id")
        except Exception:
            pass

    logger.info(json.dumps({
        "event": "http_request",
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "duration_ms": int(duration_ms),
        "request_id": request_id,
        "user_id": user_id
    }))
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    logger.exception(
        f"Unhandled error on {request.method} {request.url.path} "
        f"request_id={request_id}: {exc}"
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "request_id": request_id,
        },
        headers={"x-request-id": request_id},
    )


async def check_db_connection() -> bool:
    """Verify if the database is reachable."""
    try:
        from database.session import DatabaseEngine
        from sqlalchemy import text
        engine = DatabaseEngine.get_engine()
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"Health check database connection failed: {e}")
        return False


@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "version": "1.0.0",
        "status": "running",
        "environment": settings.app_env,
    }


@app.get("/health")
async def health_check():
    """Liveness probe: verifies that the HTTP server is alive and responding."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": "1.0.0",
    }


@app.get("/health/ready")
async def readiness_check():
    """Readiness probe: verifies backing database connectivity and configuration settings."""
    db_connected = await check_db_connection()
    status_code = 200 if db_connected else 503
    
    # Check log directory writeable
    logs_ok = True
    try:
        test_file = Path("logs/ready_test.txt")
        test_file.write_text("ok")
        test_file.unlink()
    except Exception:
        logs_ok = False
        
    content = {
        "status": "ready" if (db_connected and logs_ok) else "not_ready",
        "database_connected": db_connected,
        "logs_writeable": logs_ok,
        "nim_api_configured": bool(settings.nvidia_nim_api_key),
        "models": {
            "default": settings.nim_default_model,
            "vision": settings.nim_vision_model,
            "fast": settings.nim_fast_model,
        },
    }
    return JSONResponse(status_code=status_code, content=content)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
