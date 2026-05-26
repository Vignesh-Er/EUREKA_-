"""Syllabus Coverage API routes with robust RBAC and response envelopes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from services.rbac import RBACPolicy
from services.syllabus_engine import syllabus_engine
from api.response import success_response, error_response

router = APIRouter(prefix="/syllabus", tags=["Syllabus"])


@router.get("/{course_id}/coverage")
async def get_coverage(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_professor_of("course_id"))
):
    """Retrieve syllabus coverage analysis. RBAC: Professor of course or Admin."""
    result = await syllabus_engine.calculate_coverage(course_id, db=db)
    source = "nim" if result.get("_meta", {}).get("source") == "nim" else "fallback"
    return success_response(result, source=source)


@router.get("/{course_id}/comprehension")
async def get_comprehension(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_professor_of("course_id"))
):
    """Retrieve syllabus comprehension-coverage gap analysis."""
    result = await syllabus_engine.comprehension_vs_coverage(course_id, db=db)
    source = "nim" if result.get("_meta", {}).get("source") == "nim" else "fallback"
    return success_response(result, source=source)


@router.get("/alerts")
async def get_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_role("admin", "professor"))
):
    """Retrieve pacing warning alerts across all courses."""
    result = await syllabus_engine.detect_lagging_professors(db=db)
    return success_response(result, source="database")
