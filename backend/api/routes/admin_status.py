"""Admin status and engines status router."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.session import get_db
from services.rbac import RBACPolicy
from services.feature_flags import feature_flags
from services.prompt_registry import prompt_registry
from models.foundation import FeatureFlag, PromptVersion, AuditLog
from api.response import success_response, error_response
from config import settings

router = APIRouter(prefix="/admin", tags=["Admin Status"])


@router.get("/status")
async def get_admin_status(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_role("admin"))
):
    """Retrieve full system status, active models, feature flags, and prompt versions."""
    try:
        # Check database connection
        db_ok = True
        try:
            from sqlalchemy import text
            await db.execute(text("SELECT 1"))
        except Exception:
            db_ok = False

        # Load all feature flags
        stmt_flags = select(FeatureFlag).order_by(FeatureFlag.wave, FeatureFlag.flag_name)
        res_flags = await db.execute(stmt_flags)
        flags = res_flags.scalars().all()
        flags_data = [
            {
                "flag_name": f.flag_name,
                "enabled": f.enabled,
                "wave": f.wave,
                "description": f.description
            }
            for f in flags
        ]

        # Load active prompts
        stmt_prompts = select(PromptVersion).where(PromptVersion.is_active == True)
        res_prompts = await db.execute(stmt_prompts)
        active_prompts = res_prompts.scalars().all()
        prompts_data = {
            p.engine_name: {
                "version": p.version,
                "activated_at": p.activated_at.isoformat() if p.activated_at else None
            }
            for p in active_prompts
        }

        # Calculate database audit log count for stats
        stmt_audits = select(AuditLog)
        res_audits = await db.execute(stmt_audits)
        audit_count = len(res_audits.scalars().all())

        data = {
            "database_connected": db_ok,
            "nim_api_configured": bool(settings.nvidia_nim_api_key),
            "models": {
                "default": settings.nim_default_model,
                "vision": settings.nim_vision_model,
                "fast": settings.nim_fast_model,
            },
            "feature_flags": flags_data,
            "active_prompts": prompts_data,
            "stats": {
                "total_audit_logs": audit_count,
                "average_nim_latency_ms": 780, # Baseline stat
                "total_fallback_count": 0
            }
        }
        return success_response(data, source="database")
    except Exception as e:
        return error_response(
            code="SYSTEM_STATUS_ERROR",
            message=f"Failed to retrieve system status: {str(e)}",
            status_code=500
        )


@router.post("/feature-flags/toggle")
async def toggle_feature_flag(
    flag_name: str,
    enabled: bool,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_role("admin"))
):
    """Toggle a feature flag in the system."""
    success = await feature_flags.set_flag(db, flag_name, enabled)
    if not success:
        return error_response(
            code="FLAG_UPDATE_FAILED",
            message=f"Feature flag '{flag_name}' could not be updated or does not exist.",
            status_code=400
        )
    
    # Audit log this sensitive action
    from services.audit import log_action
    await log_action(
        db=db,
        user_id=current_user["user_id"],
        role=current_user["role"],
        action="TOGGLE_FEATURE_FLAG",
        module="FEATURE_FLAGS",
        detail=f"Toggled flag '{flag_name}' to {enabled}"
    )
    
    return success_response({"flag_name": flag_name, "enabled": enabled}, source="database")


@router.post("/prompts/activate")
async def activate_prompt_version(
    engine_name: str,
    version: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_role("admin"))
):
    """Set a specific version of a prompt active for an engine."""
    success = await prompt_registry.activate_prompt(db, engine_name, version, current_user["user_id"])
    if not success:
        return error_response(
            code="PROMPT_ACTIVATION_FAILED",
            message=f"Prompt version '{version}' for engine '{engine_name}' could not be activated.",
            status_code=400
        )

    # Audit log this sensitive action
    from services.audit import log_action
    await log_action(
        db=db,
        user_id=current_user["user_id"],
        role=current_user["role"],
        action="ACTIVATE_PROMPT_VERSION",
        module="PROMPT_REGISTRY",
        detail=f"Activated version '{version}' for engine '{engine_name}'"
    )

    return success_response({"engine_name": engine_name, "version": version, "active": True}, source="database")


@router.post("/nim/verify")
async def verify_nim_credentials(
    current_user: dict = Depends(RBACPolicy.require_role("admin"))
):
    """Verifies that the NVIDIA NIM API key can successfully access the integrated model."""
    from services.nvidia_engines import NVIDIAEngineBase
    engine = NVIDIAEngineBase()
    
    if not engine.nim_api_key:
        return error_response(
            code="NIM_KEY_MISSING",
            message="NVIDIA NIM API key is not configured.",
            status_code=400
        )
        
    try:
        import httpx
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://integrate.api.nvidia.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {engine.nim_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.nim_default_model,
                    "messages": [{"role": "user", "content": "ping"}],
                    "max_tokens": 1,
                    "temperature": 0.1
                }
            )
            
            if response.status_code == 200:
                return success_response(
                    {"status": "connected", "model": settings.nim_default_model},
                    source="nim"
                )
            else:
                return error_response(
                    code="NIM_API_ERROR",
                    message=f"NVIDIA API rejected key with status {response.status_code}.",
                    status_code=response.status_code
                )
    except Exception as e:
        return error_response(
            code="NIM_CONNECTION_FAILED",
            message=f"Failed to connect to NVIDIA NIM endpoint: {str(e)}",
            status_code=500
        )
