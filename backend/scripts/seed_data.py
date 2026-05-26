"""Seeding database with default users, prompt versions, and feature flags."""

import os
import sys
import asyncio
from datetime import datetime

# Add root folder to sys path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.session import DatabaseEngine
from database.base import Base
from models import (
    User,
    StudentProfile,
    ProfessorProfile,
    ParentProfile,
    PromptVersion,
    FeatureFlag,
)
from services.prompt_registry import prompt_registry
from loguru import logger


async def seed():
    logger.info("Starting database seeding...")
    session_maker = DatabaseEngine.get_session_maker()
    
    async with session_maker() as session:
        try:
            # 1. Seed Users
            users_to_seed = [
                {
                    "id": "student-1",
                    "email": "student@university.edu",
                    "name": "Alex Chen",
                    "role": "student",
                    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
                },
                {
                    "id": "prof-1",
                    "email": "prof@university.edu",
                    "name": "Dr. Ananya Kumar",
                    "role": "professor",
                    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
                },
                {
                    "id": "admin-1",
                    "email": "admin@university.edu",
                    "name": "System Administrator",
                    "role": "admin",
                    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"
                },
                {
                    "id": "parent-1",
                    "email": "parent@university.edu",
                    "name": "David Chen",
                    "role": "parent",
                    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"
                }
            ]

            for u_data in users_to_seed:
                # Avoid duplicates
                existing = await session.get(User, u_data["id"])
                if not existing:
                    u = User(**u_data)
                    session.add(u)
                    logger.info(f"Seeded User: {u.name} ({u.role})")
            
            await session.flush()

            # Seed Student Profile
            student_profile_exists = await session.get(StudentProfile, "student-1")
            if not student_profile_exists:
                sp = StudentProfile(
                    user_id="student-1",
                    enrollment_year=2022,
                    specialization="AI Hardware Engineering",
                    department="Computer Science & Engineering",
                    current_semester=6,
                    xp=2450,
                    level=8,
                    streak=12
                )
                session.add(sp)
                logger.info("Seeded student profile for student-1")

            # Seed Professor Profile
            professor_profile_exists = await session.get(ProfessorProfile, "prof-1")
            if not professor_profile_exists:
                pp = ProfessorProfile(
                    user_id="prof-1",
                    department="Computer Science & Engineering",
                    rating=4.9
                )
                session.add(pp)
                logger.info("Seeded professor profile for prof-1")

            # Seed Parent Profile
            parent_profile_exists = await session.get(ParentProfile, "parent-1")
            if not parent_profile_exists:
                p_prof = ParentProfile(
                    user_id="parent-1",
                    student_id="student-1",
                    phone="+15550199"
                )
                session.add(p_prof)
                logger.info("Seeded parent profile for parent-1 (linked to student-1)")

            await session.flush()

            # 2. Seed Prompt Versions from prompts directory
            engines = [
                "exam_prep", "accreditation", "placement", "exam_generator", "vision_grading",
                "early_warning", "syllabus", "staff_performance", "tool_utilization",
                "discovery", "alumni", "research_grants", "industry_connect"
            ]

            for eng in engines:
                # Check if prompt version already exists for this engine
                from sqlalchemy import select
                stmt = select(PromptVersion).where(PromptVersion.engine_name == eng).limit(1)
                res = await session.execute(stmt)
                existing_prompt = res.scalar_one_or_none()

                if not existing_prompt:
                    # Read from YAML
                    template = prompt_registry._get_fallback_prompt(eng)
                    pv = PromptVersion(
                        engine_name=eng,
                        version="1.0.0",
                        prompt_template=template,
                        is_active=True,
                        created_by="system",
                        created_at=datetime.utcnow(),
                        activated_at=datetime.utcnow()
                    )
                    session.add(pv)
                    logger.info(f"Seeded Prompt Version 1.0.0 for engine: {eng}")

            await session.flush()

            # 3. Seed Feature Flags
            flags_to_seed = [
                {"flag_name": "wave0_rbac", "wave": 0, "enabled": True, "description": "Enable RBAC checks and authorization headers"},
                {"flag_name": "wave1_sse_streaming", "wave": 1, "enabled": True, "description": "Enable SSE real-time token streaming"},
                {"flag_name": "wave1_mock_activation_a", "wave": 1, "enabled": True, "description": "Activate Batch A mock engines with NIM integration"},
                {"flag_name": "wave1_mock_activation_b", "wave": 1, "enabled": True, "description": "Activate Batch B mock engines with NIM integration"},
                {"flag_name": "wave2_exam_generator", "wave": 2, "enabled": False, "description": "AI Exam Paper Generator dashboard and API"},
                {"flag_name": "wave2_unified_accreditation", "wave": 2, "enabled": False, "description": "NBA + NAAC + NIRF Unified accreditation dashboard"},
                {"flag_name": "wave2_vision_grading", "wave": 2, "enabled": False, "description": "AI Vision-assisted grading and confirmation panel"},
                {"flag_name": "wave3_early_warning", "wave": 3, "enabled": False, "description": "Early Warning dashboard and Parent Portal risk scores"},
                {"flag_name": "wave3_knowledge_graph", "wave": 3, "enabled": False, "description": "Concepts knowledge graph backing layer"},
                {"flag_name": "wave4_abc", "wave": 4, "enabled": False, "description": "Simulated Academic Bank of Credits dashboard"},
                {"flag_name": "wave4_multilingual", "wave": 4, "enabled": False, "description": "On-demand multilingual content translations"},
                {"flag_name": "wave4_integrity", "wave": 4, "enabled": False, "description": "Process-evidence Academic Integrity dashboard"},
                {"flag_name": "wave4_agents", "wave": 4, "enabled": False, "description": "Lightweight institutional background agents"}
            ]

            for flag in flags_to_seed:
                stmt = select(FeatureFlag).where(FeatureFlag.flag_name == flag["flag_name"]).limit(1)
                res = await session.execute(stmt)
                existing_flag = res.scalar_one_or_none()

                if not existing_flag:
                    ff = FeatureFlag(**flag)
                    session.add(ff)
                    logger.info(f"Seeded Feature Flag: {ff.flag_name} = {ff.enabled} (Wave {ff.wave})")

            await session.commit()
            logger.info("Database seeding finished successfully!")

        except Exception as e:
            await session.rollback()
            logger.error(f"Error seeding database: {e}")
            raise e


if __name__ == "__main__":
    asyncio.run(seed())
