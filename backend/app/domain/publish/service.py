from dataclasses import dataclass

from app.domain.publish.filters import FailureListFilters
from app.domain.publish.repository import PublishRepository
from app.domain.publish.schemas import FailureItem


@dataclass(slots=True)
class PublishService:
    repository: PublishRepository

    async def list_recent_failures(self, filters: FailureListFilters) -> list[FailureItem]:
        return await self.repository.list_recent_failures(filters)
