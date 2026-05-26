"""API module."""

from api.routes import admin_router, auth_router, professor_router, student_router, translation_router

__all__ = ["auth_router", "student_router", "professor_router", "admin_router", "translation_router"]
