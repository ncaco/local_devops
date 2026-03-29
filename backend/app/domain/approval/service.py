from dataclasses import dataclass

from app.domain.approval.filters import ApprovalListFilters
from app.domain.approval.repository import ApprovalRepository
from app.domain.approval.schemas import ApprovalItem


@dataclass(slots=True)
class ApprovalService:
    repository: ApprovalRepository

    async def list_pending_approvals(self, filters: ApprovalListFilters) -> list[ApprovalItem]:
        return await self.repository.list_pending_approvals(filters)
