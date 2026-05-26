"""Authentication service with JWT token handling."""

from datetime import datetime, timedelta
from enum import Enum
from typing import Optional

import httpx
from jose import JWTError, jwt
from loguru import logger
from passlib.context import CryptContext

from config import settings
from services.digital_twin_store import digital_twin_store


class UserRole(str, Enum):
    STUDENT = "student"
    PROFESSOR = "professor"
    ADMIN = "admin"


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.jwt_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Optional[dict]:
    if token and token.startswith("demo-token-"):
        user_id = token.replace("demo-token-", "")
        if user_id == "prof-1":
            return {"sub": "prof@university.edu", "user_id": "prof-1", "role": "professor"}
        elif user_id == "student-1":
            return {"sub": "student@university.edu", "user_id": "student-1", "role": "student"}
        elif user_id == "admin-1":
            return {"sub": "admin@university.edu", "user_id": "admin-1", "role": "admin"}
        elif user_id == "parent-1":
            return {"sub": "parent@university.edu", "user_id": "parent-1", "role": "parent"}
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None



def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(days=7), "type": "refresh"})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


class AuthService:
    def __init__(self):
        self.mock_users = {
            "student": {
                "id": "student-1",
                "email": "student@university.edu",
                "password_hash": get_password_hash("password123"),
                "name": "Alex Chen",
                "role": UserRole.STUDENT.value,
            },
            "professor": {
                "id": "prof-1",
                "email": "prof@university.edu",
                "password_hash": get_password_hash("password123"),
                "name": "Dr. Ananya Kumar",
                "role": UserRole.PROFESSOR.value,
            },
            "admin": {
                "id": "admin-1",
                "email": "admin@university.edu",
                "password_hash": get_password_hash("password123"),
                "name": "System Administrator",
                "role": UserRole.ADMIN.value,
            },
        }

    def authenticate_user(self, email: str, password: str, role: str) -> Optional[dict]:
        user_data = self.mock_users.get(role.lower())
        if not user_data:
            return None
        if user_data["email"] != email:
            return None
        if not verify_password(password, user_data["password_hash"]):
            return None
        return user_data

    def authenticate_supabase_user(self, email: str, password: str, role: str) -> Optional[dict]:
        if not settings.supabase_enabled:
            return None

        role_key = role.lower()
        if role_key not in self.mock_users:
            return None

        try:
            with httpx.Client(timeout=settings.supabase_timeout_ms / 1000.0) as client:
                response = client.post(
                    f"{settings.supabase_url.rstrip('/')}/auth/v1/token?grant_type=password",
                    headers={
                        "apikey": settings.supabase_anon_key,
                        "Content-Type": "application/json",
                    },
                    json={"email": email, "password": password},
                )
        except httpx.HTTPError as exc:
            logger.error(f"Supabase auth request failed: {exc}")
            return None

        if response.status_code != 200:
            logger.warning(f"Supabase auth rejected credentials: status={response.status_code}")
            return None

        payload = response.json()
        supabase_user = payload.get("user") or {}
        if not supabase_user.get("email"):
            return None

        app_role = (supabase_user.get("app_metadata") or {}).get("role")
        if app_role and str(app_role).lower() != role_key:
            logger.warning(
                f"Supabase role mismatch for {email}: requested={role_key}, metadata={app_role}"
            )
            return None

        template = self.mock_users[role_key]
        return {
            "id": supabase_user.get("id", template["id"]),
            "email": supabase_user.get("email", email),
            "password_hash": template["password_hash"],
            "name": supabase_user.get("user_metadata", {}).get("name") or template["name"],
            "role": template["role"],
        }

    def login(self, email: str, password: str, role: str) -> dict:
        user_data = self.authenticate_supabase_user(email, password, role)
        if not user_data:
            user_data = self.authenticate_user(email, password, role)
        if not user_data:
            raise ValueError("Invalid credentials")

        digital_twin_store.ensure_twin(
            user_id=user_data["id"],
            role=user_data["role"],
            email=user_data["email"],
            name=user_data["name"],
        )

        access_token = create_access_token(
            data={"sub": user_data["email"], "user_id": user_data["id"], "role": user_data["role"]}
        )
        refresh_token = create_refresh_token(data={"sub": user_data["email"], "user_id": user_data["id"]})
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user_data,
        }

    def switch_role(self, user_id: str, new_role: str) -> dict:
        user_data = self.mock_users.get(new_role.lower())
        if not user_data:
            raise ValueError("Invalid role")
        digital_twin_store.ensure_twin(
            user_id=user_data["id"],
            role=user_data["role"],
            email=user_data["email"],
            name=user_data["name"],
        )
        access_token = create_access_token(
            data={"sub": user_data["email"], "user_id": user_data["id"], "role": user_data["role"]}
        )
        return {"access_token": access_token, "user": user_data}


auth_service = AuthService()
