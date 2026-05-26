"""Translation API routes."""

from typing import Optional

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from services.nvidia_engines import translation_engine

router = APIRouter(prefix="/translation", tags=["Translation"])
security = HTTPBearer()


class TranslateRequest(BaseModel):
    text: str
    target_language: str
    source_language: Optional[str] = "en"


class SynthesizeRequest(BaseModel):
    text: str
    language: str = "en"
    voice: str = "female"


@router.post("/translate")
async def translate_content(request: TranslateRequest, _: HTTPAuthorizationCredentials = Depends(security)):
    return await translation_engine.translate_content(request.text, request.target_language, request.source_language or "en")


@router.post("/transcribe")
async def transcribe_audio(language: str = "en", _: HTTPAuthorizationCredentials = Depends(security)):
    return {"transcript": "Mock transcript from Riva ASR", "language": language, "confidence": 0.95}


@router.post("/synthesize")
async def synthesize_speech(request: SynthesizeRequest, _: HTTPAuthorizationCredentials = Depends(security)):
    return {"audio_base64": "mock_audio_data", "language": request.language, "voice": request.voice}


@router.get("/languages")
async def get_supported_languages():
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
            {"code": "de", "name": "German"},
            {"code": "hi", "name": "Hindi"},
        ]
    }
