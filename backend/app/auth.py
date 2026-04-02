from __future__ import annotations

from datetime import datetime, timezone

import httpx
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import Settings, get_settings
from .db import get_db
from .models import User
from .schemas import AuthUser


async def get_current_user(
    authorization: str | None = Header(default=None),
    x_dev_user_id: str | None = Header(default=None),
    x_dev_user_email: str | None = Header(default=None),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> AuthUser:
    payload = None

    if authorization and authorization.startswith("Bearer ") and settings.has_supabase_auth:
        token = authorization.split(" ", 1)[1]
        payload = await fetch_supabase_user(token, settings)
    elif settings.enable_dev_auth:
        payload = {
            "id": x_dev_user_id or "00000000-0000-0000-0000-000000000001",
            "email": x_dev_user_email or "dev@local.test",
        }

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    user = sync_user(db, payload["id"], payload["email"])
    return AuthUser(id=user.id, email=user.email)


async def fetch_supabase_user(token: str, settings: Settings) -> dict[str, str]:
    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/user"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": settings.supabase_anon_key,
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Supabase session",
        )

    data = response.json()
    email = data.get("email")
    user_id = data.get("id")
    if not email or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Supabase user payload missing id or email",
        )
    return {"id": user_id, "email": email}


def sync_user(db: Session, user_id: str, email: str) -> User:
    user = db.scalar(select(User).where(User.id == user_id))
    now = datetime.now(timezone.utc)

    if user is None:
        user = User(id=user_id, email=email, created_at=now, last_seen_at=now)
        db.add(user)
    else:
        user.email = email
        user.last_seen_at = now

    db.commit()
    db.refresh(user)
    return user
