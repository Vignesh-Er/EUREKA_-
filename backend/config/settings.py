"""Application configuration settings."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Project Eureka"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "change-me-in-production"

    database_url: str = "sqlite+aiosqlite:///./data/eureka.db"
    redis_url: str = ""

    nim_default_model: str = "qwen/qwen3.5-122b-a10b"
    nim_vision_model: str = "qwen/qwen3.5-397b-a17b"
    nim_fast_model: str = "qwen/qwen3.5-35b-a3b"

    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_api_key: str = ""

    nvidia_nemo_api_key: str = ""
    nvidia_nim_api_key: str = ""
    nvidia_chat_api_key: str = ""
    nvidia_riva_api_key: str = ""
    nvidia_riva_endpoint: str = "riva-api.nvidia.com:443"

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"

    log_level: str = "INFO"
    request_timeout_ms: int = 30000
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_timeout_ms: int = 10000

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def nvidia_config(self) -> dict:
        return {
            "nemo_api_key": self.nvidia_nemo_api_key,
            "nim_api_key": self.nvidia_nim_api_key,
            "chat_api_key": self.nvidia_chat_api_key,
            "riva_api_key": self.nvidia_riva_api_key,
            "riva_endpoint": self.nvidia_riva_endpoint,
        }

    @property
    def supabase_enabled(self) -> bool:
        return bool(self.supabase_url and self.supabase_anon_key)

    from pydantic import model_validator
    @model_validator(mode="after")
    def validate_production_keys(self) -> 'Settings':
        if self.app_env == "production":
            if self.secret_key == "change-me-in-production" or self.jwt_secret_key == "change-me-in-production":
                raise ValueError("In production, 'secret_key' and 'jwt_secret_key' must be changed from default values!")
            if "sqlite" in self.database_url:
                raise ValueError("SQLite is not allowed in production environment. A PostgreSQL DATABASE_URL must be supplied!")
        return self


settings = Settings()


@lru_cache
def get_settings() -> Settings:
    return Settings()
