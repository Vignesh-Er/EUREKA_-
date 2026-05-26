from fastapi import APIRouter, Depends
from services.alumni_engine import get_alumni_mentors
from api.dependencies import require_auth

router = APIRouter(tags=["Alumni"], dependencies=[Depends(require_auth)])

@router.get("/{field}")
async def get_mentors(field: str):
    return get_alumni_mentors(field)
