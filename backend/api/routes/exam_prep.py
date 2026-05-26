import json
import re
from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import httpx
from typing import List, Dict, Any, Literal
from textwrap import dedent
from config import settings
from services.digital_twin_store import digital_twin_store

router = APIRouter(prefix="/exam-prep", tags=["Exam Preparation"])

import os
from dotenv import load_dotenv

load_dotenv()

NVIDIA_NIM_API_KEY = os.getenv("NVIDIA_NIM_API_KEY") or getattr(settings, "nvidia_nim_api_key", None)
DEEPSEEK_URL = "https://integrate.api.nvidia.com/v1/chat/completions" 
# Using NVIDIA's API to access qwen/qwen3.5-122b-a10b

class SubjectRequest(BaseModel):
    subject: str

class TopicRequest(BaseModel):
    topic: str
    subject: str = ""

class ConversationMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)

class QuestionRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    role: str | None = None
    user_id: str | None = None
    current_page: str | None = None
    conversation: List[ConversationMessage] = Field(default_factory=list)
    user_context: Dict[str, Any] | None = None


class TwinUpdateRequest(BaseModel):
    user_id: str = Field(min_length=1, max_length=255)
    role: str
    updates: Dict[str, Any] = Field(default_factory=dict)
    source: str = "manual-update"

# In-memory storage for proof of concept (replace with DB for production)
UPLOADED_NOTES = {}

ROLE_NAV_GUIDE: Dict[str, List[Dict[str, str]]] = {
    "student": [
        {"title": "AI Mastery Forge", "path": "/dashboard/ai-mastery"},
        {"title": "Digital Twin", "path": "/dashboard/digital-twin"},
        {"title": "Discovery Lab", "path": "/dashboard/discovery"},
        {"title": "Exam Prep", "path": "/dashboard/exam-prep"},
        {"title": "Career Pathways", "path": "/dashboard/career-pathways"},
        {"title": "Placement Intelligence", "path": "/dashboard/placement"},
    ],
    "professor": [
        {"title": "Upload Content", "path": "/dashboard/upload"},
        {"title": "Syllabus Coverage", "path": "/dashboard/syllabus-coverage"},
        {"title": "CO-PO Mapping", "path": "/dashboard/co-po-mapping"},
        {"title": "Student Feedback", "path": "/dashboard/feedback"},
        {"title": "Tool Utilization", "path": "/dashboard/tool-utilization"},
        {"title": "Research & Grants", "path": "/dashboard/research-grants"},
    ],
    "admin": [
        {"title": "Executive Summary", "path": "/dashboard/executive"},
        {"title": "Accreditation", "path": "/dashboard/accreditation"},
        {"title": "Staff Performance", "path": "/dashboard/staff-performance"},
        {"title": "Substitutes", "path": "/dashboard/substitutes"},
        {"title": "Procurement", "path": "/dashboard/procurement"},
        {"title": "Analytics", "path": "/dashboard/analytics"},
    ],
}

FEATURE_ROUTE_HINTS: List[Dict[str, Any]] = [
    {
        "keywords": ["exam", "study", "notes", "roadmap", "topic"],
        "title": "Exam Prep",
        "path": "/dashboard/exam-prep",
        "description": "Use AI Guided mode for subject flows, or Custom Notes mode to upload material and ask doubt-specific questions.",
    },
    {
        "keywords": ["career", "job", "placement", "internship", "interview"],
        "title": "Placement Intelligence",
        "path": "/dashboard/placement",
        "description": "Track role readiness, skill gaps, and recommendations mapped to placement outcomes.",
    },
    {
        "keywords": ["context", "card", "concept", "why"],
        "title": "Context Cards",
        "path": "/dashboard/context",
        "description": "Open contextual concept cards for practical relevance, formulas, and applied understanding.",
    },
    {
        "keywords": ["lab", "discovery", "project"],
        "title": "Discovery Lab",
        "path": "/dashboard/discovery",
        "description": "Find labs, map skills, and explore practical project opportunities tied to your track.",
    },
    {
        "keywords": ["attendance", "schedule", "timetable", "class"],
        "title": "Dynamic Timetable",
        "path": "/dashboard/timetable",
        "description": "Review schedule changes, class slots, and planning context in one place.",
    },
    {
        "keywords": ["syllabus", "coverage", "co-po", "outcome"],
        "title": "Syllabus & Outcomes",
        "path": "/dashboard/syllabus-coverage",
        "description": "Use coverage dashboards and CO-PO mapping to monitor completion and attainment quality.",
    },
    {
        "keywords": ["accreditation", "nba", "naac", "audit"],
        "title": "Accreditation",
        "path": "/dashboard/accreditation",
        "description": "Track readiness, required evidence, and institutional progress for accreditation workflows.",
    },
]


