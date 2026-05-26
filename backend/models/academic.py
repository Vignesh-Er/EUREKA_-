"""Academic models for the EUREKA platform."""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class Lab(Base):
    __tablename__ = "labs"
    id = Column(String, primary_key=True)
    name = Column(String)
    short_name = Column(String)
    description = Column(Text)
    capacity = Column(Integer)
    location = Column(String)

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(Text)
    lab_id = Column(String, ForeignKey("labs.id"))

class Specialization(Base):
    __tablename__ = "specializations"
    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(Text)

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True)
    code = Column(String)
    name = Column(String)
    description = Column(Text)
    credits = Column(Integer)
    semester = Column(Integer)

class Topic(Base):
    __tablename__ = "topics"
    id = Column(String, primary_key=True)
    course_id = Column(String, ForeignKey("courses.id"))
    name = Column(String)
    description = Column(Text)

class ContextCard(Base):
    __tablename__ = "context_cards"
    id = Column(String, primary_key=True)
    topic_id = Column(String, ForeignKey("topics.id"))
    content = Column(JSON) # To store the diverse JSON structure

class Badge(Base):
    __tablename__ = "badges"
    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(Text)
    icon = Column(String)

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    progress = Column(Integer)

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(String, primary_key=True)
    topic_id = Column(String, ForeignKey("topics.id"))
    type = Column(String)

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True)
    assessment_id = Column(String, ForeignKey("assessments.id"))
    text = Column(Text)

class AssessmentResult(Base):
    __tablename__ = "assessment_results"
    id = Column(String, primary_key=True)
    assessment_id = Column(String, ForeignKey("assessments.id"))
    student_id = Column(String, ForeignKey("users.id"))
    score = Column(Float)

class Lecture(Base):
    __tablename__ = "lectures"
    id = Column(String, primary_key=True)
    course_id = Column(String, ForeignKey("courses.id"))
    title = Column(String)
    date = Column(DateTime)

class LectureCompanion(Base):
    __tablename__ = "lecture_companions"
    id = Column(String, primary_key=True)
    lecture_id = Column(String, ForeignKey("lectures.id"))
    summary = Column(Text)

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    course_id = Column(String, ForeignKey("courses.id"), nullable=True)
    content = Column(Text)
    sentiment = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class HardwareRequest(Base):
    __tablename__ = "hardware_requests"
    id = Column(String, primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    equipment_name = Column(String)
    description = Column(Text)
    status = Column(String)
    estimated_cost = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
