"""Syllabus Coverage API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from services.auth import decode_access_token
from services.syllabus_engine import syllabus_engine

router = APIRouter(prefix="/syllabus", tags=["Syllabus"])
security = HTTPBearer()

def _require_admin_or_prof(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("role") not in ["admin", "professor"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload

@router.get("/{course_id}/coverage")
async def get_coverage(course_id: str, _: dict = Depends(_require_admin_or_prof)):
    return await syllabus_engine.calculate_coverage(course_id)

@router.get("/{course_id}/comprehension")
async def get_comprehension(course_id: str, _: dict = Depends(_require_admin_or_prof)):
    return await syllabus_engine.comprehension_vs_coverage(course_id)

@router.get("/alerts")
async def get_alerts(_: dict = Depends(_require_admin_or_prof)):
    return await syllabus_engine.detect_lagging_professors()
