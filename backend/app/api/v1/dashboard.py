from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import DashboardServiceDep
from app.api.response import ResponseEnvelope
from app.core.request_id import get_request_id
from app.domain.dashboard.filters import DashboardScope
from app.domain.dashboard.schemas import DashboardOverview

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard/overview")
async def dashboard_overview(
    service: DashboardServiceDep,
    organization_id: UUID | None = None,
    brand_id: UUID | None = None,
    request_id: str = Depends(get_request_id),
):
    payload = await service.get_overview(
        DashboardScope(
            organization_id=organization_id,
            brand_id=brand_id,
        )
    )
    return ResponseEnvelope[DashboardOverview](request_id=request_id, data=payload)
