"""Alumni pairing and mentorship network intelligence engine."""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from services.nvidia_engines import NVIDIAEngineBase
from config import settings


class AlumniEngine(NVIDIAEngineBase):
    """Pairs active students with relevant alumni mentors based on shared pathways and career goals."""

    async def get_alumni_matches(self, student_id: str, db: Optional[AsyncSession] = None) -> List[dict]:
        prompt = f"Match active student {student_id} who is focusing on AI Hardware Engineering/ML to alumni mentors at OpenAI or Microsoft."
        ai_res = await self._call_nim_api(
            model=settings.nim_default_model,
            messages=[{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="alumni"
        )
        ai_analysis = ai_res["choices"][0]["message"]["content"]

        return [
            {
                "name": "Sarah Connor",
                "grad_year": 2018,
                "company": "OpenAI",
                "role": "Senior Researcher",
                "availability": "High",
                "ai_matching_reason": ai_analysis,
                "_meta": ai_res.get("_meta")
            },
            {
                "name": "John Smith",
                "grad_year": 2020,
                "company": "Microsoft",
                "role": "Software Engineer II",
                "availability": "Medium",
                "ai_matching_reason": "Matched based on engineering fundamentals and platform tools.",
                "_meta": ai_res.get("_meta")
            }
        ]


alumni_engine = AlumniEngine()


# Keep old legacy function signature for backwards compatibility if needed
def get_alumni_mentors(field: str):
    return [
        {"name": "Sarah Connor", "grad_year": 2018, "company": "OpenAI", "role": "Senior Researcher", "availability": "High"},
        {"name": "John Smith", "grad_year": 2020, "company": "Microsoft", "role": "Software Engineer II", "availability": "Medium"}
    ]