def _format_role_navigation(role: str | None) -> str:
    normalized_role = (role or "").strip().lower()
    if normalized_role in ROLE_NAV_GUIDE:
        pages = ROLE_NAV_GUIDE[normalized_role]
        label = normalized_role
    else:
        pages = [item for items in ROLE_NAV_GUIDE.values() for item in items]
        label = "all roles"

    lines = [f"- {item['title']} ({item['path']})" for item in pages]
    return f"Relevant pages for {label}:\n" + "\n".join(lines)


def _local_eureka_assistant_reply(req: QuestionRequest) -> str:
    question = req.question.strip()
    lower_question = question.lower()
    normalized_role = (req.role or "").strip().lower()

    if any(token in lower_question for token in ["how to use", "how does this app work", "what is eureka", "about this app", "what is this app for", "what is this app"]):
        return (
            "### 🚀 What Eureka is for\n"
            "- AI academic platform for **learning + labs + assessments + placement guidance**.\n"
            "- One dashboard with role-based modules and AI support.\n\n"
            "### 🧭 Quick start\n"
            "1. Sign in and choose your role.\n"
            "2. Open modules from the left sidebar.\n"
            "3. Use **Exam Prep** for doubt solving and study flow.\n"
            "4. Use **Placement Intelligence** and **Career Pathways** for job alignment.\n\n"
            "### 📍 Where to go next\n"
            f"{_format_role_navigation(req.role)}\n\n"
            "### 💬 Try asking\n"
            "- \"Show me how to use Exam Prep step by step\"\n"
            "- \"Which module should I open for placement preparation?\""
        )

    if any(token in lower_question for token in ["login", "log in", "sign in"]):
        return dedent(
            """
            ### 🔐 Login flow
            1. Open the landing page.
            2. Choose your role.
            3. Sign in.

            ✅ After login, your role-specific dashboard appears automatically.
            """
        ).strip()

    if any(token in lower_question for token in ["switch role", "change role"]):
        return dedent(
            """
            ### 🔄 Switch role
            - Open the sidebar.
            - Use the role switcher near the bottom (`student / professor / admin`).
            - Navigation updates instantly for the selected role.
            """
        ).strip()

    for route_hint in FEATURE_ROUTE_HINTS:
        if any(keyword in lower_question for keyword in route_hint["keywords"]):
            role_note = ""
            if normalized_role in ROLE_NAV_GUIDE:
                role_paths = {item["path"] for item in ROLE_NAV_GUIDE[normalized_role]}
                if route_hint["path"] not in role_paths:
                    role_note = " If that page is not visible in your sidebar, switch to the role that has access."
            return dedent(
                f"""
                ### 📍 Open: **{route_hint['title']}**
                - **Path:** `{route_hint['path']}`
                - {route_hint['description']}{role_note}

                ### 👉 Next
                - Say: "Give me a step-by-step flow for this module."
                """
            ).strip()

    if any(token in lower_question for token in ["where am i", "current page", "this page"]):
        page = req.current_page or "unknown page"
        return dedent(
            f"""
            ### 🧭 Current location
            - You are on: `{page}`

            Tell me your goal, and I will map the exact next page + action.
            """
        ).strip()

    if normalized_role in ROLE_NAV_GUIDE:
        return (
            "### 🤝 I can help you with\n"
            "- App navigation\n"
            "- Workflow guidance\n"
            "- Academic concept clarity\n\n"
            f"{_format_role_navigation(normalized_role)}"
        )

    return dedent(
        """
        ### ✨ I can help with both app usage and academics
        Try one of these:
        - "Where do I upload notes?"
        - "How do I track placement readiness?"
        - "Explain Laplace transform for exam prep."
        """
    ).strip()


