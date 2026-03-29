import hashlib
import mimetypes
import secrets
from datetime import UTC, datetime, timedelta
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import hash_password, validate_password_policy, verify_password
from app.db.models import User, UserWithdrawalHistory
from app.db.session import get_db
from app.schemas.auth import (
    ChangePasswordRequest,
    DeleteAccountRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    SessionUserRequest,
    UpdateUserProfileRequest,
    UserResponse,
    VerifyResetCodeRequest,
    VerifyResetCodeResponse,
)


router = APIRouter(prefix="/auth", tags=["auth"])
ALLOWED_AVATAR_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_AVATAR_BYTES = 2 * 1024 * 1024
AVATAR_EXTENSION_BY_MIME = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}


def _hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _to_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        avatar_updated_at=user.avatar_updated_at,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


def _get_active_user_or_401(db: Session, user_id: UUID) -> User:
    user = db.get(User, user_id)
    if not user or user.del_yn:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session user not found.")
    return user


def _avatar_directory() -> Path:
    settings = get_settings()
    directory = Path(settings.avatar_upload_dir)
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def _avatar_file_path(file_name: str) -> Path:
    return _avatar_directory() / file_name


def _delete_avatar_file(file_name: str | None) -> None:
    if not file_name:
        return

    avatar_path = _avatar_file_path(file_name)
    if avatar_path.exists():
        avatar_path.unlink()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> UserResponse:
    settings = get_settings()

    if not validate_password_policy(payload.password, settings.password_min_length):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must be at least {settings.password_min_length} characters and include letters and numbers.",
        )

    existing_user = db.scalar(select(User).where(User.email == payload.email))
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists.")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        role=settings.default_user_role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _to_user_response(user)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
@router.post("/send-reset-code", response_model=ForgotPasswordResponse)
def send_reset_code(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> ForgotPasswordResponse:
    settings = get_settings()
    user = db.scalar(select(User).where(User.email == payload.email))
    reset_code: str | None = None

    if user:
        reset_code = f"{secrets.randbelow(1_000_000):06d}"
        user.reset_password_token_hash = _hash_reset_token(reset_code)
        user.reset_password_token_expires_at = datetime.now(UTC) + timedelta(minutes=10)
        db.add(user)
        db.commit()

    return ForgotPasswordResponse(
        message="If the email exists, a reset code has been sent.",
        reset_code=reset_code if settings.app_env != "production" else None,
    )


@router.post("/verify-reset-code", response_model=VerifyResetCodeResponse)
def verify_reset_code(payload: VerifyResetCodeRequest, db: Session = Depends(get_db)) -> VerifyResetCodeResponse:
    user = db.scalar(select(User).where(User.email == payload.email))

    if (
        not user
        or not user.reset_password_token_hash
        or not user.reset_password_token_expires_at
        or user.reset_password_token_expires_at < datetime.now(UTC)
        or user.reset_password_token_hash != _hash_reset_token(payload.code)
    ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset code.")

    reset_token = secrets.token_urlsafe(32)
    user.reset_password_token_hash = _hash_reset_token(reset_token)
    user.reset_password_token_expires_at = datetime.now(UTC) + timedelta(hours=1)
    db.add(user)
    db.commit()

    return VerifyResetCodeResponse(message="Reset code verified.", reset_token=reset_token)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    settings = get_settings()
    if not validate_password_policy(payload.password, settings.password_min_length):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must be at least {settings.password_min_length} characters and include letters and numbers.",
        )

    token_hash = _hash_reset_token(payload.token)
    user = db.scalar(select(User).where(User.reset_password_token_hash == token_hash))

    if not user or not user.reset_password_token_expires_at or user.reset_password_token_expires_at < datetime.now(UTC):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")

    user.password_hash = hash_password(payload.password)
    user.reset_password_token_hash = None
    user.reset_password_token_expires_at = None
    db.add(user)
    db.commit()

    return MessageResponse(message="Password has been reset successfully.")


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> UserResponse:
    user = db.scalar(select(User).where(User.email == payload.email, User.del_yn.is_(False)))

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    return _to_user_response(user)


@router.post("/session-user", response_model=UserResponse)
def session_user(payload: SessionUserRequest, db: Session = Depends(get_db)) -> UserResponse:
    user = _get_active_user_or_401(db, payload.user_id)
    return _to_user_response(user)


@router.patch("/profile", response_model=UserResponse)
def update_profile(payload: UpdateUserProfileRequest, db: Session = Depends(get_db)) -> UserResponse:
    user = _get_active_user_or_401(db, payload.user_id)
    normalized_name = payload.name.strip() if payload.name else None

    if normalized_name != user.name:
        user.name = normalized_name
        db.add(user)
        db.commit()
        db.refresh(user)

    return _to_user_response(user)


@router.post("/profile-avatar", response_model=UserResponse)
async def upload_profile_avatar(
    user_id: UUID = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> UserResponse:
    user = _get_active_user_or_401(db, user_id)

    if file.content_type not in ALLOWED_AVATAR_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only JPG, PNG, and WebP files are allowed.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Avatar file is empty.")
    if len(content) > MAX_AVATAR_BYTES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Avatar file size must be 2MB or less.")

    extension = AVATAR_EXTENSION_BY_MIME[file.content_type]
    avatar_file_name = f"{user.id}.{extension}"

    _delete_avatar_file(user.avatar_file_name)
    _avatar_file_path(avatar_file_name).write_bytes(content)

    user.avatar_file_name = avatar_file_name
    user.avatar_mime_type = file.content_type
    user.avatar_updated_at = datetime.now(UTC)
    db.add(user)
    db.commit()
    db.refresh(user)

    return _to_user_response(user)


@router.get("/profile-avatar")
def get_profile_avatar(user_id: UUID = Query(...), db: Session = Depends(get_db)) -> Response:
    user = _get_active_user_or_401(db, user_id)

    if not user.avatar_file_name:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile avatar not found.")

    avatar_path = _avatar_file_path(user.avatar_file_name)
    if not avatar_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile avatar file not found.")

    guessed_mime_type = mimetypes.guess_type(avatar_path.name)[0]
    media_type = user.avatar_mime_type or guessed_mime_type or "application/octet-stream"
    return Response(content=avatar_path.read_bytes(), media_type=media_type)


@router.delete("/profile-avatar", response_model=UserResponse)
def delete_profile_avatar(payload: SessionUserRequest, db: Session = Depends(get_db)) -> UserResponse:
    user = _get_active_user_or_401(db, payload.user_id)

    _delete_avatar_file(user.avatar_file_name)
    user.avatar_file_name = None
    user.avatar_mime_type = None
    user.avatar_updated_at = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return _to_user_response(user)


@router.post("/change-password", response_model=MessageResponse)
def change_password(payload: ChangePasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    settings = get_settings()
    user = _get_active_user_or_401(db, payload.user_id)

    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")

    if not validate_password_policy(payload.new_password, settings.password_min_length):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must be at least {settings.password_min_length} characters and include letters and numbers.",
        )

    if verify_password(payload.new_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password must be different.")

    user.password_hash = hash_password(payload.new_password)
    user.reset_password_token_hash = None
    user.reset_password_token_expires_at = None
    db.add(user)
    db.commit()

    return MessageResponse(message="Password has been changed successfully.")


@router.post("/delete-account", response_model=MessageResponse)
def delete_account(payload: DeleteAccountRequest, db: Session = Depends(get_db)) -> MessageResponse:
    user = _get_active_user_or_401(db, payload.user_id)

    if payload.confirmation_email.strip().lower() != user.email.lower():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Confirmation email does not match.")

    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")

    withdrawal_history = UserWithdrawalHistory(
        user_id=user.id,
        email=user.email,
        confirmation_email=payload.confirmation_email.strip().lower(),
    )
    db.add(withdrawal_history)

    _delete_avatar_file(user.avatar_file_name)
    user.avatar_file_name = None
    user.avatar_mime_type = None
    user.avatar_updated_at = None
    user.del_yn = True
    user.deleted_at = datetime.now(UTC)
    db.add(user)
    db.commit()

    return MessageResponse(message="Withdrawal request has been completed.")
