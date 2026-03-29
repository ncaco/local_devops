from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class AdminUserResponse(BaseModel):
    id: UUID
    email: str
    name: str | None
    role: str
    organization_count: int = Field(ge=0, default=0)
    project_count: int = Field(ge=0, default=0)
    avatar_updated_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    deleted_at: datetime | None = None


class AdminUserListResponse(BaseModel):
    items: list[AdminUserResponse]
    page: int = Field(ge=1)
    size: int = Field(ge=1)
    total: int = Field(ge=0)
    total_all: int = Field(ge=0)
    total_admin: int = Field(ge=0)
    total_user: int = Field(ge=0)


class AdminUserRoleUpdateRequest(BaseModel):
    actor_user_id: UUID
    role: str = Field(min_length=1, max_length=30)


class AdminUserPasswordUpdateRequest(BaseModel):
    actor_user_id: UUID
    actor_current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8)


class AdminWithdrawnUserDeleteRequest(BaseModel):
    actor_user_id: UUID
    confirmation_email: EmailStr
