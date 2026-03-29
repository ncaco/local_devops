from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class ApprovalItem(BaseModel):
    approval_request_id: str
    title: str
    brand_name: str
    channels: list[str]
    requested_by: str
    scheduled_at: datetime
    risk_level: Literal["info", "warning", "danger"]
