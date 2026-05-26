"""User model placeholders used by the demo backend."""

from enum import Enum
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base


class UserRole(str, Enum):
    STUDENT = "student"
    PROFESSOR = "professor"
    ADMIN = "admin"
    PARENT = "parent"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    enrollment_year = Column(Integer)
    specialization = Column(String, nullable=True)
    department = Column(String, nullable=True)
    current_semester = Column(Integer)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    
    user = relationship("User")

class ProfessorProfile(Base):
    __tablename__ = "professor_profiles"
    
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    department = Column(String)
    rating = Column(Float, default=0.0)
    
    user = relationship("User")

class ParentProfile(Base):
    __tablename__ = "parent_profiles"
    
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    student_id = Column(String, ForeignKey("users.id"))
    phone = Column(String, nullable=True)
    
    user = relationship("User", foreign_keys=[user_id])
    student = relationship("User", foreign_keys=[student_id])

