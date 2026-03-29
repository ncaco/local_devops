from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.response import ErrorEnvelope, ErrorResponseEnvelope
from app.core.db import engine
from app.core.request_id import get_request_id

router = APIRouter(tags=["health"])


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/ready", responses={503: {"model": ErrorResponseEnvelope}})
async def ready(request_id: str = Depends(get_request_id)):
    try:
        async with engine.connect() as connection:
            await connection.execute(text("select 1"))
    except SQLAlchemyError:
        payload = ErrorResponseEnvelope(
                request_id=request_id,
                error=ErrorEnvelope(code="DB_UNAVAILABLE", message="데이터베이스 연결에 실패했습니다."),
        )
        return JSONResponse(status_code=503, content=payload.model_dump())
    return {"status": "ready"}

