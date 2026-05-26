"""File-based per-user digital twin storage."""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
import re
from typing import Any, Dict, Optional

from loguru import logger


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _deep_merge(base: Dict[str, Any], updates: Dict[str, Any]) -> Dict[str, Any]:
    merged = dict(base)
    for key, value in updates.items():
        existing = merged.get(key)
        if isinstance(existing, dict) and isinstance(value, dict):
            merged[key] = _deep_merge(existing, value)
        else:
            merged[key] = value
    return merged


class DigitalTwinStore:
    def __init__(self, base_dir: str = "digital_twin"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _sanitize_user_id(self, user_id: str) -> str:
        sanitized = re.sub(r"[^a-zA-Z0-9._-]", "_", user_id.strip())
        return sanitized or "unknown_user"

    def _twin_path(self, user_id: str) -> Path:
        safe_user_id = self._sanitize_user_id(user_id)
        return self.base_dir / f"{safe_user_id}.json"

    def _default_role_details(self, role: str) -> Dict[str, Any]:
        normalized_role = (role or "").strip().lower()
        if normalized_role == "student":
            return {
                "academics": {
                    "level": None,
                    "xp": None,
                    "gpa": None,
                    "weak_topics": [],
                    "strong_topics": [],
                },
                "placement": {
                    "readiness_score": None,
                    "target_role": None,
                    "companies": [],
                    "skill_gaps": [],
                },
            }
        if normalized_role == "professor":
            return {
                "teaching": {
                    "courses": [],
                    "coverage": {},
                    "student_comprehension": None,
                },
                "operations": {
                    "tool_utilization": {},
                    "pending_actions": [],
                },
            }
        if normalized_role == "admin":
            return {
                "institution": {
                    "accreditation_readiness": None,
                    "staff_performance": {},
                    "placement_overview": {},
                },
                "operations": {
                    "alerts": [],
                    "pending_approvals": [],
                },
            }
        return {"notes": {}}

    def _default_snapshot(
        self,
        user_id: str,
        role: str,
        email: Optional[str] = None,
        name: Optional[str] = None,
    ) -> Dict[str, Any]:
        now_iso = _utc_now_iso()
        return {
            "user_id": user_id,
            "role": role,
            "profile": {"email": email, "name": name},
            "details": self._default_role_details(role),
            "context_data": {},
            "custom_inputs": {},
            "history": [],
            "created_at": now_iso,
            "updated_at": now_iso,
        }

    def _read_snapshot(self, path: Path) -> Optional[Dict[str, Any]]:
        if not path.exists():
            return None
        raw = path.read_text(encoding="utf-8")
        try:
            loaded = json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.error(f"Digital twin file is invalid JSON: {path} ({exc})")
            return None
        if not isinstance(loaded, dict):
            logger.error(f"Digital twin file has invalid root type: {path}")
            return None
        return loaded

    def _write_snapshot(self, path: Path, snapshot: Dict[str, Any]) -> None:
        path.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False, default=str), encoding="utf-8")

    def ensure_twin(
        self,
        user_id: str,
        role: str,
        email: Optional[str] = None,
        name: Optional[str] = None,
    ) -> Dict[str, Any]:
        path = self._twin_path(user_id)
        existing = self._read_snapshot(path)
        if existing is None:
            snapshot = self._default_snapshot(user_id=user_id, role=role, email=email, name=name)
            self._write_snapshot(path, snapshot)
            return snapshot

        profile = existing.get("profile")
        if not isinstance(profile, dict):
            profile = {}
        profile_updates: Dict[str, Any] = {}
        if email is not None:
            profile_updates["email"] = email
        if name is not None:
            profile_updates["name"] = name
        profile = _deep_merge(profile, profile_updates)

        existing["profile"] = profile
        existing["role"] = role or existing.get("role")
        if "details" not in existing or not isinstance(existing["details"], dict):
            existing["details"] = self._default_role_details(existing["role"])
        existing["updated_at"] = _utc_now_iso()
        self._write_snapshot(path, existing)
        return existing

    def get_twin(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self._read_snapshot(self._twin_path(user_id))

    def update_context(
        self,
        user_id: str,
        role: str,
        context_updates: Dict[str, Any],
        source: str = "update_context",
    ) -> Dict[str, Any]:
        snapshot = self.ensure_twin(user_id=user_id, role=role)
        current_context = snapshot.get("context_data")
        if not isinstance(current_context, dict):
            current_context = {}
        snapshot["context_data"] = _deep_merge(current_context, context_updates)
        history = snapshot.get("history")
        if not isinstance(history, list):
            history = []
        history.append({"timestamp": _utc_now_iso(), "source": source, "updated_keys": list(context_updates.keys())})
        snapshot["history"] = history[-100:]
        snapshot["updated_at"] = _utc_now_iso()
        self._write_snapshot(self._twin_path(user_id), snapshot)
        return snapshot

    def update_custom_inputs(
        self,
        user_id: str,
        role: str,
        custom_inputs: Dict[str, Any],
        source: str = "update_custom_inputs",
    ) -> Dict[str, Any]:
        snapshot = self.ensure_twin(user_id=user_id, role=role)
        existing_inputs = snapshot.get("custom_inputs")
        if not isinstance(existing_inputs, dict):
            existing_inputs = {}
        snapshot["custom_inputs"] = _deep_merge(existing_inputs, custom_inputs)
        history = snapshot.get("history")
        if not isinstance(history, list):
            history = []
        history.append({"timestamp": _utc_now_iso(), "source": source, "custom_keys": list(custom_inputs.keys())})
        snapshot["history"] = history[-100:]
        snapshot["updated_at"] = _utc_now_iso()
        self._write_snapshot(self._twin_path(user_id), snapshot)
        return snapshot


digital_twin_store = DigitalTwinStore()

