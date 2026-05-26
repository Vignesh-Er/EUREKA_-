"""Tests for Role-Based Access Control (RBAC) policy logic."""

import pytest
from fastapi import FastAPI, Depends, status
from fastapi.testclient import TestClient
from services.rbac import RBACPolicy, get_current_user
from services.auth import create_access_token

# Create a test FastAPI app to verify RBAC policies
app = FastAPI()


# Test endpoints simulating real platform resources
@app.get("/test/student-only")
async def student_only(user = Depends(RBACPolicy.require_role("student"))):
    return {"message": "success", "user": user}


@app.get("/test/professor-only")
async def professor_only(user = Depends(RBACPolicy.require_role("professor"))):
    return {"message": "success", "user": user}


@app.get("/test/admin-only")
async def admin_only(user = Depends(RBACPolicy.require_role("admin"))):
    return {"message": "success", "user": user}


@app.get("/test/student/{student_id}/profile")
async def student_profile(student_id: str, user = Depends(RBACPolicy.require_self_or_role("student_id", "admin"))):
    return {"message": "success", "student_id": student_id, "user": user}


@app.get("/test/student/{student_id}/risk")
async def student_risk(student_id: str, user = Depends(RBACPolicy.require_parent_of("student_id"))):
    return {"message": "success", "student_id": student_id, "user": user}


@app.get("/test/course/{course_id}/accreditation")
async def course_accreditation(course_id: str, user = Depends(RBACPolicy.require_professor_of("course_id"))):
    return {"message": "success", "course_id": course_id, "user": user}


client = TestClient(app)


def test_unauthenticated_request():
    """Unauthenticated request to sensitive endpoint returns 401."""
    response = client.get("/test/admin-only")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_student_accesses_own_twin():
    """Student accesses their own digital twin -> Allowed."""
    headers = {"Authorization": "Bearer demo-token-student-1"}
    response = client.get("/test/student/student-1/profile", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["student_id"] == "student-1"


def test_student_accesses_another_student_twin():
    """Student accesses another student's twin -> 403."""
    headers = {"Authorization": "Bearer demo-token-student-1"}
    response = client.get("/test/student/student-2/profile", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_parent_accesses_linked_child_risk():
    """Parent accesses linked child's risk report -> Allowed."""
    headers = {"Authorization": "Bearer demo-token-parent-1"} # Linked to student-1
    response = client.get("/test/student/student-1/risk", headers=headers)
    assert response.status_code == status.HTTP_200_OK


def test_parent_accesses_unlinked_child_risk():
    """Parent accesses unlinked child's risk report -> 403."""
    headers = {"Authorization": "Bearer demo-token-parent-1"} # Linked to student-1
    response = client.get("/test/student/student-2/risk", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_professor_accesses_assigned_course():
    """Professor accesses assigned course accreditation -> Allowed."""
    headers = {"Authorization": "Bearer demo-token-prof-1"} # Assigned to CS101, CS201
    response = client.get("/test/course/CS101/accreditation", headers=headers)
    assert response.status_code == status.HTTP_200_OK


def test_professor_accesses_unassigned_course():
    """Professor accesses unassigned course -> 403."""
    headers = {"Authorization": "Bearer demo-token-prof-1"} # Assigned to CS101, CS201
    response = client.get("/test/course/MATH301/accreditation", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_admin_accesses_any_module():
    """Admin accesses any module -> Allowed."""
    headers = {"Authorization": "Bearer demo-token-admin-1"}
    
    # Can access admin only
    r1 = client.get("/test/admin-only", headers=headers)
    assert r1.status_code == status.HTTP_200_OK

    # Can access student profile
    r2 = client.get("/test/student/student-1/profile", headers=headers)
    assert r2.status_code == status.HTTP_200_OK

    # Can access student risk
    r3 = client.get("/test/student/student-1/risk", headers=headers)
    assert r3.status_code == status.HTTP_200_OK

    # Can access course accreditation
    r4 = client.get("/test/course/CS101/accreditation", headers=headers)
    assert r4.status_code == status.HTTP_200_OK
