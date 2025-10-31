"""Application configuration module using Pydantic settings."""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


load_dotenv()


class Settings(BaseSettings):
    """Defines strongly typed application configuration values."""

    app_name: str = Field(default="AI CRM Platform")
    environment: str = Field(default="development")
    secret_key: str = Field(alias="SECRET_KEY")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60)

    database_url: str = Field(alias="DATABASE_URL")

    celery_broker_url: str = Field(alias="CELERY_BROKER_URL")
    celery_result_backend: str | None = Field(default=None, alias="CELERY_RESULT_BACKEND")

    smtp_host: str | None = Field(default=None, alias="SMTP_HOST")
    smtp_port: int = Field(default=587, alias="SMTP_PORT")
    smtp_username: str | None = Field(default=None, alias="SMTP_USERNAME")
    smtp_password: str | None = Field(default=None, alias="SMTP_PASSWORD")
    smtp_use_tls: bool = Field(default=True, alias="SMTP_USE_TLS")

    twilio_account_sid: str | None = Field(default=None, alias="TWILIO_ACCOUNT_SID")
    twilio_auth_token: str | None = Field(default=None, alias="TWILIO_AUTH_TOKEN")
    twilio_messaging_service_sid: str | None = Field(default=None, alias="TWILIO_MESSAGING_SERVICE_SID")
    twilio_caller_id: str | None = Field(default=None, alias="TWILIO_CALLER_ID")

    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost", "http://localhost:3000"])

    media_root: Path = Field(default=Path("/mnt/data/media"))
    log_directory: Path = Field(default=Path("logs"))
    log_file_name: str = Field(default="app.log")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: List[str] | str) -> List[str]:
        """Allow comma separated strings for CORS origins."""

        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings instance."""

    settings = Settings()
    settings.log_directory.mkdir(parents=True, exist_ok=True)
    settings.media_root.mkdir(parents=True, exist_ok=True)
    return settings


settings = get_settings()
