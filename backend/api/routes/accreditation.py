"""Accreditation API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from typing import List
from services.auth import decode_access_token
from services.accreditation_engine import accreditation_engine

router = APIRouter(prefix="/accreditation", tags=["Accreditation"])
security = HTTPBearer()

class ExamAnalysisRequest(BaseModel):
    exam_text: str
    course_id: str
    cos: List[str]

def _require_admin_or_prof(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("role") not in ["admin", "professor"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload

@router.get("/dashboard")
async def get_dashboard(_: dict = Depends(_require_admin_or_prof)):
    return await accreditation_engine.calculate_readiness()

@router.get("/attainment/{course_id}")
async def get_attainment(course_id: str, _: dict = Depends(_require_admin_or_prof)):
    return await accreditation_engine.calculate_attainment(course_id)

@router.post("/report/generate/{term}")
async def generate_report(term: str, _: dict = Depends(_require_admin_or_prof)):
    return await accreditation_engine.generate_nba_report(term)

@router.post("/analyze-exam")
async def analyze_exam(req: ExamAnalysisRequest, _: dict = Depends(_require_admin_or_prof)):
    return await accreditation_engine.analyze_exam_paper(req.exam_text, req.course_id, req.cos)

