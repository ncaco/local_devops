import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import hash_password, validate_password_policy, verify_password
from app.db.models import User
from app.db.session import get_db
from app.schemas.admin import (
    AdminUserListResponse,
    AdminUserPasswordUpdateRequest,
    AdminUserResponse,
    AdminUserRoleUpdateRequest,
    AdminWithdrawnUserDeleteRequest,
)
from app.schemas.auth import MessageResponse


router = APIRouter(prefix="/admin", tags=["admin"])
ALLOWED_USER_ROLES = {"USER", "ADMIN"}
ALLOWED_USER_SEARCH_FIELDS = {"NAME", "EMAIL"}
logger = logging.getLogger(__name__)
settings = get_settings()


def _to_admin_user_response(user: User) -> AdminUserResponse:
    return AdminUserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        organization_count=0,
        project_count=0,
        avatar_updated_at=user.avatar_updated_at,
        created_at=user.created_at,
        updated_at=user.updated_at,
        deleted_at=user.deleted_at,
    )


def _require_admin_actor(db: Session, actor_user_id: UUID) -> User:
    actor = db.get(User, actor_user_id)
    if not actor or actor.del_yn:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session user not found.")
    if actor.role.upper() != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return actor


def _build_user_filters(
    *,
    is_withdrawn: bool,
    search: str | None,
    search_field: str | None,
    role: str | None,
) -> list:
    filters = [User.del_yn.is_(is_withdrawn)]
    normalized_search = search.strip() if search else ""
    normalized_search_field = search_field.strip().upper() if search_field else ""
    normalized_role = role.strip().upper() if role else ""

    if normalized_search_field and normalized_search_field not in ALLOWED_USER_SEARCH_FIELDS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid search field.")

    if normalized_search:
        if normalized_search_field == "NAME":
            filters.append(User.name.ilike(f"%{normalized_search}%"))
        elif normalized_search_field == "EMAIL":
            filters.append(User.email.ilike(f"%{normalized_search}%"))
        else:
            filters.append(or_(User.email.ilike(f"%{normalized_search}%"), User.name.ilike(f"%{normalized_search}%")))

    if normalized_role:
        if normalized_role not in ALLOWED_USER_ROLES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role filter.")
        filters.append(User.role == normalized_role)

    return filters


def _list_users(
    *,
    db: Session,
    page: int,
    size: int,
    search: str | None,
    search_field: str | None,
    role: str | None,
    is_withdrawn: bool,
) -> AdminUserListResponse:
    filters = _build_user_filters(
        is_withdrawn=is_withdrawn,
        search=search,
        search_field=search_field,
        role=role,
    )
    base_filter = [User.del_yn.is_(is_withdrawn)]

    total_all = db.scalar(select(func.count(User.id)).where(*base_filter)) or 0
    total_admin = db.scalar(select(func.count(User.id)).where(*base_filter, User.role == "ADMIN")) or 0
    total_user = db.scalar(select(func.count(User.id)).where(*base_filter, User.role == "USER")) or 0
    total = db.scalar(select(func.count(User.id)).where(*filters)) or 0
    users = db.scalars(
        select(User)
        .where(*filters)
        .order_by(User.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
    ).all()

    return AdminUserListResponse(
        items=[_to_admin_user_response(user) for user in users],
        page=page,
        size=size,
        total=total,
        total_all=total_all,
        total_admin=total_admin,
        total_user=total_user,
    )


@router.get("/users", response_model=AdminUserListResponse)
def list_users(
    actor_user_id: UUID,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    search_field: str | None = Query(default=None),
    role: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> AdminUserListResponse:
    _require_admin_actor(db, actor_user_id)
    return _list_users(
        db=db,
        page=page,
        size=size,
        search=search,
        search_field=search_field,
        role=role,
        is_withdrawn=False,
    )


@router.get("/withdrawn-users", response_model=AdminUserListResponse)
def list_withdrawn_users(
    actor_user_id: UUID,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    search_field: str | None = Query(default=None),
    role: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> AdminUserListResponse:
    _require_admin_actor(db, actor_user_id)
    return _list_users(
        db=db,
        page=page,
        size=size,
        search=search,
        search_field=search_field,
        role=role,
        is_withdrawn=True,
    )


@router.patch("/users/{target_user_id}/role", response_model=AdminUserResponse)
def update_user_role(target_user_id: UUID, payload: AdminUserRoleUpdateRequest, db: Session = Depends(get_db)) -> AdminUserResponse:
    actor = _require_admin_actor(db, payload.actor_user_id)

    if actor.id == target_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot change your own role.")

    next_role = payload.role.strip().upper()
    if next_role not in ALLOWED_USER_ROLES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role.")

    target_user = db.get(User, target_user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target user not found.")

    if target_user.role != next_role:
        target_user.role = next_role
        db.add(target_user)
        db.commit()
        db.refresh(target_user)

    return _to_admin_user_response(target_user)


@router.patch("/users/{target_user_id}/password", response_model=MessageResponse)
def update_user_password(
    target_user_id: UUID,
    payload: AdminUserPasswordUpdateRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    actor = _require_admin_actor(db, payload.actor_user_id)
    logger.info("Admin password change requested: actor_user_id=%s target_user_id=%s", payload.actor_user_id, target_user_id)

    if not verify_password(payload.actor_current_password, actor.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="관리자 비밀번호가 일치하지 않습니다.")

    if not validate_password_policy(payload.new_password, settings.password_min_length):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must be at least {settings.password_min_length} characters and include letters and numbers.",
        )

    target_user = db.get(User, target_user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target user not found.")

    target_user.password_hash = hash_password(payload.new_password)
    target_user.reset_password_token_hash = None
    target_user.reset_password_token_expires_at = None
    db.add(target_user)
    db.commit()

    return MessageResponse(message="Password updated successfully.")


@router.delete("/withdrawn-users/{target_user_id}", response_model=MessageResponse)
def hard_delete_withdrawn_user(
    target_user_id: UUID,
    payload: AdminWithdrawnUserDeleteRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    _require_admin_actor(db, payload.actor_user_id)

    user = db.get(User, target_user_id)
    if not user or not user.del_yn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Withdrawn user not found.")

    if payload.confirmation_email.strip().lower() != user.email.lower():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Confirmation email does not match.")

    db.delete(user)
    db.commit()
    return MessageResponse(message="탈퇴회원이 영구 삭제되었습니다.")
