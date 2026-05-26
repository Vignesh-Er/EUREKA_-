"""Placement models for the EUREKA platform."""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class PlacementDrive(Base):
    __tablename__ = "placement_drives"
    id = Column(String, primary_key=True)
    company_name = Column(String)
    role_title = Column(String)
    description = Column(Text)
    required_skills = Column(JSON)
    date = Column(DateTime)

class StudentApplication(Base):
    __tablename__ = "student_applications"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    drive_id = Column(String, ForeignKey("placement_drives.id"))
    status = Column(String) # applied, shortlisted, interviewed, offered, accepted
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PlacementReadinessScore(Base):
    __tablename__ = "placement_readiness_scores"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    score = Column(Float)
    breakdown = Column(JSON) # e.g. {"technical": 80, "soft_skills": 70}
    last_updated = Column(DateTime, default=datetime.utcnow)

class SkillGap(Base):
    __tablename__ = "skill_gaps"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    target_role = Column(String)
    missing_skills = Column(JSON)
    recommendations = Column(JSON)
