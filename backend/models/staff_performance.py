"""Staff Performance models for the EUREKA platform."""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class TeachingIntelligenceScore(Base):
    __tablename__ = "teaching_intelligence_scores"
    id = Column(String, primary_key=True)
    professor_id = Column(String, ForeignKey("users.id"))
    term = Column(String)
    composite_score = Column(Float)
    components = Column(JSON) # syllabus_coverage, student_comprehension, feedback_sentiment, etc.
    calculated_at = Column(DateTime, default=datetime.utcnow)

class PerformanceTrend(Base):
    __tablename__ = "performance_trends"
    id = Column(String, primary_key=True)
    professor_id = Column(String, ForeignKey("users.id"))
    metric = Column(String)
    values = Column(JSON) # Array of historical values
    
class ReviewTalkingPoint(Base):
    __tablename__ = "review_talking_points"
    id = Column(String, primary_key=True)
    professor_id = Column(String, ForeignKey("users.id"))
    term = Column(String)
    point = Column(Text)
    category = Column(String) # strength, improvement_area
    created_at = Column(DateTime, default=datetime.utcnow)

class SyllabusCoverage(Base):
    __tablename__ = "syllabus_coverages"
    id = Column(String, primary_key=True)
    course_id = Column(String, ForeignKey("courses.id"))
    professor_id = Column(String, ForeignKey("users.id"))
    term = Column(String)
    expected_percentage = Column(Float)
    actual_percentage = Column(Float)
    last_updated = Column(DateTime, default=datetime.utcnow)
