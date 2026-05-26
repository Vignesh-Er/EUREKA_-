"""Foundation database models for auditing, feature flags, grading, alerts, and risk assessments."""

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from database.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    role = Column(String, nullable=True)
    action = Column(String, nullable=False, index=True)
    module = Column(String, nullable=False, index=True)
    detail = Column(String, nullable=True)
    ip = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", foreign_keys=[user_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String, nullable=False) # 'warning', 'info', 'success', 'error'
    priority = Column(String, default="normal") # 'low', 'normal', 'high'
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    read = Column(Boolean, default=False, nullable=False)
    dismissed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", foreign_keys=[user_id])


class PromptVersion(Base):
    __tablename__ = "prompt_versions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    engine_name = Column(String, nullable=False, index=True)
    version = Column(String, nullable=False)
    prompt_template = Column(String, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    activated_at = Column(DateTime, nullable=True)


class GradingSubmission(Base):
    __tablename__ = "grading_submissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    professor_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, nullable=False, index=True)
    image_hash = Column(String, nullable=True)
    rubric_text = Column(String, nullable=True)
    ai_score = Column(Float, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    human_score = Column(Float, nullable=True)
    status = Column(String, default="pending_review", nullable=False) # 'pending_review', 'confirmed', 'rejected'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    confirmed_at = Column(DateTime, nullable=True)

    student = relationship("User", foreign_keys=[student_id])
    professor = relationship("User", foreign_keys=[professor_id])
    files = relationship("GradingFile", back_populates="submission", cascade="all, delete-orphan")


class GradingFile(Base):
    __tablename__ = "grading_files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    submission_id = Column(Integer, ForeignKey("grading_submissions.id"), nullable=False)
    storage_path = Column(String, nullable=False)
    sha256_hash = Column(String, nullable=False)
    size_bytes = Column(Integer, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    submission = relationship("GradingSubmission", back_populates="files")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assessed_by = Column(String, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False)
    factors_json = Column(JSON, nullable=True)
    advisory_text = Column(String, nullable=True)
    status = Column(String, default="draft", nullable=False) # 'draft', 'approved', 'dismissed'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(String, ForeignKey("users.id"), nullable=True)

    student = relationship("User", foreign_keys=[student_id])
    assessor = relationship("User", foreign_keys=[assessed_by])
    approver = relationship("User", foreign_keys=[approved_by])


class DraftSubmission(Base):
    __tablename__ = "draft_submissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assignment_id = Column(String, nullable=False, index=True)
    draft_number = Column(Integer, nullable=False)
    content_hash = Column(String, nullable=False)
    ai_tools_declared = Column(JSON, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("User", foreign_keys=[student_id])


class CreditPortfolio(Base):
    __tablename__ = "credit_portfolio"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(String, nullable=False)
    course_name = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    nsqf_level = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)
    status = Column(String, default="earned", nullable=False) # 'earned', 'in_progress'
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("User", foreign_keys=[student_id])


class FeatureFlag(Base):
    __tablename__ = "feature_flags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    flag_name = Column(String, unique=True, nullable=False, index=True)
    enabled = Column(Boolean, default=False, nullable=False)
    wave = Column(Integer, nullable=False)
    description = Column(String, nullable=True)


from sqlalchemy import event

@event.listens_for(AuditLog, 'before_update')
def prevent_audit_log_update(mapper, connection, target):
    raise RuntimeError("Audit logs are immutable. Updates are strictly forbidden.")

@event.listens_for(AuditLog, 'before_delete')
def prevent_audit_log_delete(mapper, connection, target):
    raise RuntimeError("Audit logs are immutable. Deletions are strictly forbidden.")
