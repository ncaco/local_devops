from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ErrorDetail(BaseModel):
    field: str | None = None
    code: str
    message: str


class ErrorEnvelope(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] | None = None


class ResponseEnvelope(BaseModel, Generic[T]):
    request_id: str
    data: T


class ErrorResponseEnvelope(BaseModel):
    request_id: str
    error: ErrorEnvelope