def _is_app_usage_question(question: str) -> bool:
    lowered = question.lower()
    app_tokens = [
        "this app",
        "about this app",
        "dashboard",
        "module",
        "page",
        "route",
        "navigation",
        "navigate",
        "how to use",
        "how do i use",
        "where do i",
        "where can i",
        "which page",
        "how to access",
        "login",
        "log in",
        "sign in",
        "switch role",
        "sidebar",
        "feature",
        "workflow",
    ]
    return any(token in lowered for token in app_tokens)


def _merge_context_dicts(base: Dict[str, Any], updates: Dict[str, Any]) -> Dict[str, Any]:
    merged = dict(base)
    for key, value in updates.items():
        existing = merged.get(key)
        if isinstance(existing, dict) and isinstance(value, dict):
            merged[key] = _merge_context_dicts(existing, value)
        else:
            merged[key] = value
    return merged


def _extract_user_input_updates(question: str) -> Dict[str, Any]:
    updates: Dict[str, Any] = {}
    lowered = question.lower()

    cgpa_match = re.search(r"\b(?:cgpa|gpa)\s*(?:is|=|:)?\s*(\d+(?:\.\d+)?)", lowered)
    if cgpa_match:
        updates["cgpa_or_gpa"] = float(cgpa_match.group(1))

    ats_match = re.search(r"\b(?:ats|resume)\s*(?:score)?\s*(?:is|=|:)?\s*(\d+(?:\.\d+)?)", lowered)
    if ats_match:
        updates["resume_or_ats_score"] = float(ats_match.group(1))

    target_role_match = re.search(r"(?:target role|aiming for|want to become)\s*(?:is|=|:)?\s*([a-zA-Z0-9 /_-]{3,80})", question, re.IGNORECASE)
    if target_role_match:
        updates["target_role"] = target_role_match.group(1).strip()

    return updates


def _resolve_effective_user_context(req: QuestionRequest) -> Dict[str, Any]:
    effective_context: Dict[str, Any] = {}

    if req.user_id:
        stored_twin = digital_twin_store.get_twin(req.user_id)
        if isinstance(stored_twin, dict):
            stored_context = stored_twin.get("context_data", {})
            if isinstance(stored_context, dict):
                effective_context = _merge_context_dicts(effective_context, stored_context)
            stored_custom_inputs = stored_twin.get("custom_inputs", {})
            if isinstance(stored_custom_inputs, dict) and stored_custom_inputs:
                effective_context["custom_inputs"] = stored_custom_inputs

    if isinstance(req.user_context, dict):
        effective_context = _merge_context_dicts(effective_context, req.user_context)

    return effective_context


def _is_personal_progress_question(question: str) -> bool:
    lowered = question.lower()
    personal_tokens = [
        "my current level",
        "current level",
        "where should i focus",
        "focus now",
        "enhance my level",
        "academics and placement",
        "placement readiness",
        "my level",
        "company available",
        "companies available",
        "what companies",
        "which companies",
    ]
    return any(token in lowered for token in personal_tokens)


