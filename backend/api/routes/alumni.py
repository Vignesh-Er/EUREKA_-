"""Alumni mentoring dynamic matching API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from services.rbac import RBACPolicy
from services.alumni_engine import alumni_engine
from api.response import success_response

router = APIRouter(prefix="/alumni", tags=["Alumni Network"])


@router.get("/matches/{student_id}")
async def get_alumni_matches(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_self_or_role("student_id", "admin", "professor"))
):
    """Retrieve personalized alumni matches for student. RBAC: Student owner or Admin/Professor."""
    result = await alumni_engine.get_alumni_matches(student_id, db=db)
    source = "nim" if any(r.get("_meta", {}).get("source") == "nim" for r in result) else "fallback"
    return success_response(result, source=source)
