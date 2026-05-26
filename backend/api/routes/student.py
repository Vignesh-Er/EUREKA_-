"""Student API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from services.auth import decode_access_token
from services.nvidia_engines import discovery_engine

router = APIRouter(prefix="/student", tags=["Student"])
security = HTTPBearer()


def _require_student(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("role") != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student access required")
    return payload


@router.get("/profile")
async def get_profile(payload: dict = Depends(_require_student)):
    return {
        "id": payload.get("user_id", "student-1"),
        "email": payload.get("sub", "student@university.edu"),
        "name": "Alex Chen",
        "role": "student",
        "specialization": "AI Hardware Engineering",
        "current_semester": 4,
    }


@router.get("/dashboard")
async def get_dashboard(_: dict = Depends(_require_student)):
    return {
        "progress": 45,
        "mastery_score": 78,
        "today_items": [{"id": 1, "type": "lecture", "title": "Control Systems", "time": "09:00 AM"}],
    }


@router.get("/today")
async def get_today_schedule(_: dict = Depends(_require_student)):
    return {"date": "2026-03-22", "items": [{"id": 1, "type": "assessment", "title": "Fourier Quiz"}]}


@router.get("/context-card/{card_id}")
async def get_context_card(card_id: str, _: dict = Depends(_require_student)):
    return {"id": card_id, "topic_name": "Fourier Transform", "confidence": 0.95}


@router.get("/courses")
async def get_courses(_: dict = Depends(_require_student)):
    return {"courses": [{"id": "course-signals", "code": "ECE301", "name": "Signals and Systems"}]}


@router.get("/roadmap")
async def get_roadmap(_: dict = Depends(_require_student)):
    return {"id": "roadmap-1", "current_semester": 4, "progress": 45}


@router.post("/analyze-interests")
async def analyze_interests(payload: dict = Depends(_require_student)):
    result = await discovery_engine.analyze_student_interests(payload.get("user_id", "student-1"), [])
    return result


@router.post("/recommend-specializations")
async def recommend_specializations(_: dict = Depends(_require_student)):
    return {"recommendations": ["AI Hardware Engineering", "Robotics"]}


@router.get("/assessments")
async def get_assessments(_: dict = Depends(_require_student)):
    return {"assessments": [{"id": "assess-1", "topic_name": "Fourier Transform", "difficulty": 3}]}


@router.post("/assessments/{assessment_id}/submit")
async def submit_assessment(assessment_id: str, answers: dict, _: dict = Depends(_require_student)):
    return {"assessment_id": assessment_id, "answers": answers, "score": 85, "max_score": 100}


@router.get("/badges")
async def get_badges(_: dict = Depends(_require_student)):
    return {"badges": [{"id": "badge-explorer", "name": "Lab Explorer"}]}


@router.get("/discovery/labs")
async def get_labs(_: dict = Depends(_require_student)):
    return {"labs": [{"id": "lab-ai", "name": "Artificial Intelligence Laboratory", "capacity": 40}]}
