from fastapi import APIRouter, Depends
from services.placement_engine import placement_engine
from api.dependencies import require_auth

router = APIRouter(tags=["Placement Intelligence"], dependencies=[Depends(require_auth)])

@router.get("/")
async def placement_dashboard():
    return await placement_engine.generate_placement_report()

@router.get("/correlations")
async def get_correlations():
    return await placement_engine.analyze_correlations()

@router.get("/skill-gaps")
async def get_skill_gaps():
    # Overall cohort skill gaps for Admin view
    return await placement_engine.identify_skill_gaps()

@router.get("/students/{student_id}/readiness")
async def get_readiness_score(student_id: str):
    return await placement_engine.calculate_readiness_score(student_id)

@router.get("/students/{student_id}/skill-gaps")
async def get_student_skill_gaps(student_id: str):
    return await placement_engine.identify_student_skill_gaps(student_id)

@router.get("/students/{student_id}/matches")
async def get_student_matches(student_id: str):
    return await placement_engine.match_student_to_jobs(student_id)


