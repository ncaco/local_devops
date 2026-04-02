from __future__ import annotations

import json
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from urllib.parse import urlencode

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session, selectinload

from .auth import get_current_user
from .config import Settings, get_settings
from .db import Base, engine, get_db
from .instagram import (
    build_connect_url,
    exchange_code_for_token,
    fetch_profile,
    json_dumps,
    parse_state_token,
    publish_instagram_post,
)
from .models import PostExecution, ScheduledPost, SocialAccount
from .schemas import (
    AuthUser,
    ConnectStartResponse,
    HealthResponse,
    IntegrationSummary,
    PublishDueResponse,
    ScheduledPostCreate,
    ScheduledPostSummary,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="local_devops backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_app_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(env=settings.app_env)


@app.post("/auth/session/verify", response_model=AuthUser)
async def verify_session(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    return user


@app.post("/integrations/instagram/connect/start", response_model=ConnectStartResponse)
async def instagram_connect_start(
    user: AuthUser = Depends(get_current_user),
    app_settings: Settings = Depends(get_settings),
) -> ConnectStartResponse:
    authorize_url = build_connect_url(user.id, app_settings)
    return ConnectStartResponse(authorize_url=authorize_url)


@app.get("/integrations/instagram/callback")
async def instagram_callback(
    code: str | None = Query(default=None),
    state: str | None = Query(default=None),
    error: str | None = Query(default=None),
    db: Session = Depends(get_db),
    app_settings: Settings = Depends(get_settings),
):
    if error:
        return redirect_to_frontend("error", error, app_settings.frontend_app_url)
    if not code or not state:
        return redirect_to_frontend("error", "missing_code_or_state", app_settings.frontend_app_url)

    user_id = parse_state_token(state, app_settings)
    token_payload = await exchange_code_for_token(code, app_settings)
    access_token = str(token_payload["access_token"])
    profile = await fetch_profile(access_token)

    social_account = db.scalar(
        select(SocialAccount).where(
            SocialAccount.user_id == user_id,
            SocialAccount.provider == "instagram",
            SocialAccount.provider_user_id == str(profile["id"]),
        )
    )

    if social_account is None:
        social_account = SocialAccount(
            user_id=user_id,
            provider="instagram",
            provider_user_id=str(profile["id"]),
            username=profile.get("username"),
            status="active",
            access_token=access_token,
            permissions_json=json_dumps(token_payload.get("permissions", [])),
            metadata_json=json_dumps(profile),
        )
        db.add(social_account)
    else:
        social_account.username = profile.get("username")
        social_account.status = "active"
        social_account.access_token = access_token
        social_account.permissions_json = json_dumps(token_payload.get("permissions", []))
        social_account.metadata_json = json_dumps(profile)

    db.commit()
    return redirect_to_frontend("success", social_account.username or str(profile["id"]), app_settings.frontend_app_url)


@app.get("/integrations", response_model=list[IntegrationSummary])
async def list_integrations(
    user: AuthUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[IntegrationSummary]:
    accounts = db.scalars(
        select(SocialAccount)
        .where(SocialAccount.user_id == user.id)
        .order_by(SocialAccount.created_at.desc())
    ).all()

    return [
        IntegrationSummary(
            id=account.id,
            provider=account.provider,
            provider_user_id=account.provider_user_id,
            username=account.username,
            status=account.status,
            permissions=parse_permissions(account.permissions_json),
            connected_at=account.created_at,
            updated_at=account.updated_at,
        )
        for account in accounts
    ]


@app.post("/posts", response_model=ScheduledPostSummary, status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: ScheduledPostCreate,
    user: AuthUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ScheduledPostSummary:
    if payload.scheduled_for <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="scheduled_for must be in the future")

    social_account = db.scalar(
        select(SocialAccount).where(
            SocialAccount.id == payload.social_account_id,
            SocialAccount.user_id == user.id,
            SocialAccount.status == "active",
        )
    )
    if social_account is None:
        raise HTTPException(status_code=404, detail="Active Instagram account not found")

    scheduled_post = ScheduledPost(
        user_id=user.id,
        social_account_id=social_account.id,
        provider="instagram",
        post_type="image",
        caption=payload.caption,
        media_url=str(payload.media_url),
        scheduled_for=payload.scheduled_for.astimezone(timezone.utc),
        status="scheduled",
    )
    db.add(scheduled_post)
    db.commit()
    db.refresh(scheduled_post)

    return serialize_post(scheduled_post, social_account.username, [])


@app.get("/posts", response_model=list[ScheduledPostSummary])
async def list_posts(
    user: AuthUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ScheduledPostSummary]:
    posts = db.scalars(
        select(ScheduledPost)
        .where(ScheduledPost.user_id == user.id)
        .options(selectinload(ScheduledPost.social_account), selectinload(ScheduledPost.executions))
        .order_by(ScheduledPost.scheduled_for.asc())
    ).all()

    return [
        serialize_post(post, post.social_account.username, post.executions)
        for post in posts
    ]


@app.post("/posts/{post_id}/cancel", response_model=ScheduledPostSummary)
async def cancel_post(
    post_id: str,
    user: AuthUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ScheduledPostSummary:
    post = db.scalar(
        select(ScheduledPost)
        .where(ScheduledPost.id == post_id, ScheduledPost.user_id == user.id)
        .options(selectinload(ScheduledPost.social_account), selectinload(ScheduledPost.executions))
    )
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.status not in {"scheduled", "failed"}:
        raise HTTPException(status_code=400, detail="Only scheduled or failed posts can be canceled")

    post.status = "canceled"
    db.commit()
    db.refresh(post)
    return serialize_post(post, post.social_account.username, post.executions)


@app.post("/internal/jobs/publish-due", response_model=PublishDueResponse)
async def publish_due_posts(
    x_job_token: str | None = Header(default=None),
    db: Session = Depends(get_db),
    app_settings: Settings = Depends(get_settings),
) -> PublishDueResponse:
    if x_job_token != app_settings.internal_job_token:
        raise HTTPException(status_code=401, detail="Invalid internal job token")

    due_posts = db.scalars(
        select(ScheduledPost)
        .where(
            ScheduledPost.status == "scheduled",
            ScheduledPost.scheduled_for <= datetime.now(timezone.utc),
        )
        .options(selectinload(ScheduledPost.social_account), selectinload(ScheduledPost.executions))
        .order_by(ScheduledPost.scheduled_for.asc())
    ).all()

    processed = 0
    published = 0
    failed = 0

    for post in due_posts:
        claimed = db.execute(
            update(ScheduledPost)
            .where(ScheduledPost.id == post.id, ScheduledPost.status == "scheduled")
            .values(status="publishing", updated_at=datetime.now(timezone.utc))
        )
        db.commit()
        if claimed.rowcount != 1:
            continue

        processed += 1
        attempt_no = db.scalar(
            select(func.count(PostExecution.id)).where(PostExecution.scheduled_post_id == post.id)
        ) or 0
        execution = PostExecution(
            scheduled_post_id=post.id,
            attempt_no=int(attempt_no) + 1,
            status="started",
            request_payload=json_dumps(
                {
                    "caption": post.caption,
                    "media_url": post.media_url,
                    "provider_user_id": post.social_account.provider_user_id,
                }
            ),
        )
        db.add(execution)
        db.commit()
        db.refresh(execution)

        try:
            result = await publish_instagram_post(
                access_token=post.social_account.access_token,
                provider_user_id=post.social_account.provider_user_id,
                caption=post.caption,
                media_url=post.media_url,
                settings=app_settings,
            )
            post.status = "published"
            post.provider_post_id = str(result.get("id"))
            post.published_at = datetime.now(timezone.utc)
            post.last_error = None
            execution.status = "published"
            execution.response_payload = json_dumps(result)
            execution.finished_at = datetime.now(timezone.utc)
            published += 1
        except Exception as error:
            post.status = "failed"
            post.last_error = str(error)
            execution.status = "failed"
            execution.error_message = str(error)
            execution.finished_at = datetime.now(timezone.utc)
            failed += 1

        db.commit()

    return PublishDueResponse(processed=processed, published=published, failed=failed)


def serialize_post(
    post: ScheduledPost,
    social_username: str | None,
    executions: list[PostExecution],
) -> ScheduledPostSummary:
    return ScheduledPostSummary(
        id=post.id,
        provider=post.provider,
        post_type=post.post_type,
        caption=post.caption,
        media_url=post.media_url,
        scheduled_for=post.scheduled_for,
        status=post.status,
        provider_post_id=post.provider_post_id,
        last_error=post.last_error,
        published_at=post.published_at,
        social_account_id=post.social_account_id,
        social_username=social_username,
        executions=executions,
    )


def parse_permissions(raw_permissions: str | None) -> list[str]:
    if not raw_permissions:
        return []
    try:
        parsed = json.loads(raw_permissions)
        return [str(item) for item in parsed]
    except json.JSONDecodeError:
        return []


def redirect_to_frontend(result: str, value: str, frontend_url: str) -> RedirectResponse:
    query = urlencode({"status": result, "value": value})
    return RedirectResponse(url=f"{frontend_url.rstrip('/')}/integrations/instagram/complete?{query}")
