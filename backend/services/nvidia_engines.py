"""NVIDIA AI Engine implementations with safe mock fallbacks, auditing, and SSE streaming."""

import os
import time
import uuid
import json
from typing import List, AsyncGenerator, Optional
import httpx
from fastapi import HTTPException, status
from loguru import logger
from dotenv import load_dotenv

from config import settings
from services.prompt_registry import prompt_registry
from sqlalchemy.ext.asyncio import AsyncSession

load_dotenv()


class NVIDIAEngineBase:
    """Base AI engine interface with robust error boundaries, structured metrics, and fallbacks."""

    def __init__(self):
        self.nim_api_key = os.getenv("NVIDIA_NIM_API_KEY") or settings.nvidia_config.get("nim_api_key")
        self.chat_api_key = os.getenv("NVIDIA_CHAT_API_KEY") or settings.nvidia_config.get("chat_api_key")

    async def _call_nim_api(
        self,
        model: str,
        messages: List[dict],
        sensitive: bool = False,
        db: Optional[AsyncSession] = None,
        engine_name: Optional[str] = None,
        use_chat_key: bool = False,
    ) -> dict:
        """Call NVIDIA NIM API. Supports prompt versioning, structured logging, and two-tier fallback."""
        start_time = time.perf_counter()
        request_id = str(uuid.uuid4())
        api_key_to_use = self.chat_api_key if use_chat_key else self.nim_api_key

        # Inject system prompt if registry & DB are provided
        if db and engine_name:
            system_prompt = await prompt_registry.get_active_prompt(db, engine_name)
            if system_prompt:
                # Prepend if no system message is already present
                has_system = any(msg.get("role") == "system" for msg in messages)
                if not has_system:
                    messages = [{"role": "system", "content": system_prompt}] + messages

        # 1. Check API Key configuration
        if not api_key_to_use:
            duration_ms = int((time.perf_counter() - start_time) * 1000)
            if sensitive:
                logger.error(f"[NIM API] [sensitive=True] API key not configured. request_id={request_id}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="AI Engine is currently unavailable for this sensitive operation. Please configure the NIM API key."
                )
            else:
                logger.warning(f"[NIM API] [sensitive=False] API key not configured. Returning fallback mock response. request_id={request_id}")
                return self._generate_fallback_response(model, messages, duration_ms, request_id)

        # 2. Try calling the live NIM API
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    "https://integrate.api.nvidia.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key_to_use}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "messages": messages,
                        "temperature": 0.60,
                        "top_p": 0.95,
                        "max_tokens": 4096 if use_chat_key else 32768,
                        "stream": False
                    },
                )
                
                # Check HTTP error status
                if response.status_code != 200:
                    logger.error(f"[NIM API] API returned non-200 status code: {response.status_code}. Response: {response.text}")
                    response.raise_for_status()

                data = response.json()
                duration_ms = int((time.perf_counter() - start_time) * 1000)

                # Safely handle reasoning models or empty content response payloads
                if "choices" in data and len(data["choices"]) > 0:
                    msg = data["choices"][0].get("message", {})
                    if "content" not in msg or not msg["content"]:
                        fallback_content = msg.get("reasoning_content") or msg.get("reasoning") or "Analysis completed successfully."
                        msg["content"] = fallback_content
                        data["choices"][0]["message"] = msg

                # Add structured observability meta
                token_usage = data.get("usage", {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0})
                data["_meta"] = {
                    "source": "nim",
                    "model_used": model,
                    "latency_ms": duration_ms,
                    "token_usage": token_usage,
                    "request_id": request_id
                }

                logger.info(json.dumps({
                    "event": "nim_call_success",
                    "model": model,
                    "engine_name": engine_name,
                    "sensitive": sensitive,
                    "latency_ms": duration_ms,
                    "token_usage": token_usage,
                    "request_id": request_id
                }))

                return data

        except Exception as e:
            duration_ms = int((time.perf_counter() - start_time) * 1000)
            logger.exception(f"[NIM API] Failed to invoke live NIM API. request_id={request_id}, error={e}")

            if sensitive:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="AI Engine is currently unavailable for this sensitive operation. Please try again later."
                )
            else:
                logger.warning(f"[NIM API] [sensitive=False] Falling back to mock. request_id={request_id}")
                return self._generate_fallback_response(model, messages, duration_ms, request_id)

    async def _stream_nim_api(
        self,
        model: str,
        messages: List[dict],
        db: Optional[AsyncSession] = None,
        engine_name: Optional[str] = None,
        use_chat_key: bool = False,
    ) -> AsyncGenerator[str, None]:
        """Yields SSE-formatted chunks as tokens arrive from NIM streaming API."""
        request_id = str(uuid.uuid4())
        api_key_to_use = self.chat_api_key if use_chat_key else self.nim_api_key

        # Inject system prompt if registry & DB are provided
        if db and engine_name:
            system_prompt = await prompt_registry.get_active_prompt(db, engine_name)
            if system_prompt:
                has_system = any(msg.get("role") == "system" for msg in messages)
                if not has_system:
                    messages = [{"role": "system", "content": system_prompt}] + messages

        if not api_key_to_use:
            logger.warning("[NIM API] API key not configured for stream, yielding mock stream.")
            # Yield simulated stream chunks
            mock_text = "NVIDIA NIM response streaming is active. This is a simulated stream response because no API key is set."
            for word in mock_text.split(" "):
                chunk = {
                    "choices": [{"delta": {"content": word + " "}}],
                    "_meta": {"source": "fallback", "request_id": request_id}
                }
                yield f"data: {json.dumps(chunk)}\n\n"
                time.sleep(0.05)
            yield "data: [DONE]\n\n"
            return

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream(
                    "POST",
                    "https://integrate.api.nvidia.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key_to_use}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "messages": messages,
                        "temperature": 0.60,
                        "top_p": 0.95,
                        "max_tokens": 4096 if use_chat_key else 32768,
                        "stream": True
                    },
                ) as resp:
                    resp.raise_for_status()
                    async for line in resp.aiter_lines():
                        if line.strip():
                            yield line + "\n\n"
        except Exception as e:
            logger.error(f"[NIM API] Streaming failed: {e}")
            chunk = {"error": f"Streaming failed: {str(e)}"}
            yield f"data: {json.dumps(chunk)}\n\n"

    def _generate_fallback_response(self, model: str, messages: List[dict], duration_ms: int, request_id: str) -> dict:
        """Helper to generate structurally correct mock fallback responses."""
        user_message = messages[-1].get("content", "") if messages else ""
        return {
            "choices": [{
                "message": {
                    "content": f"[DEMO MODE - FALLBACK RESPONSE]\nBased on your prompt:\n\"{user_message[:150]}...\"\n\nHere is a simulated production-grade response generated by Project Eureka's local fallback engine."
                }
            }],
            "usage": {
                "prompt_tokens": len(user_message) // 4,
                "completion_tokens": 50,
                "total_tokens": (len(user_message) // 4) + 50
            },
            "_meta": {
                "source": "fallback",
                "model_used": model,
                "latency_ms": duration_ms,
                "token_usage": {"prompt": len(user_message) // 4, "completion": 50},
                "request_id": request_id
            }
        }


class DiscoveryEngine(NVIDIAEngineBase):
    async def analyze_student_interests(self, student_id: str, interactions: List[dict], db: Optional[AsyncSession] = None) -> dict:
        prompt = f"Analyze interests for student {student_id}: {json.dumps(interactions)}"
        response = await self._call_nim_api(
            settings.nim_default_model,
            [{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="discovery"
        )
        return {"student_id": student_id, "analysis": response["choices"][0]["message"]["content"], "_meta": response.get("_meta")}


class CurriculumContextEngine(NVIDIAEngineBase):
    async def generate_context_card(self, topic: dict, course_context: dict, db: Optional[AsyncSession] = None) -> dict:
        prompt = f"Generate context card for {topic.get('name', 'Unknown')} in {course_context.get('name', 'Unknown')}"
        response = await self._call_nim_api(
            settings.nim_default_model,
            [{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="syllabus"
        )
        return {
            "topic_id": topic.get("id"),
            "content": response["choices"][0]["message"]["content"],
            "confidence": 0.95,
            "_meta": response.get("_meta")
        }


class LectureCompanionEngine(NVIDIAEngineBase):
    async def process_lecture(self, lecture_data: dict, db: Optional[AsyncSession] = None) -> dict:
        prompt = f"Summarize lecture: {lecture_data.get('content', '')}"
        response = await self._call_nim_api(
            settings.nim_default_model,
            [{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="exam_prep"
        )
        return {
            "lecture_id": lecture_data.get("id"),
            "summary": response["choices"][0]["message"]["content"],
            "_meta": response.get("_meta")
        }


class AdminAssistantEngine(NVIDIAEngineBase):
    async def evaluate_hardware_request(self, request: dict, db: Optional[AsyncSession] = None) -> dict:
        prompt = f"Evaluate hardware request: {json.dumps(request)}"
        response = await self._call_nim_api(
            settings.nim_fast_model,
            [{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="tool_utilization",
            use_chat_key=True
        )
        return {
            "evaluation": response["choices"][0]["message"]["content"],
            "recommendation": "approve",
            "_meta": response.get("_meta")
        }


class TranslationEngine(NVIDIAEngineBase):
    async def translate_content(self, text: str, target_language: str, source_language: str = "en", db: Optional[AsyncSession] = None) -> dict:
        prompt = f"Translate from {source_language} to {target_language}: {text}"
        response = await self._call_nim_api(
            settings.nim_fast_model,
            [{"role": "user", "content": prompt}],
            sensitive=False,
            db=db,
            engine_name="industry_connect",
            use_chat_key=True
        )
        return {
            "original": text,
            "translated": response["choices"][0]["message"]["content"],
            "source_language": source_language,
            "target_language": target_language,
            "_meta": response.get("_meta")
        }


discovery_engine = DiscoveryEngine()
curriculum_context_engine = CurriculumContextEngine()
lecture_companion_engine = LectureCompanionEngine()
admin_assistant_engine = AdminAssistantEngine()
translation_engine = TranslationEngine()
