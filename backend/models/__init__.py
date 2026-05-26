"""Database models exports."""

from models.academic import (
    Assessment,
    AssessmentResult,
    Badge,
    ContextCard,
    Course,
    Feedback,
    HardwareRequest,
    Lab,
    LearningRoadmap,
    Lecture,
    LectureCompanion,
    Project,
    Question,
    Specialization,
    Topic,
)
from models.user import User, UserRole, StudentProfile, ProfessorProfile, ParentProfile
from models.accreditation import CourseOutcome, ProgramOutcome, COPOMapping, AttainmentLevel, AccreditationReport
from models.placement import PlacementDrive, StudentApplication, PlacementReadinessScore, SkillGap
from models.staff_performance import TeachingIntelligenceScore, PerformanceTrend, ReviewTalkingPoint, SyllabusCoverage
from models.parent import ParentAlert, MonthlyReport
from models.industry import IndustryProblem, AlumniMentor, JDPulseEntry, ProjectShowcase

__all__ = [
    "User",
    "UserRole",
    "StudentProfile",
    "ProfessorProfile",
    "ParentProfile",
    "Lab",
    "Project",
    "Specialization",
    "Course",
    "Topic",
    "ContextCard",
    "Badge",
    "LearningRoadmap",
    "Assessment",
    "Question",
    "AssessmentResult",
    "Lecture",
    "LectureCompanion",
    "Feedback",
    "HardwareRequest",
    "CourseOutcome",
    "ProgramOutcome",
    "COPOMapping",
    "AttainmentLevel",
    "AccreditationReport",
    "PlacementDrive",
    "StudentApplication",
    "PlacementReadinessScore",
    "SkillGap",
    "TeachingIntelligenceScore",
    "PerformanceTrend",
    "ReviewTalkingPoint",
    "SyllabusCoverage",
    "ParentAlert",
    "MonthlyReport",
    "IndustryProblem",
    "AlumniMentor",
    "JDPulseEntry",
    "ProjectShowcase",
]
