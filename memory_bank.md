# Project Eureka — Memory Bank & Progress Log
> "A developer's personal diary and architectural map for Project Eureka."

This file acts as our institutional memory bank and progress journal. It tracks the current status of all engine coordinates, their active status (mock vs. live), and logs a chronological history of changes, making it effortless to trace what is implemented without re-auditing the entire project folder.

---

## 🌌 1. System Coordinates & Active Status Map

This map outlines the connection between the frontend screens, their backend routers, and the core engine files:

| Module / Feature | Frontend Path (`app/dashboard/...`) | Backend Router (`api/routes/...`) | Backend Service (`services/...`) | Active AI Status | Notes / Capabilities |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth & Security** | `/app/page.tsx` (landing) | `auth.py` | `auth.py` | **ACTIVE (Real)** | Complete JWT authentication, password hashing, and role switching. |
| **Digital Twin** | `digital-twin/` | `student.py` / `exam_prep.py` | `digital_twin_store.py` | **ACTIVE (Real)** | File-based persistent storage (`backend/digital_twin/`) storing profiles and interaction histories. |
| **Exam Prep (RAG)** | `exam-prep/` | `exam_prep.py` | `nvidia_engines.py` | **ACTIVE (Real)** | **Active Blueprint**: real-time NVIDIA NIM `qwen/qwen3.5-122b-a10b` integration, explains topics, generates roadmaps. |
| **Accreditation** | `accreditation/` | `accreditation.py` | `accreditation_engine.py` | **ACTIVE (Real)** | AI Bloom's Taxonomy classification, CO-PO mapping, dynamic readiness tracking via NIM. |
| **Placement Intel** | `placement/` | `placement.py` | `placement_engine.py` | **ACTIVE (Real)** | Live student matching to target companies, dynamic skill gap metrics, interactive AI tutor sandbox. |
| **Syllabus Coverage**| `syllabus-coverage/` | `syllabus.py` | `syllabus_engine.py` | *Mock Prototype* | Compiles expected vs. actual lecture timelines and weak-comprehension topics. |
| **Staff Performance**| `staff-performance/` | `staff_performance.py` | `staff_performance_engine.py`| *Mock Prototype* | Renders aggregate institutional averages and cards for registered professors. |
| **Parent Portal** | `parent-portal/` | `parent_portal.py` | `parent_engine.py` | *Mock Prototype* | Showcases attendance overview and alert panels for high-risk students. |
| **Tool Utilization** | `tool-utilization/` / `procurement/`| `tool_utilization.py` / `admin.py` | `tool_utilization_engine.py` / `nvidia_engines.py` | *Mock Prototype* | Software usage stats, costs, procurement approvals. |
| **Discovery Lab** | `discovery/` | `student.py` | `nvidia_engines.py` | *Mock Prototype* | Station-by-station lab exploration and specialization suggestions. |
| **Alumni Network** | `alumni/` | `alumni.py` | `alumni_engine.py` | *Mock Prototype* | Renders mentor lists matching graduation years and companies. |
| **Research Grants** | `research-grants/` | `research_grants.py` | `research_engine.py` | *Mock Prototype* | Displays matched funding agencies and application deadlines. |
| **Industry Connect** | `industry-connect/` | `industry_connect.py` | `industry_engine.py` | *Mock Prototype* | Displays target corporate roles and match percentages. |

---

## 📓 2. The Progress Diary

### Entry 1: 2026-05-26 (Initialization)
* **Status**: Core prototype audited.
* **Audit Insights**: Verified that the backend router infrastructure and Next.js frontend pages are beautifully designed and ready, but almost all modules currently run on isolated mock data or local bypass arrays. The only fully active AI-powered module is `exam_prep.py` calling the qwen NIM API.
* **Milestone**: Created the `memory_bank.md` file in the root of the project to act as our development log book. Ready to begin transitioning Accreditation and Placement engines to live NIM API executions.

### Entry 2: 2026-05-26 (API Upgrades & Connection Wiring)
* **Demo-Token Authentication**: Modified `decode_access_token` in `backend/services/auth.py` to seamlessly decode `demo-token-` parameters passed from frontend demo login, allowing authenticated backend routing.
* **OBE Accreditation Engine**: Implemented `analyze_exam_paper` in `accreditation_engine.py` using the NVIDIA NIM API (`qwen/qwen3.5-122b-a10b`) to classify question sheets under Bloom's Levels and Course Outcomes. Added router endpoints in `accreditation.py` and connected the Next.js frontend to fetch live data and render an interactive audit portal.
* **Placement Intelligence Engine**: Connected `placement_engine.py` to persistent student digital twin contexts. Implemented real-time corporate matches and gap checklists via NIM. Added dynamic endpoints in `placement.py` and connected the Next.js frontend page, incorporating a premium AI Skill-Gap Tutor sandbox.
* **Root Documentation**: Created a unified, high-fidelity monorepo `README.md` at the root directory outlining the platform's inspiration, 8-engine architecture, and step-by-step startup instructions, and pushed all updates to GitHub.
* **Local Launch**: Started the FastAPI backend server on `http://localhost:8000` (uvicorn process) and the Next.js development server on `http://localhost:3000` concurrently as background tasks.


