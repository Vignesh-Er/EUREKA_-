from fastapi import APIRouter, Depends
from services.tool_utilization_engine import ToolUtilizationEngine
from api.dependencies import require_auth

router = APIRouter(tags=["Tool Utilization"], dependencies=[Depends(require_auth)])
@router.get("/")
async def tools_dashboard():
    return await ToolUtilizationEngine.generate_utilization_report()

@router.get("/roi")
async def tools_roi():
    return await ToolUtilizationEngine.calculate_roi("all")

@router.get("/recommendations")
async def procurement_recommendations():
    return await ToolUtilizationEngine.recommend_procurement()

