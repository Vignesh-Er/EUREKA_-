"""Audit logging service for tracking immutable sensitive user actions."""

from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from models.foundation import AuditLog
from loguru import logger


async def log_action(
    db: AsyncSession,
    user_id: str,
    role: str,
    action: str,
    module: str,
    detail: str = "",
    ip: str = ""
):
    """Write an immutable audit log entry to database and logs."""
    try:
        entry = AuditLog(
            user_id=user_id,
            role=role,
            action=action,
            module=module,
            detail=detail,
            ip=ip,
            timestamp=datetime.utcnow()
        )
        db.add(entry)
        await db.flush()
        logger.info(f"[AUDIT LOG] user={user_id}, role={role}, action={action}, module={module}, detail={detail}, ip={ip}")
    except Exception as e:
        logger.error(f"Failed to write audit log entry: {e}")
