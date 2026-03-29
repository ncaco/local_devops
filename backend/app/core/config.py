from functools import lru_cache

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "SNS AUTOMATION API"
    app_port: int = 18000
    database_url: str = "postgresql+psycopg://sns:sns100!@localhost:15432/sns_automation"
    db_schema: str = "public"
    cors_origins: list[AnyHttpUrl] = ["http://localhost:13000"]
    default_user_role: str = "USER"
    password_min_length: int = 8
    avatar_upload_dir: str = "uploads/avatars"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
