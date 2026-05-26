"""API routes module."""

from .admin import router as admin_router
from .auth import router as auth_router
from .exam_prep import router as exam_prep_router
from .professor import router as professor_router
from .student import router as student_router
from .translation import router as translation_router
from .accreditation import router as accreditation_router
from .syllabus import router as syllabus_router
from .staff_performance import router as staff_performance_router
from .placement import router as placement_router
from .tool_utilization import router as tool_utilization_router
from .parent_portal import router as parent_portal_router
from .industry_connect import router as industry_connect_router
from .research_grants import router as research_grants_router
from .alumni import router as alumni_router
from .admin_status import router as admin_status_router

__all__ = [
    "admin_router",
    "auth_router",
    "exam_prep_router",
    "professor_router",
    "student_router",
    "translation_router",
    "accreditation_router",
    "syllabus_router",
    "staff_performance_router",
    "parent_portal_router",
    "industry_connect_router",
    "placement_router",
    "tool_utilization_router",
    "research_grants_router",
    "alumni_router",
    "admin_status_router",
]
