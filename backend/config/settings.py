"""Application configuration settings."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Project Eureka"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "change-me-in-production"

    database_url: str = "postgresql+asyncpg://eureka:eureka_password@localhost:5432/eureka"

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


settings = Settings()


@lru_cache
def get_settings() -> Settings:
    return Settings()
