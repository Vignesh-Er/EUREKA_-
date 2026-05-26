"""Admin API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from services.auth import decode_access_token
from services.nvidia_engines import admin_assistant_engine

router = APIRouter(prefix="/admin", tags=["Admin"])
security = HTTPBearer()


def _require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return payload


@router.get("/stats")
async def get_platform_stats(_: dict = Depends(_require_admin)):
    return {"total_students": 1250, "total_professors": 85, "total_courses": 156}


@router.get("/users")
async def get_users(_: dict = Depends(_require_admin)):
    return {"users": [{"id": "student-1", "email": "student@university.edu", "role": "student"}]}


@router.get("/requests")
async def get_requests(_: dict = Depends(_require_admin)):
    return {"hardware_requests": [{"id": "hw-1", "equipment_name": "NVIDIA Jetson Orin", "status": "pending"}]}


@router.get("/labs")
async def get_lab_utilization(_: dict = Depends(_require_admin)):
    return {"labs": [{"id": "lab-ai", "name": "Artificial Intelligence Laboratory", "utilization": 92}]}


@router.post("/requests/hardware/{request_id}/evaluate")
async def evaluate_hardware_request(request_id: str, _: dict = Depends(_require_admin)):
    request_data = {
        "equipment_name": "NVIDIA Jetson Orin",
        "description": "Edge AI development kit",
        "justification": "Essential for AI projects",
        "estimated_cost": 1999,
        "estimated_beneficiaries": 25,
        "relevant_courses": ["CS421", "ECE401"],
    }
    result = await admin_assistant_engine.evaluate_hardware_request(request_data)
    return {"request_id": request_id, "evaluation": result}


@router.get("/analytics/overview")
async def get_analytics_overview(_: dict = Depends(_require_admin)):
    return {"student_growth": [100, 120, 150], "assessment_completion": [65, 70, 75]}