def _personalized_missing_input_reply(user_context: Dict[str, Any]) -> str:
    base_missing_inputs = [
        "Latest CGPA or semester GPA",
        "Recent assessment percentages",
        "Target role for placements",
        "Top 3 preferred companies",
        "Current resume/ATS score",
    ]

    missing_inputs = base_missing_inputs
    configured_missing_inputs = user_context.get("missing_inputs_for_better_personalization", [])
    if isinstance(configured_missing_inputs, list) and configured_missing_inputs:
        missing_inputs = [str(item) for item in configured_missing_inputs if str(item).strip()]

    custom_inputs = user_context.get("custom_inputs", {})
    if isinstance(custom_inputs, dict):
        if custom_inputs.get("cgpa_or_gpa") is not None:
            missing_inputs = [item for item in missing_inputs if "CGPA" not in item and "GPA" not in item]
        if custom_inputs.get("resume_or_ats_score") is not None:
            missing_inputs = [item for item in missing_inputs if "ATS" not in item and "resume" not in item.lower()]
        if custom_inputs.get("target_role"):
            missing_inputs = [item for item in missing_inputs if "Target role" not in item]

    input_lines = "\n".join([f"- {item}" for item in missing_inputs])
    if not input_lines:
        input_lines = "- No additional inputs required right now."
    return (
        "### 📥 I need your latest inputs to personalize this accurately\n"
        "I will not guess your scores or placement status.\n\n"
        "Please share:\n"
        f"{input_lines}\n\n"
        "### ✅ Next\n"
        "Reply with the details above, and I will generate a precise focus plan."
    )


def _personalized_student_status_reply(user_context: Dict[str, Any]) -> str:
    student_profile = user_context.get("student_profile", {})
    roadmap = user_context.get("roadmap", {})
    placement = user_context.get("placement", {})

    if not isinstance(student_profile, dict) or not student_profile:
        return _personalized_missing_input_reply(user_context)

    level = student_profile.get("level")
    xp = student_profile.get("xp")
    streak_days = student_profile.get("streak_days")
    specialization = student_profile.get("specialization")

    weak_topics = student_profile.get("weak_topics", [])
    if not isinstance(weak_topics, list):
        weak_topics = []

    roadmap_progress = roadmap.get("progress_percent") if isinstance(roadmap, dict) else None
    current_courses = roadmap.get("current_courses", []) if isinstance(roadmap, dict) else []
    if not isinstance(current_courses, list):
        current_courses = []

    low_mastery_courses = []
    for course in current_courses:
        if isinstance(course, dict):
            mastery_level = course.get("mastery_level")
            if isinstance(mastery_level, (int, float)) and mastery_level < 70:
                low_mastery_courses.append(f"{course.get('name', 'Unknown Course')} ({mastery_level}%)")

    placement_score = placement.get("score") if isinstance(placement, dict) else None
    gap_skills = placement.get("gapSkills", []) if isinstance(placement, dict) else []
    if not isinstance(gap_skills, list):
        gap_skills = []

    matched_companies = placement.get("matchedCompanies", []) if isinstance(placement, dict) else []
    if not isinstance(matched_companies, list):
        matched_companies = []

    specialization_companies = user_context.get("specialization_companies", [])
    if not isinstance(specialization_companies, list):
        specialization_companies = []

    focus_points: List[str] = []
    if weak_topics:
        focus_points.append(f"- Strengthen weak topics first: {', '.join([str(topic) for topic in weak_topics[:3]])}.")
    if low_mastery_courses:
        focus_points.append(f"- Improve low-mastery current courses: {', '.join(low_mastery_courses[:3])}.")
    if gap_skills:
        gap_summaries = []
        for gap in gap_skills[:3]:
            if isinstance(gap, dict):
                skill = str(gap.get("skill", "Unknown Skill"))
                required = gap.get("required")
                current = gap.get("current")
                if isinstance(required, (int, float)) and isinstance(current, (int, float)):
                    gap_summaries.append(f"{skill} (gap: {required - current}%)")
                else:
                    gap_summaries.append(skill)
        if gap_summaries:
            focus_points.append(f"- Placement skill gaps to close: {', '.join(gap_summaries)}.")

    if not focus_points:
        focus_points.append("- I need your latest course mastery and placement skill-gap values to prioritize focus areas.")

    company_lines: List[str] = []
    for company in matched_companies[:5]:
        if isinstance(company, dict):
            name = str(company.get("name", "Unknown Company"))
            role = str(company.get("role", "Role not specified"))
            match = company.get("match")
            if isinstance(match, (int, float)):
                company_lines.append(f"- {name} — {role} (match {match}%)")
            else:
                company_lines.append(f"- {name} — {role}")

    if not company_lines and specialization_companies:
        company_lines = [f"- {str(company)}" for company in specialization_companies[:8]]

    if not company_lines:
        company_lines = ["- No company list is available in your current profile data. Please share your preferred domain and I will suggest targets."]

    custom_inputs = user_context.get("custom_inputs", {})
    if not isinstance(custom_inputs, dict):
        custom_inputs = {}
    cgpa_or_gpa = custom_inputs.get("cgpa_or_gpa")
    resume_or_ats_score = custom_inputs.get("resume_or_ats_score")
    target_role = custom_inputs.get("target_role")

    missing_input_section = _personalized_missing_input_reply(user_context)

    return (
        "### 🔍 Your current level (from available profile data)\n"
        f"- Level: **{level if level is not None else 'Not available'}**\n"
        f"- XP: **{xp if xp is not None else 'Not available'}**\n"
        f"- Streak: **{streak_days if streak_days is not None else 'Not available'} days**\n"
        f"- Roadmap progress: **{f'{roadmap_progress}%' if roadmap_progress is not None else 'Not available'}**\n"
        f"- Placement readiness score: **{f'{placement_score}%' if placement_score is not None else 'Not available'}**\n"
        f"- Specialization: **{specialization if specialization else 'Not available'}**\n\n"
        f"- CGPA/GPA: **{cgpa_or_gpa if cgpa_or_gpa is not None else 'Not provided yet'}**\n"
        f"- Resume/ATS score: **{resume_or_ats_score if resume_or_ats_score is not None else 'Not provided yet'}**\n"
        f"- Target role: **{target_role if target_role else 'Not provided yet'}**\n\n"
        "### 🎯 Where to focus now (academics + placement)\n"
        f"{chr(10).join(focus_points)}\n\n"
        "### 🏢 Companies available now (from current app data)\n"
        f"{chr(10).join(company_lines)}\n\n"
        "### 📌 Important\n"
        "- I used only the data currently available in your profile/default dataset.\n"
        "- I did not generate random scores or company lists.\n\n"
        f"{missing_input_section}"
    )

