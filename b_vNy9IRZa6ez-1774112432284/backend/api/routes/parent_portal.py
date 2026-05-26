from fastapi import APIRouter
from services.parent_engine import get_parent_insights

router = APIRouter()

@router.get("/{student_id}")
async def get_parent_view(student_id: str):
    return get_parent_insights(student_id)
