"""Accreditation models for the EUREKA platform."""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class CourseOutcome(Base):
    __tablename__ = "course_outcomes"
    id = Column(String, primary_key=True)
    course_id = Column(String, ForeignKey("courses.id"))
    code = Column(String) # e.g., CO1, CO2
    description = Column(Text)

class ProgramOutcome(Base):
    __tablename__ = "program_outcomes"
    id = Column(String, primary_key=True)
    code = Column(String) # e.g., PO1, PO2
    description = Column(Text)

class COPOMapping(Base):
    __tablename__ = "co_po_mappings"
    id = Column(String, primary_key=True)
    co_id = Column(String, ForeignKey("course_outcomes.id"))
    po_id = Column(String, ForeignKey("program_outcomes.id"))
    correlation_level = Column(Integer) # 1, 2, or 3

class AttainmentLevel(Base):
    __tablename__ = "attainment_levels"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    co_id = Column(String, ForeignKey("course_outcomes.id"))
    score = Column(Float)
    term = Column(String)

class AccreditationReport(Base):
    __tablename__ = "accreditation_reports"
    id = Column(String, primary_key=True)
    term = Column(String)
    type = Column(String) # NBA, NAAC
    status = Column(String)
    generated_at = Column(DateTime, default=datetime.utcnow)
    data = Column(JSON)
