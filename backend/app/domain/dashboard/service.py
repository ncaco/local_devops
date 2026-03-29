from dataclasses import dataclass

from app.domain.dashboard.filters import DashboardScope
from app.domain.dashboard.repository import DashboardRepository
from app.domain.dashboard.schemas import DashboardOverview


@dataclass(slots=True)
class DashboardService:
    repository: DashboardRepository

    async def get_overview(self, scope: DashboardScope) -> DashboardOverview:
        return await self.repository.get_overview(scope)
