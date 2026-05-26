"""Industry and Connect models for the EUREKA platform."""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class IndustryProblem(Base):
    __tablename__ = "industry_problems"
    id = Column(String, primary_key=True)
    company_name = Column(String)
    title = Column(String)
    description = Column(Text)
    tags = Column(JSON)
    difficulty = Column(String)
    posted_at = Column(DateTime, default=datetime.utcnow)

class AlumniMentor(Base):
    __tablename__ = "alumni_mentors"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    company = Column(String)
    role = Column(String)
    graduation_year = Column(Integer)
    domain_expertise = Column(JSON)

class JDPulseEntry(Base):
    __tablename__ = "jd_pulse_entries"
    id = Column(String, primary_key=True)
    role_category = Column(String)
    trending_skills = Column(JSON)
    analyzed_count = Column(Integer)
    date_analyzed = Column(DateTime, default=datetime.utcnow)

class ProjectShowcase(Base):
    __tablename__ = "project_showcases"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    title = Column(String)
    description = Column(Text)
    media_url = Column(String, nullable=True)
    is_public = Column(Integer, default=1)
    published_at = Column(DateTime, default=datetime.utcnow)
