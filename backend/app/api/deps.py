from fastapi import Depends, Request

from app.core.request_id import get_request_id


def request_id_dep(request: Request) -> str:
    return get_request_id(request)


RequestId = Depends(request_id_dep)

