from dataclasses import dataclass

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.publish.filters import FailureListFilters
from app.domain.publish.schemas import FailureItem
from app.models import AuditLog, ChannelAccount, PublishJob


@dataclass(slots=True)
class PublishRepository:
    session: AsyncSession

    async def list_recent_failures(self, filters: FailureListFilters) -> list[FailureItem]:
        latest_error_code = (
            select(AuditLog.after_data["error_code"].astext)
            .where(
                AuditLog.entity_type == "publish_jobs",
                AuditLog.entity_id == PublishJob.publish_job_id,
            )
            .order_by(AuditLog.occurred_at.desc(), AuditLog.created_at.desc())
            .limit(1)
            .scalar_subquery()
        )
        latest_message = (
            select(AuditLog.after_data["message"].astext)
            .where(
                AuditLog.entity_type == "publish_jobs",
                AuditLog.entity_id == PublishJob.publish_job_id,
            )
            .order_by(AuditLog.occurred_at.desc(), AuditLog.created_at.desc())
            .limit(1)
            .scalar_subquery()
        )
        next_action_expr = case(
            (ChannelAccount.health_status == "EXPIRED", "재인증 후 수동 재게시"),
            else_="운영자 확인 후 재시도",
        )
        retryable_expr = case(
            (ChannelAccount.health_status == "EXPIRED", False),
            else_=True,
        )
        statement = (
            select(
                PublishJob.publish_job_id,
                func.concat(func.initcap(ChannelAccount.channel_type), " 게시 실패").label("title"),
                func.initcap(ChannelAccount.channel_type).label("channel"),
                func.coalesce(latest_error_code, "PUBLISH_FAILED").label("error_code"),
                func.coalesce(latest_message, "게시 작업이 실패했습니다.").label("message"),
                next_action_expr.label("next_action"),
                retryable_expr.label("retryable"),
            )
            .join(ChannelAccount, ChannelAccount.channel_account_id == PublishJob.channel_account_id)
            .where(PublishJob.job_status == "FAILED")
        )
        if filters.organization_id is not None:
            statement = statement.where(PublishJob.organization_id == filters.organization_id)
        if filters.brand_id is not None:
            statement = statement.where(PublishJob.brand_id == filters.brand_id)
        statement = statement.order_by(
            func.coalesce(PublishJob.failed_at, PublishJob.updated_at).desc()
        ).limit(20)
        result = await self.session.execute(statement)
        rows = result.mappings().all()
        return [FailureItem.model_validate(row) for row in rows]
