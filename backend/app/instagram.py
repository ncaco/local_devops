from __future__ import annotations

import json
from datetime import datetime, timezone
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException, status
from itsdangerous import BadSignature, URLSafeSerializer

from .config import Settings


AUTH_URL = "https://www.instagram.com/oauth/authorize"
TOKEN_URL = "https://api.instagram.com/oauth/access_token"
PROFILE_URL = "https://graph.instagram.com/me"
GRAPH_BASE_URL = "https://graph.facebook.com/v23.0"


def build_connect_url(user_id: str, settings: Settings) -> str:
    state = create_state_token(user_id, settings)
    params = {
        "client_id": settings.instagram_app_id,
        "redirect_uri": settings.instagram_redirect_uri,
        "response_type": "code",
        "scope": settings.instagram_scopes,
        "state": state,
    }
    return f"{AUTH_URL}?{urlencode(params)}"


def create_state_token(user_id: str, settings: Settings) -> str:
    serializer = URLSafeSerializer(settings.state_secret, salt="instagram-connect")
    return serializer.dumps({"user_id": user_id})


def parse_state_token(state: str, settings: Settings) -> str:
    serializer = URLSafeSerializer(settings.state_secret, salt="instagram-connect")
    try:
        payload = serializer.loads(state)
    except BadSignature as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Instagram state token",
        ) from error
    return str(payload["user_id"])


async def exchange_code_for_token(code: str, settings: Settings) -> dict[str, object]:
    if not settings.instagram_app_id or not settings.instagram_app_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Instagram OAuth env is not configured",
        )

    body = {
        "client_id": settings.instagram_app_id,
        "client_secret": settings.instagram_app_secret,
        "grant_type": "authorization_code",
        "redirect_uri": settings.instagram_redirect_uri,
        "code": code,
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(TOKEN_URL, data=body)

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Instagram token exchange failed: {response.text}",
        )

    return response.json()


async def fetch_profile(access_token: str) -> dict[str, object]:
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(
            PROFILE_URL,
            params={
                "fields": "id,username,account_type,media_count",
                "access_token": access_token,
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Instagram profile fetch failed: {response.text}",
        )
    return response.json()


async def publish_instagram_post(
    access_token: str,
    provider_user_id: str,
    caption: str,
    media_url: str,
    settings: Settings,
) -> dict[str, object]:
    if settings.mock_instagram_publish:
        now = datetime.now(timezone.utc).isoformat()
        return {
            "id": f"mock-media-{provider_user_id}",
            "published_at": now,
            "mode": "mock",
            "caption": caption,
            "media_url": media_url,
        }

    async with httpx.AsyncClient(timeout=25.0) as client:
        create_response = await client.post(
            f"{GRAPH_BASE_URL}/{provider_user_id}/media",
            data={
                "image_url": media_url,
                "caption": caption,
                "access_token": access_token,
            },
        )

        if create_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Instagram media create failed: {create_response.text}",
            )

        creation_id = create_response.json().get("id")
        publish_response = await client.post(
            f"{GRAPH_BASE_URL}/{provider_user_id}/media_publish",
            data={
                "creation_id": creation_id,
                "access_token": access_token,
            },
        )

    if publish_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Instagram media publish failed: {publish_response.text}",
        )

    payload = publish_response.json()
    payload["published_at"] = datetime.now(timezone.utc).isoformat()
    payload["mode"] = "live"
    return payload


def json_dumps(data: object) -> str:
    return json.dumps(data, ensure_ascii=True, sort_keys=True)
