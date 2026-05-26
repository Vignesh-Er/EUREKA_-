import pytest
import json
from fastapi.testclient import TestClient
from fastapi import status
from unittest.mock import patch
from main import app


@pytest.fixture
def client():
    return TestClient(app)


# ==============================================================================
# 1. SYLLABUS COVERAGE ENGINE API TESTS
# ==============================================================================

def test_syllabus_coverage_api_allowed(client):
    """Verify that a professor assigned to the course can retrieve syllabus coverage."""
    headers = {"Authorization": "Bearer demo-token-prof-1"} # Prof-1 assigned to CS101, CS201
    response = client.get("/api/v1/syllabus/CS101/coverage", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    
    payload = response.json()
    assert payload["ok"] is True
    assert payload["meta"]["source"] in ["nim", "fallback"]
    assert "overall_coverage" in payload["data"]
    assert "unit_coverage" in payload["data"]


def test_syllabus_coverage_api_denied(client):
    """Verify that a professor NOT assigned to the course is blocked (403)."""
    headers = {"Authorization": "Bearer demo-token-prof-1"} # Assigned to CS101, CS201
    response = client.get("/api/v1/syllabus/MATH301/coverage", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    
    payload = response.json()
    assert "detail" in payload
    assert "Access denied" in payload["detail"]


def test_syllabus_comprehension_api_allowed(client):
    """Verify that an authorized professor can retrieve comprehension metrics."""
    headers = {"Authorization": "Bearer demo-token-prof-1"}
    response = client.get("/api/v1/syllabus/CS101/comprehension", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    
    payload = response.json()
    assert payload["ok"] is True
    assert "comprehension" in payload["data"]
    assert "gap" in payload["data"]
    assert "weak_topics" in payload["data"]


# ==============================================================================
# 2. ALUMNI MENTORSHIP MATCHING ENGINE API TESTS
# ==============================================================================

def test_alumni_matches_api_allowed(client):
    """Verify that a student can retrieve their own personalized alumni matches."""
    headers = {"Authorization": "Bearer demo-token-student-1"}
    response = client.get("/api/v1/alumni/alumni/matches/student-1", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    
    payload = response.json()
    assert payload["ok"] is True
    assert isinstance(payload["data"], list)
    if len(payload["data"]) > 0:
        match = payload["data"][0]
        assert "name" in match
        assert "company" in match
        assert "ai_matching_reason" in match


def test_alumni_matches_api_denied(client):
    """Verify that a student cannot retrieve another student's alumni matches (403)."""
    headers = {"Authorization": "Bearer demo-token-student-1"}
    response = client.get("/api/v1/alumni/alumni/matches/student-2", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "detail" in response.json()


# ==============================================================================
# 3. TOOL UTILIZATION ROI ENGINE API TESTS
# ==============================================================================

def test_tool_utilization_dashboard_allowed(client):
    """Verify that an admin can view the tools utilization report."""
    headers = {"Authorization": "Bearer demo-token-admin-1"}
    response = client.get("/api/v1/tool-utilization/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    
    payload = response.json()
    assert payload["ok"] is True
    assert isinstance(payload["data"], list)
    if len(payload["data"]) > 0:
        tool = payload["data"][0]
        assert "tool" in tool
        assert "utilization" in tool
        assert "cost" in tool


def test_tool_utilization_dashboard_denied(client):
    """Verify that a student is blocked from the tools ROI dashboard (403)."""
    headers = {"Authorization": "Bearer demo-token-student-1"}
    response = client.get("/api/v1/tool-utilization/", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "detail" in response.json()


def test_tool_roi_api(client):
    """Verify that admins can query cost-per-student ROI metrics for MATLAB."""
    headers = {"Authorization": "Bearer demo-token-admin-1"}
    response = client.get("/api/v1/tool-utilization/roi/MATLAB", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    
    payload = response.json()
    assert payload["ok"] is True
    assert "cost_per_student" in payload["data"]
    assert "roi_score" in payload["data"]


# ==============================================================================
# 4. CHATBOT SSE STREAMING CONTRACT TESTS
# ==============================================================================

@patch.dict("os.environ", {"NVIDIA_NIM_API_KEY": "", "NVIDIA_CHAT_API_KEY": ""})
def test_chatbot_sse_streaming_response(client):
    """Verify that the SSE chat streaming route responds with text/event-stream and yields chunks."""
    headers = {
        "Authorization": "Bearer demo-token-student-1",
        "Accept": "text/event-stream"
    }
    body = {
        "question": "Verify this streaming response",
        "role": "student",
        "user_id": "student-1",
        "conversation": []
    }
    
    # We use stream context to read the response lines
    with client.stream("POST", "/api/v1/exam-prep/chat/stream", json=body, headers=headers) as response:
        assert response.status_code == status.HTTP_200_OK
        assert "text/event-stream" in response.headers.get("content-type", "")
        
        # Read the first few lines to prove they conform to Server-Sent Events structure
        lines = []
        for line in response.iter_lines():
            if line:
                lines.append(line)
            if len(lines) >= 3:
                break
                
        assert len(lines) > 0
        assert lines[0].startswith("data: ")
        
        # Parse the JSON within the first SSE chunk
        first_chunk_json = json.loads(lines[0].replace("data: ", ""))
        assert "choices" in first_chunk_json
        assert first_chunk_json["_meta"]["source"] in ["nim", "fallback"]
