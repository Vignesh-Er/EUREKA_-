from fastapi import APIRouter, Depends
from services.industry_engine import get_industry_opportunities
from api.dependencies import require_auth

router = APIRouter(tags=["Industry Connect"], dependencies=[Depends(require_auth)])

@router.get("/{department}")
async def get_industry_view(department: str):
    return get_industry_opportunities(department)
