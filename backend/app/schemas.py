from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl


class AuthUser(BaseModel):
    id: str
    email: EmailStr


class HealthResponse(BaseModel):
    ok: bool = True
    env: str


class ConnectStartResponse(BaseModel):
    authorize_url: HttpUrl


class IntegrationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    provider: str
    provider_user_id: str
    username: str | None
    status: str
    permissions: list[str] = Field(default_factory=list)
    connected_at: datetime
    updated_at: datetime


class PostExecutionSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    attempt_no: int
    status: str
    error_message: str | None
    created_at: datetime
    finished_at: datetime | None


class ScheduledPostCreate(BaseModel):
    social_account_id: str
    caption: str = Field(min_length=1, max_length=2200)
    media_url: HttpUrl
    scheduled_for: datetime


class ScheduledPostSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    provider: str
    post_type: str
    caption: str
    media_url: str
    scheduled_for: datetime
    status: str
    provider_post_id: str | None
    last_error: str | None
    published_at: datetime | None
    social_account_id: str
    social_username: str | None
    executions: list[PostExecutionSummary] = Field(default_factory=list)


class PublishDueResponse(BaseModel):
    processed: int
    published: int
    failed: int
