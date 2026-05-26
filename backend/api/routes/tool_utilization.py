"""Procurement, ROI, and lab tools utilization API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from services.rbac import RBACPolicy
from services.tool_utilization_engine import tool_utilization_engine
from api.response import success_response

# Main.py includes this with prefix="/api/v1/tool-utilization", so we define paths relative to that.
router = APIRouter(tags=["Tool Utilization"])


@router.get("/")
async def tools_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_role("admin"))
):
    """Retrieve full lab resources utilization report. RBAC: Admin only."""
    result = await tool_utilization_engine.generate_utilization_report(db=db)
    source = "nim" if any(r.get("_meta", {}).get("source") == "nim" for r in result) else "fallback"
    return success_response(result, source=source)


@router.get("/roi/{tool_id}")
async def tools_roi(
    tool_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_role("admin"))
):
    """Retrieve cost-per-student ROI metrics for a specific tool. RBAC: Admin only."""
    result = await tool_utilization_engine.calculate_roi(tool_id, db=db)
    source = "nim" if result.get("_meta", {}).get("source") == "nim" else "fallback"
    return success_response(result, source=source)


@router.get("/recommendations")
async def procurement_recommendations(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(RBACPolicy.require_role("admin"))
):
    """Retrieve AI-driven lab software procurement recommendations. RBAC: Admin only."""
    result = await tool_utilization_engine.recommend_procurement(db=db)
    source = "nim" if result.get("_meta", {}).get("source") == "nim" else "fallback"
    return success_response(result, source=source)
