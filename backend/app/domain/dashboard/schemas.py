from pydantic import BaseModel


class DashboardOverview(BaseModel):
    pending_approvals: int
    scheduled_posts: int
    failed_jobs: int
    healthy_accounts: int
    unhealthy_accounts: int


class ApprovalItem(BaseModel):
    approval_request_id: str
    title: str
    brand_name: str
    channels: list[str]
    requested_by: str
    scheduled_at: str
    risk_level: str


class FailureItem(BaseModel):
    publish_job_id: str
    title: str
    channel: str
    error_code: str
    message: str
    next_action: str
    retryable: bool

