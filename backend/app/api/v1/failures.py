from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import PublishServiceDep
from app.api.response import ResponseEnvelope
from app.core.request_id import get_request_id
from app.domain.publish.filters import FailureListFilters
from app.domain.publish.schemas import FailureItem

router = APIRouter(tags=["failures"])


@router.get("/failures")
async def failures(
    service: PublishServiceDep,
    organization_id: UUID | None = None,
    brand_id: UUID | None = None,
    request_id: str = Depends(get_request_id),
):
    payload = await service.list_recent_failures(
        FailureListFilters(
            organization_id=organization_id,
            brand_id=brand_id,
        )
    )
    return ResponseEnvelope[list[FailureItem]](request_id=request_id, data=payload)
