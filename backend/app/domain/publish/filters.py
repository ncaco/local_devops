from dataclasses import dataclass
from uuid import UUID


@dataclass(slots=True)
class FailureListFilters:
    organization_id: UUID | None = None
    brand_id: UUID | None = None
