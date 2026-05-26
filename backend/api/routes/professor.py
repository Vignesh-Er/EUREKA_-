"""Professor API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from services.auth import decode_access_token
from services.nvidia_engines import curriculum_context_engine, lecture_companion_engine

router = APIRouter(prefix="/professor", tags=["Professor"])
security = HTTPBearer()


def _require_professor(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("role") != "professor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Professor access required")
    return payload


@router.get("/profile")
async def get_profile(payload: dict = Depends(_require_professor)):
    return {"id": payload.get("user_id", "prof-1"), "email": payload.get("sub"), "name": "Dr. Ananya Kumar", "role": "professor"}


@router.get("/analytics")
async def get_analytics(_: dict = Depends(_require_professor)):
    return {"overall_avg_score": 79, "total_students": 77, "at_risk_students": 4}


@router.get("/courses")
async def get_courses(_: dict = Depends(_require_professor)):
    return {"courses": [{"id": "course-signals", "code": "ECE301", "name": "Signals and Systems"}]}


@router.get("/uploads")
async def get_uploads(_: dict = Depends(_require_professor)):
    return {"uploads": [{"id": 1, "name": "Lecture 12", "status": "processed"}]}


@router.get("/feedback")
async def get_feedback(_: dict = Depends(_require_professor)):
    return {"feedback": [{"id": "fb-1", "content": "Need more practical examples."}]}


@router.get("/insights")
async def get_insights(_: dict = Depends(_require_professor)):
    return {"insights": [{"type": "recommendation", "message": "Add more worked examples."}]}


@router.post("/upload")
async def upload_content(file: bytes, course_id: str, title: str, _: dict = Depends(_require_professor)):
    return {"upload_id": "upload-1", "course_id": course_id, "title": title, "status": "processing", "size": len(file)}


@router.post("/generate-context-card")
async def generate_context_card(topic: dict, _: dict = Depends(_require_professor)):
    return await curriculum_context_engine.generate_context_card(topic, {"name": "Signals and Systems", "code": "ECE301"})


@router.post("/lectures/{lecture_id}/process")
async def process_lecture(lecture_id: str, _: dict = Depends(_require_professor)):
    return await lecture_companion_engine.process_lecture({"id": lecture_id, "content": "Lecture content here..."})
