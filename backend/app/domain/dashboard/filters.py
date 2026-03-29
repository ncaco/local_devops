from dataclasses import dataclass
from uuid import UUID


@dataclass(slots=True)
class DashboardScope:
    organization_id: UUID | None = None
    brand_id: UUID | None = None
