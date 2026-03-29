from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str | None = Field(default=None, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SessionUserRequest(BaseModel):
    user_id: UUID


class UpdateUserProfileRequest(BaseModel):
    user_id: UUID
    name: str | None = Field(default=None, max_length=120)


class ChangePasswordRequest(BaseModel):
    user_id: UUID
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8)


class DeleteAccountRequest(BaseModel):
    user_id: UUID
    current_password: str = Field(min_length=1)
    confirmation_email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    reset_code: str | None = None


class VerifyResetCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)


class VerifyResetCodeResponse(BaseModel):
    message: str
    reset_token: str


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=32)
    password: str = Field(min_length=8)


class MessageResponse(BaseModel):
    message: str


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    name: str | None
    role: str
    avatar_updated_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class HealthResponse(BaseModel):
    status: str
