from dataclasses import dataclass

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dashboard.filters import DashboardScope
from app.domain.dashboard.schemas import DashboardOverview
from app.models import ApprovalRequest, ChannelAccount, PublishJob


@dataclass(slots=True)
class DashboardRepository:
    session: AsyncSession

    async def get_overview(self, scope: DashboardScope) -> DashboardOverview:
        approvals_count = select(func.count()).select_from(ApprovalRequest).where(
            ApprovalRequest.current_status == "REQUESTED"
        )
        queued_jobs_count = select(func.count()).select_from(PublishJob).where(
            PublishJob.job_status == "QUEUED"
        )
        failed_jobs_count = select(func.count()).select_from(PublishJob).where(
            PublishJob.job_status == "FAILED"
        )
        healthy_accounts_count = select(func.count()).select_from(ChannelAccount).where(
            ChannelAccount.health_status == "HEALTHY",
            ChannelAccount.status == "ACTIVE",
            ChannelAccount.deleted_at.is_(None),
        )
        unhealthy_accounts_count = select(func.count()).select_from(ChannelAccount).where(
            ChannelAccount.health_status.in_(["WARNING", "UNHEALTHY", "EXPIRED"]),
            ChannelAccount.status == "ACTIVE",
            ChannelAccount.deleted_at.is_(None),
        )

        approvals_count = self._apply_approval_scope(approvals_count, scope)
        queued_jobs_count = self._apply_publish_scope(queued_jobs_count, scope)
        failed_jobs_count = self._apply_publish_scope(failed_jobs_count, scope)
        healthy_accounts_count = self._apply_channel_scope(healthy_accounts_count, scope)
        unhealthy_accounts_count = self._apply_channel_scope(unhealthy_accounts_count, scope)

        statement = select(
            approvals_count.scalar_subquery().label("pending_approvals"),
            queued_jobs_count.scalar_subquery().label("scheduled_posts"),
            failed_jobs_count.scalar_subquery().label("failed_jobs"),
            healthy_accounts_count.scalar_subquery().label("healthy_accounts"),
            unhealthy_accounts_count.scalar_subquery().label("unhealthy_accounts"),
        )
        result = await self.session.execute(statement)
        row = result.mappings().one()
        return DashboardOverview.model_validate(row)

    @staticmethod
    def _apply_approval_scope(statement: Select[tuple[int]], scope: DashboardScope) -> Select[tuple[int]]:
        if scope.organization_id is not None:
            statement = statement.where(ApprovalRequest.content_item.has(organization_id=scope.organization_id))
        if scope.brand_id is not None:
            statement = statement.where(ApprovalRequest.content_item.has(brand_id=scope.brand_id))
        return statement

    @staticmethod
    def _apply_publish_scope(statement: Select[tuple[int]], scope: DashboardScope) -> Select[tuple[int]]:
        if scope.organization_id is not None:
            statement = statement.where(PublishJob.organization_id == scope.organization_id)
        if scope.brand_id is not None:
            statement = statement.where(PublishJob.brand_id == scope.brand_id)
        return statement

    @staticmethod
    def _apply_channel_scope(statement: Select[tuple[int]], scope: DashboardScope) -> Select[tuple[int]]:
        if scope.organization_id is not None:
            statement = statement.where(ChannelAccount.organization_id == scope.organization_id)
        if scope.brand_id is not None:
            statement = statement.where(ChannelAccount.brand_id == scope.brand_id)
        return statement
