from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import ApprovalServiceDep
from app.api.response import ResponseEnvelope
from app.core.request_id import get_request_id
from app.domain.approval.filters import ApprovalListFilters
from app.domain.approval.schemas import ApprovalItem

router = APIRouter(tags=["approvals"])


@router.get("/approvals")
async def approvals(
    service: ApprovalServiceDep,
    organization_id: UUID | None = None,
    brand_id: UUID | None = None,
    request_id: str = Depends(get_request_id),
):
    payload = await service.list_pending_approvals(
        ApprovalListFilters(
            organization_id=organization_id,
            brand_id=brand_id,
        )
    )
    return ResponseEnvelope[list[ApprovalItem]](request_id=request_id, data=payload)
