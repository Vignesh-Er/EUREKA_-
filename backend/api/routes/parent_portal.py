from fastapi import APIRouter, Depends
from services.parent_engine import get_parent_insights
from api.dependencies import require_auth

router = APIRouter(tags=["Parent Portal"], dependencies=[Depends(require_auth)])

@router.get("/{student_id}")
async def get_parent_view(student_id: str):
    return get_parent_insights(student_id)
