from fastapi import APIRouter, Depends
from services.research_engine import get_grants
from api.dependencies import require_auth

router = APIRouter(tags=["Research Grants"], dependencies=[Depends(require_auth)])

@router.get("/{department}")
async def get_department_grants(department: str):
    return get_grants(department)
