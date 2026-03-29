from uuid import uuid4

from fastapi import Request


def get_request_id(request: Request) -> str:
    existing = request.headers.get("x-request-id")
    return existing or f"req_{uuid4().hex[:12]}"

