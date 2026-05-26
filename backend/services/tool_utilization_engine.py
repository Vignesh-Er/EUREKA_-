"""Institutional lab resources and tools utilization analytics engine."""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from services.nvidia_engines import NVIDIAEngineBase
from config import settings


class ToolUtilizationEngine(NVIDIAEngineBase):
    """Audits tool ROI, generates utilization statistics, and drafts procurement suggestions."""

    async def calculate_roi(self, tool_id: str, db: Optional[AsyncSession] = None) -> dict:
        prompt = f"Evaluate ROI for educational software/hardware tool '{tool_id}' with cost per student $15 and 80% utilization."
        ai_res = await self._call_nim_api(
            model=settings.nim_fast_model,
            messages=[{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="tool_utilization",
            use_chat_key=True
        )
        ai_analysis = ai_res["choices"][0]["message"]["content"]

        return {
            'tool_id': tool_id,
            'cost_per_student': 15,
            'utilization': 80,
            'roi_score': 9.2,
            'ai_roi_justification': ai_analysis,
            '_meta': ai_res.get("_meta")
        }

    async def generate_utilization_report(self, db: Optional[AsyncSession] = None) -> list:
        prompt = "Assess university lab resources: MATLAB has 85% utilization, AutoCAD has 40% utilization."
        ai_res = await self._call_nim_api(
            model=settings.nim_default_model,
            messages=[{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="tool_utilization"
        )
        ai_analysis = ai_res["choices"][0]["message"]["content"]

        return [
            {
                'tool': 'MATLAB',
                'utilization': 85,
                'cost': 50000,
                'ai_audit_note': ai_analysis,
                '_meta': ai_res.get("_meta")
            },
            {
                'tool': 'AutoCAD',
                'utilization': 40,
                'cost': 35000,
                'ai_audit_note': "Low utilization detected. Consider reallocation or replacement.",
                '_meta': ai_res.get("_meta")
            }
        ]

    async def recommend_procurement(self, db: Optional[AsyncSession] = None) -> dict:
        prompt = "Provide strategic software procurement advice: MATLAB renewal high priority, AutoCAD low priority, SolidWorks evaluation suggested."
        ai_res = await self._call_nim_api(
            model=settings.nim_fast_model,
            messages=[{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="tool_utilization",
            use_chat_key=True
        )
        ai_analysis = ai_res["choices"][0]["message"]["content"]

        return {
            'recommendations': ['Renew MATLAB', 'Cancel AutoCAD', 'Evaluate SolidWorks'],
            'ai_procurement_rationale': ai_analysis,
            '_meta': ai_res.get("_meta")
        }


tool_utilization_engine = ToolUtilizationEngine()
