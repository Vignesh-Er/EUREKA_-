"""Staff Performance API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from services.auth import decode_access_token
from services.staff_performance_engine import staff_performance_engine

router = APIRouter(prefix="/staff/performance", tags=["Staff Performance"])
security = HTTPBearer()

def _require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return payload

@router.get("/{professor_id}")
async def get_performance(professor_id: str, _: dict = Depends(_require_admin)):
    return await staff_performance_engine.calculate_teaching_score(professor_id)

@router.get("/{professor_id}/trend")
async def get_trend(professor_id: str, _: dict = Depends(_require_admin)):
    return await staff_performance_engine.trend_analysis(professor_id)

@router.get("/{professor_id}/talking-points")
async def get_talking_points(professor_id: str, _: dict = Depends(_require_admin)):
    return await staff_performance_engine.generate_talking_points(professor_id)
