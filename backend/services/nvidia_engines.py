"""NVIDIA AI Engine implementations with safe mock fallbacks."""

import json
from typing import List

import httpx
from loguru import logger

from config import settings


import os
from dotenv import load_dotenv

load_dotenv()

class NVIDIAEngineBase:
    def __init__(self):
        self.nemo_api_key = os.getenv("NVIDIA_NEMO_API_KEY") or settings.nvidia_config.get("nemo_api_key")
        self.nim_api_key = os.getenv("NVIDIA_NIM_API_KEY") or settings.nvidia_config.get("nim_api_key")
        self.chat_api_key = os.getenv("NVIDIA_CHAT_API_KEY") or settings.nvidia_config.get("chat_api_key")
        self.riva_api_key = os.getenv("NVIDIA_RIVA_API_KEY") or settings.nvidia_config.get("riva_api_key")
        self.riva_endpoint = settings.nvidia_config.get("riva_endpoint", "riva-api.nvidia.com:443")

    async def _call_nim_api(self, model: str, messages: List[dict], use_chat_key: bool = False) -> dict:
        api_key_to_use = self.chat_api_key if use_chat_key else self.nim_api_key
        
        if not api_key_to_use:
            logger.warning("NIM API key not configured, returning mock response")
            return {
                "choices": [{"message": {"content": "Mock NVIDIA NIM response."}}],
                "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30},
            }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://integrate.api.nvidia.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key_to_use}", "Content-Type": "application/json"},
                json={
                    "model": model, 
                    "messages": messages, 
                    "temperature": 0.60, 
                    "top_p": 0.95,
                    "max_tokens": 32768 if not use_chat_key else 4096,
                    "stream": False
                },
            )
            response.raise_for_status()
            return response.json()


class DiscoveryEngine(NVIDIAEngineBase):
    async def analyze_student_interests(self, student_id: str, interactions: List[dict]) -> dict:
        prompt = f"Analyze interests for student {student_id}: {json.dumps(interactions)}"
        response = await self._call_nim_api("qwen/qwen3.5-122b-a10b", [{"role": "user", "content": prompt}])
        return {"student_id": student_id, "analysis": response["choices"][0]["message"]["content"]}


class CurriculumContextEngine(NVIDIAEngineBase):
    async def generate_context_card(self, topic: dict, course_context: dict) -> dict:
        prompt = f"Generate context card for {topic.get('name', 'Unknown')} in {course_context.get('name', 'Unknown')}"
        response = await self._call_nim_api("qwen/qwen3.5-122b-a10b", [{"role": "user", "content": prompt}])
        return {"topic_id": topic.get("id"), "content": response["choices"][0]["message"]["content"], "confidence": 0.95}


class LectureCompanionEngine(NVIDIAEngineBase):
    async def process_lecture(self, lecture_data: dict) -> dict:
        prompt = f"Summarize lecture: {lecture_data.get('content', '')}"
        response = await self._call_nim_api("qwen/qwen3.5-122b-a10b", [{"role": "user", "content": prompt}])
        return {"lecture_id": lecture_data.get("id"), "summary": response["choices"][0]["message"]["content"]}


class AdminAssistantEngine(NVIDIAEngineBase):
    async def evaluate_hardware_request(self, request: dict) -> dict:
        prompt = f"Evaluate hardware request: {json.dumps(request)}"
        response = await self._call_nim_api("openai/gpt-oss-120b", [{"role": "user", "content": prompt}], use_chat_key=True)
        return {"evaluation": response["choices"][0]["message"]["content"], "recommendation": "approve"}


class TranslationEngine(NVIDIAEngineBase):
    async def translate_content(self, text: str, target_language: str, source_language: str = "en") -> dict:
        prompt = f"Translate from {source_language} to {target_language}: {text}"
        response = await self._call_nim_api("openai/gpt-oss-120b", [{"role": "user", "content": prompt}], use_chat_key=True)
        return {
            "original": text,
            "translated": response["choices"][0]["message"]["content"],
            "source_language": source_language,
            "target_language": target_language,
        }


discovery_engine = DiscoveryEngine()
curriculum_context_engine = CurriculumContextEngine()
lecture_companion_engine = LectureCompanionEngine()
admin_assistant_engine = AdminAssistantEngine()
translation_engine = TranslationEngine()
