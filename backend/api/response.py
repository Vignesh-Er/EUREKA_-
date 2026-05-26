"""API Standardized Response Envelope."""

from datetime import datetime
from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(
    data: Any,
    source: str = "database",
    request_id: Optional[str] = None
) -> dict:
    """Wrap successful response in institutional standard envelope."""
    return {
        "ok": True,
        "data": data,
        "meta": {
            "request_id": request_id,
            "source": source,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        "error": None
    }


def error_response(
    code: str,
    message: str,
    status_code: int = 400,
    request_id: Optional[str] = None,
    retry_after: Optional[int] = None
) -> JSONResponse:
    """Wrap failed response in institutional standard error envelope."""
    content = {
        "ok": False,
        "data": None,
        "meta": {
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        "error": {
            "code": code,
            "message": message,
            "retry_after": retry_after
        }
    }
    return JSONResponse(status_code=status_code, content=content)