async def call_deepseek_api(system_prompt: str, user_prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {NVIDIA_NIM_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "qwen/qwen3.5-122b-a10b",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2,
        "top_p": 0.9,
        "max_tokens": 4000
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(DEEPSEEK_URL, json=payload, headers=headers, timeout=120.0)
            response.raise_for_status()
            data = response.json()
            return data.get("choices", [{}])[0].get("message", {}).get("content", "Error parsing response")
        except Exception as e:
            error_msg = str(e) or type(e).__name__
            return f"Mocked AI response (NVIDIA API error or timeout): {error_msg}"

@router.get("/suggestions")
async def get_suggestions(subject: str):
    """Returns 3 recommended topics based on the subject"""
    prompt = f"Provide exactly 3 comma-separated core topics for examining a student in {subject}. Only the 3 names, no bullet points, no extra text."
    response = await call_deepseek_api("You are a helpful education assistant.", prompt)

    # Clean up the response in case the AI added newlines or bullets
    cleaned_response = response.replace("*", "").replace("-", "").replace("\n", ",")
    topics = [t.strip() for t in cleaned_response.split(",") if t.strip() and len(t.strip()) > 3]
    
    # Grab first 3 topics or fallback
    if not topics or len(topics) < 2:
        topics = [f"{subject} Basics", "Advanced Concepts", "Practical Applications", f"Review {subject}"]
    
    return {"suggestions": topics[:4]}

@router.post("/chat")
async def general_exam_chat(req: QuestionRequest):
    """General chat for exam flow, summary, and questions"""
    normalized_role = (req.role or "student").strip().lower()
    if req.user_id:
        digital_twin_store.ensure_twin(user_id=req.user_id, role=normalized_role)
        if isinstance(req.user_context, dict) and req.user_context:
            digital_twin_store.update_context(
                user_id=req.user_id,
                role=normalized_role,
                context_updates=req.user_context,
                source="chat-user-context",
            )
        extracted_updates = _extract_user_input_updates(req.question)
        if extracted_updates:
            digital_twin_store.update_custom_inputs(
                user_id=req.user_id,
                role=normalized_role,
                custom_inputs=extracted_updates,
                source="chat-message-inputs",
            )

    effective_user_context = _resolve_effective_user_context(req)
    history_lines = "\n".join(
        [f"{message.role.upper()}: {message.content}" for message in req.conversation[-8:]]
    ) or "No previous conversation provided."
    user_context_text = (
        json.dumps(effective_user_context, ensure_ascii=False, default=str)[:12000]
        if effective_user_context else "No user context provided."
    )

    system_prompt = dedent(
        f"""
        You are Eureka AI inside the Project Eureka web app.
        You must provide highly accurate, actionable answers for:
        1) How to use the app (navigation, module usage, role-specific workflows)
        2) Academic support (exam planning, concept explanations, study strategy)

        App guidance:
        - Students use modules like AI Mastery Forge, Digital Twin, Discovery Lab, Exam Prep, Career Pathways, Placement Intelligence.
        - Professors use modules like Upload Content, Syllabus Coverage, CO-PO Mapping, Student Feedback, Tool Utilization, Research & Grants.
        - Admins use modules like Executive Summary, Accreditation, Staff Performance, Substitutes, Procurement, Analytics.
        - For exam-specific guidance, route users to /dashboard/exam-prep.
        - Known Exam Prep capabilities: subject selection, AI guided summary, topic explainers, notes upload, asking questions on uploaded notes, and interactive roadmap.
        - When user-specific values are needed, use the digital twin file context first.

        { _format_role_navigation(req.role) }

        Response rules:
        - If the user asks how to do something in Eureka, mention the exact dashboard page path when relevant.
        - Keep answers concise, practical, and step-oriented.
        - Output must be readable markdown (not a wall of text).
        - Use short sections with headings and bullets.
        - Keep each bullet short and clear.
        - Use 1 to 3 relevant emojis for friendliness.
        - Use ONLY the values present in provided user context for personal scores/levels/company lists.
        - Never invent personal metrics, readiness percentages, or company names.
        - If required personal data is missing, ask the user to provide the missing inputs.
        - Do not reference buttons, tabs, widgets, or workflows that are not in the known capability list.
        - If a feature is outside known context, say that explicitly instead of inventing details.
        - If the question is academic, answer as a tutor with clear structure.
        - End with a small "Next" suggestion when useful.
        """
    ).strip()

    user_prompt = dedent(
        f"""
        User role: {req.role or "unknown"}
        User ID: {req.user_id or "unknown"}
        Current page: {req.current_page or "unknown"}
        Conversation history:
        {history_lines}
        User context JSON:
        {user_context_text}

        User question:
        {req.question}
        """
    ).strip()

    if _is_personal_progress_question(req.question):
        return {"answer": _personalized_student_status_reply(effective_user_context)}

    if _is_app_usage_question(req.question):
        return {"answer": _local_eureka_assistant_reply(req)}

    if not NVIDIA_NIM_API_KEY:
        return {"answer": _local_eureka_assistant_reply(req)}

    answer = await call_deepseek_api(system_prompt, user_prompt)
    if not answer or answer.startswith("Mocked AI response"):
        answer = _local_eureka_assistant_reply(req)
    return {"answer": answer}


@router.post("/chat/stream")
async def general_exam_chat_stream(req: QuestionRequest):
    """General chat for exam flow, summary, and questions with real-time SSE streaming"""
    normalized_role = (req.role or "student").strip().lower()
    if req.user_id:
        digital_twin_store.ensure_twin(user_id=req.user_id, role=normalized_role)
        if isinstance(req.user_context, dict) and req.user_context:
            digital_twin_store.update_context(
                user_id=req.user_id,
                role=normalized_role,
                context_updates=req.user_context,
                source="chat-user-context",
            )
        extracted_updates = _extract_user_input_updates(req.question)
        if extracted_updates:
            digital_twin_store.update_custom_inputs(
                user_id=req.user_id,
                role=normalized_role,
                custom_inputs=extracted_updates,
                source="chat-message-inputs",
            )

    effective_user_context = _resolve_effective_user_context(req)
    history_lines = "\n".join(
        [f"{message.role.upper()}: {message.content}" for message in req.conversation[-8:]]
    ) or "No previous conversation provided."
    user_context_text = (
        json.dumps(effective_user_context, ensure_ascii=False, default=str)[:12000]
        if effective_user_context else "No user context provided."
    )

    system_prompt = dedent(
        f"""
        You are Eureka AI inside the Project Eureka web app.
        You must provide highly accurate, actionable answers for:
        1) How to use the app (navigation, module usage, role-specific workflows)
        2) Academic support (exam planning, concept explanations, study strategy)

        App guidance:
        - Students use modules like AI Mastery Forge, Digital Twin, Discovery Lab, Exam Prep, Career Pathways, Placement Intelligence.
        - Professors use modules like Upload Content, Syllabus Coverage, CO-PO Mapping, Student Feedback, Tool Utilization, Research & Grants.
        - Admins use modules like Executive Summary, Accreditation, Staff Performance, Substitutes, Procurement, Analytics.
        - For exam-specific guidance, route users to /dashboard/exam-prep.
        - Known Exam Prep capabilities: subject selection, AI guided summary, topic explainers, notes upload, asking questions on uploaded notes, and interactive roadmap.
        - When user-specific values are needed, use the digital twin file context first.
        { _format_role_navigation(req.role) }

        Response rules:
        - If the user asks how to do something in Eureka, mention the exact dashboard page path when relevant.
        - Keep answers concise, practical, and step-oriented.
        - Output must be readable markdown (not a wall of text).
        - Use short sections with headings and bullets.
        - Keep each bullet short and clear.
        - Use 1 to 3 relevant emojis for friendliness.
        - Use ONLY the values present in provided user context for personal scores/levels/company lists.
        - Never invent personal metrics, readiness percentages, or company names.
        - If required personal data is missing, ask the user to provide the missing inputs.
        - Do not reference buttons, tabs, widgets, or workflows that are not in the known capability list.
        - If a feature is outside known context, say that explicitly instead of inventing details.
        - If the question is academic, answer as a tutor with clear structure.
        - End with a small "Next" suggestion when useful.
        """
    ).strip()

    user_prompt = dedent(
        f"""
        User role: {req.role or "unknown"}
        User ID: {req.user_id or "unknown"}
        Current page: {req.current_page or "unknown"}
        Conversation history:
        {history_lines}
        User context JSON:
        {user_context_text}

        User question:
        {req.question}
        """
    ).strip()

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    from services.nvidia_engines import NVIDIAEngineBase
    engine_base = NVIDIAEngineBase()

    async def stream_generator():
        async for chunk in engine_base._stream_nim_api(
            model=settings.nim_default_model,
            messages=messages,
            engine_name="exam_prep"
        ):
            yield chunk

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )


@router.get("/digital-twin/{user_id}")
async def get_digital_twin(user_id: str):
    twin = digital_twin_store.get_twin(user_id)
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin file not found for this user")
    return twin


@router.post("/digital-twin/update")
async def update_digital_twin(req: TwinUpdateRequest):
    updated = digital_twin_store.update_context(
        user_id=req.user_id,
        role=req.role,
        context_updates=req.updates,
        source=req.source,
    )
    return {
        "status": "updated",
        "user_id": req.user_id,
        "updated_at": updated.get("updated_at"),
    }

@router.post("/explain")
async def explain_topic(req: TopicRequest):
    """Explains the chosen topic directly using AI"""
    sys_prompt = f"You are an expert STEM tutor specifically teaching {req.subject}. You must provide a factual, perfectly verified academic explanation."
    user_prompt = f"Explain the academic/engineering topic '{req.topic}' (in the context of {req.subject}) simply and thoroughly to an undergrad student. Use valid markdown, clear formatting, provide relevant mathematical formulas if applicable using LaTeX blocks, and add a small practice question at the end. DO NOT hallucinate. Do not talk about unrelated topics like books."
    
    explanation = await call_deepseek_api(sys_prompt, user_prompt)
    return {"explanation": explanation}

@router.post("/upload-notes")
async def upload_student_notes(file: UploadFile = File(...)):
    """Receives a document and stores text (Mock RAG)"""
    content = await file.read()
    text = ""
    try:
        # Very basic mock text extraction for .txt files
        text = content.decode("utf-8")
    except:
        text = f"[Simulated parsed text from binary {file.filename}] Core concepts of advanced {file.filename}..."
        
    UPLOADED_NOTES["latest"] = text[:3000] # store up to 3000 chars roughly in memory
    
    return {"status": "success", "filename": file.filename, "msg": "Notes mapped to memory"}

@router.post("/ask-notes")
async def ask_question_on_notes(req: QuestionRequest):
    """RAG Flow: Use the uploaded text directly as context"""
    notes = UPLOADED_NOTES.get("latest", "No notes found")
    
    system_prompt = "You are a helpful tutor answering based STRICTLY on the student's provided notes."
    user_prompt = f"Student Notes:\n\"\"\"{notes}\"\"\"\n\nStudent Question: {req.question}"
    
    answer = await call_deepseek_api(system_prompt, user_prompt)
    return {"answer": answer}

@router.get("/roadmap")
async def get_roadmap(subject: str):
    """Generates a structured roadmap of modules and subtopics for visual display"""
    prompt = f"""Generate a comprehensive study roadmap for the subject '{subject}'.
    Return ONLY valid JSON in this exact structure:
    {{
        "subject": "{subject}",
        "modules": [
            {{
                "title": "Module Name",
                "subtopics": ["Subtopic 1", "Subtopic 2"]
            }}
        ]
    }}
    Ensure there are 3 to 4 modules, each with 2 to 4 subtopics.
    DO NOT wrap the response in markdown blocks like ```json. Return raw JSON text only."""
    
    response = await call_deepseek_api("You are a strict JSON data generator API.", prompt)
    
    try:
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        
        data = json.loads(cleaned.strip())
        return data
    except Exception as e:
        print(f"Error parsing roadmap JSON: {e}")
        # Fallback structured data
        return {
            "subject": subject,
            "modules": [
                {"title": f"Introduction to {subject}", "subtopics": ["Core Definitions", "Overview"]},
                {"title": f"Fundamental Principles", "subtopics": ["Basic Theories", "Key Laws"]},
                {"title": f"Advanced {subject}", "subtopics": ["Complex Applications", "Final Review"]}
            ]
        }

@router.post("/real-world")
async def real_world_application(req: TopicRequest):
    """Explains real-world applications and highlights important formulas"""
    prompt = f"""Explain the real-world engineering or scientific applications of the topic '{req.topic}' in the context of '{req.subject}'.
    In your explanation, prominently highlight any exact mathematical / scientific formulas, theories, or laws important for university exams using standard LaTeX matching the topic.
    Ensure strict academic accuracy. Do not talk about random books.
    Structure the response clearly with headers: 'Real-World Applications' and 'Important Formulas/Rules'.
    Keep it highly engaging and practical."""

    sys_mode = f"You are an expert practical tutor focusing on {req.subject} and real-world engineering formulas."
    explanation = await call_deepseek_api(sys_mode, prompt)
@router.get('/deep-roadmap')
async def get_deep_roadmap(subject: str):
    prompt = f"Generate an exceptionally deep, highly advanced academic knowledge tree for the subject '{subject}'. This is for deep learning, not just exam prep. Return ONLY valid JSON in this exact structure: {{\"subject\": \"{subject}\", \"modules\": [{{\"title\": \"Module Name\", \"subtopics\": [\"Subtopic 1\", \"Subtopic 2\"]}}]}}. Ensure there are 4 to 6 advanced modules, each with 4 to 6 incredibly specific subtopics. DO NOT wrap the response in markdown blocks like ```json. Return raw JSON text only."
    response = await call_deepseek_api('You are a strict JSON data generator API.', prompt)
    try:
        cleaned = response.strip()
        if cleaned.startswith('`json'): cleaned = cleaned[7:]
        elif cleaned.startswith('`'): cleaned = cleaned[3:]
        if cleaned.endswith('`'): cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    except Exception as e:
        return {'subject': subject, 'modules': [{'title': f'Advanced {subject}', 'subtopics': ['Core 1', 'Core 2']}]}
