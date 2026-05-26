"""Migration script to transfer JSON Digital Twin records to SQLAlchemy database."""

import os
import sys
import json
import asyncio
from datetime import datetime

# Add root folder to sys path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.session import DatabaseEngine
from models import (
    User,
    StudentProfile,
    PlacementReadinessScore,
    CreditPortfolio,
)
from loguru import logger


async def migrate_twin_data():
    logger.info("Starting Digital Twin JSON to database migration...")
    session_maker = DatabaseEngine.get_session_maker()
    
    twin_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "digital_twin")
    if not os.path.exists(twin_dir):
        logger.warning(f"Digital Twin directory {twin_dir} does not exist. Skipping.")
        return
        
    json_files = [f for f in os.listdir(twin_dir) if f.endswith(".json")]
    if not json_files:
        logger.warning(f"No JSON files found in {twin_dir} to migrate.")
        return

    async with session_maker() as session:
        try:
            for file_name in json_files:
                file_path = os.path.join(twin_dir, file_name)
                logger.info(f"Processing digital twin file: {file_name}")
                
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    
                user_id = data.get("user_id")
                role = data.get("role")
                
                if role != "student" or not user_id:
                    continue
                    
                profile_data = data.get("profile", {})
                email = profile_data.get("email")
                name = profile_data.get("name")
                
                # Check/insert user record
                user = await session.get(User, user_id)
                if not user:
                    user = User(
                        id=user_id,
                        email=email,
                        name=name,
                        role=role
                    )
                    session.add(user)
                    logger.info(f"Inserted User {user_id}")
                else:
                    user.email = email
                    user.name = name
                    
                await session.flush()
                
                # Parse student details
                context_data = data.get("context_data", {})
                student_context = context_data.get("student_profile", {})
                placement_context = context_data.get("placement", {})
                custom_inputs = data.get("custom_inputs", {})
                
                level = student_context.get("level", 1)
                xp = student_context.get("xp", 0)
                streak = student_context.get("streak_days", 0)
                specialization = student_context.get("specialization", "AI Hardware Engineering")
                
                # Check/insert student profile
                sp = await session.get(StudentProfile, user_id)
                if not sp:
                    sp = StudentProfile(
                        user_id=user_id,
                        enrollment_year=2022,
                        specialization=specialization,
                        department="Computer Science & Engineering",
                        current_semester=6,
                        xp=xp,
                        level=level,
                        streak=streak
                    )
                    session.add(sp)
                    logger.info(f"Inserted StudentProfile for {user_id}")
                else:
                    sp.specialization = specialization
                    sp.xp = xp
                    sp.level = level
                    sp.streak = streak
                    
                # Migrate placement readiness if exists
                readiness_score = placement_context.get("score")
                if readiness_score:
                    from sqlalchemy import select
                    stmt = select(PlacementReadinessScore).where(PlacementReadinessScore.student_id == user_id).limit(1)
                    res = await session.execute(stmt)
                    prs = res.scalar_one_or_none()
                    
                    if not prs:
                        import uuid
                        prs = PlacementReadinessScore(
                            id=str(uuid.uuid4()),
                            student_id=user_id,
                            score=float(readiness_score),
                            breakdown={"academic_gpa": 85, "technical_skills": 85},
                            last_updated=datetime.utcnow()
                        )
                        session.add(prs)
                        logger.info(f"Migrated PlacementReadinessScore for {user_id}: {readiness_score}")
                        
                # Migrate credit portfolio (seed initial credits if not present)
                from sqlalchemy import select
                stmt_credit = select(CreditPortfolio).where(CreditPortfolio.student_id == user_id).limit(1)
                res_credit = await session.execute(stmt_credit)
                credit_exists = res_credit.scalar_one_or_none()
                
                if not credit_exists:
                    # Seed credits based on level
                    for sem in range(1, 6):
                        cp = CreditPortfolio(
                            student_id=user_id,
                            course_id=f"CS{100+sem}",
                            course_name=f"Computer Science Foundation Course {sem}",
                            credits=4,
                            nsqf_level=5 + (sem // 2),
                            semester=sem,
                            status="earned",
                            recorded_at=datetime.utcnow()
                        )
                        session.add(cp)
                    logger.info(f"Seeded simulated CreditPortfolio for student {user_id}")
                    
            await session.commit()
            logger.info("Digital twin migration finished successfully!")
            
        except Exception as e:
            await session.rollback()
            logger.error(f"Error during twin data migration: {e}")
            raise e


if __name__ == "__main__":
    asyncio.run(migrate_twin_data())
