from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test_local_devops.db"
os.environ["ENABLE_DEV_AUTH"] = "true"
os.environ["MOCK_INSTAGRAM_PUBLISH"] = "true"
os.environ["INTERNAL_JOB_TOKEN"] = "test-job-token"

from app.main import app  # noqa: E402
from app.db import Base, engine  # noqa: E402
from app.models import SocialAccount  # noqa: E402


client = TestClient(app)
DEV_HEADERS = {
    "x-dev-user-id": "user-1",
    "x-dev-user-email": "user-1@example.com",
}


def setup_function() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def create_social_account() -> str:
    with TestClient(app) as test_client:
        verify_response = test_client.post("/auth/session/verify", headers=DEV_HEADERS)
        assert verify_response.status_code == 200

    from app.db import SessionLocal

    session = SessionLocal()
    try:
        social = SocialAccount(
            user_id="user-1",
            provider="instagram",
            provider_user_id="ig-user-1",
            username="insta_one",
            status="active",
            access_token="token-1",
        )
        session.add(social)
        session.commit()
        session.refresh(social)
        return social.id
    finally:
        session.close()


def test_verify_session_dev_auth() -> None:
    response = client.post("/auth/session/verify", headers=DEV_HEADERS)

    assert response.status_code == 200
    assert response.json()["email"] == "user-1@example.com"


def test_create_post_requires_future_date() -> None:
    social_account_id = create_social_account()

    response = client.post(
        "/posts",
        headers=DEV_HEADERS,
        json={
            "social_account_id": social_account_id,
            "caption": "Past post",
            "media_url": "https://example.com/past.jpg",
            "scheduled_for": datetime.now(timezone.utc).isoformat(),
        },
    )

    assert response.status_code == 400


def test_publish_due_flow() -> None:
    social_account_id = create_social_account()
    create_response = client.post(
        "/posts",
        headers=DEV_HEADERS,
        json={
            "social_account_id": social_account_id,
            "caption": "Launch day",
            "media_url": "https://example.com/launch.jpg",
            "scheduled_for": (datetime.now(timezone.utc) + timedelta(minutes=1)).isoformat(),
        },
    )
    assert create_response.status_code == 201
    post_id = create_response.json()["id"]

    from app.db import SessionLocal
    from app.models import ScheduledPost

    session = SessionLocal()
    try:
        post = session.get(ScheduledPost, post_id)
        assert post is not None
        post.scheduled_for = datetime.now(timezone.utc) - timedelta(minutes=1)
        session.commit()
    finally:
        session.close()

    job_response = client.post(
        "/internal/jobs/publish-due",
        headers={"x-job-token": "test-job-token"},
    )
    assert job_response.status_code == 200
    assert job_response.json() == {"processed": 1, "published": 1, "failed": 0}

    posts_response = client.get("/posts", headers=DEV_HEADERS)
    assert posts_response.status_code == 200
    post_payload = posts_response.json()[0]
    assert post_payload["status"] == "published"
    assert len(post_payload["executions"]) == 1


def test_cancel_post() -> None:
    social_account_id = create_social_account()
    create_response = client.post(
        "/posts",
        headers=DEV_HEADERS,
        json={
            "social_account_id": social_account_id,
            "caption": "Cancel me",
            "media_url": "https://example.com/cancel.jpg",
            "scheduled_for": (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat(),
        },
    )
    post_id = create_response.json()["id"]

    cancel_response = client.post(f"/posts/{post_id}/cancel", headers=DEV_HEADERS)

    assert cancel_response.status_code == 200
    assert cancel_response.json()["status"] == "canceled"
