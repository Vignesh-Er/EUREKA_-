"""Parent models for the EUREKA platform."""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class ParentAlert(Base):
    __tablename__ = "parent_alerts"
    id = Column(String, primary_key=True)
    parent_id = Column(String, ForeignKey("users.id"))
    student_id = Column(String, ForeignKey("users.id"))
    type = Column(String) # attendance, grades, critical
    message = Column(Text)
    is_read = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class MonthlyReport(Base):
    __tablename__ = "monthly_reports"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    month_year = Column(String)
    narrative = Column(Text)
    highlights = Column(JSON)
    concerns = Column(JSON)
    generated_at = Column(DateTime, default=datetime.utcnow)
