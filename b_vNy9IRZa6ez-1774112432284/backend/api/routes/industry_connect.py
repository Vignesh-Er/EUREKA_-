from fastapi import APIRouter
from services.industry_engine import get_industry_opportunities

router = APIRouter()

@router.get("/{department}")
async def get_industry_view(department: str):
    return get_industry_opportunities(department)
