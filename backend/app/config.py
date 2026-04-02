from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = Field(default="development", alias="APP_ENV")
    database_url: str = Field(default="sqlite:///./local_devops.db", alias="DATABASE_URL")
    frontend_app_url: str = Field(default="http://localhost:3000", alias="FRONTEND_APP_URL")
    internal_job_token: str = Field(default="local-job-token", alias="INTERNAL_JOB_TOKEN")
    instagram_app_id: str = Field(default="", alias="INSTAGRAM_APP_ID")
    instagram_app_secret: str = Field(default="", alias="INSTAGRAM_APP_SECRET")
    instagram_redirect_uri: str = Field(
        default="http://localhost:8000/integrations/instagram/callback",
        alias="INSTAGRAM_REDIRECT_URI",
    )
    instagram_scopes: str = Field(
        default="instagram_business_basic,instagram_business_content_publish",
        alias="INSTAGRAM_SCOPES",
    )
    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_anon_key: str = Field(default="", alias="SUPABASE_ANON_KEY")
    enable_dev_auth: bool = Field(default=True, alias="ENABLE_DEV_AUTH")
    mock_instagram_publish: bool = Field(default=True, alias="MOCK_INSTAGRAM_PUBLISH")
    state_secret: str = Field(default="local-devops-state-secret", alias="STATE_SECRET")

    @property
    def has_supabase_auth(self) -> bool:
        return bool(self.supabase_url and self.supabase_anon_key)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
