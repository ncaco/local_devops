from pydantic import BaseModel


class DashboardOverview(BaseModel):
    pending_approvals: int
    scheduled_posts: int
    failed_jobs: int
    healthy_accounts: int
    unhealthy_accounts: int
