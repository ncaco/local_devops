from dataclasses import dataclass

from sqlalchemy import String, case, cast, distinct, func, literal, select
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.approval.filters import ApprovalListFilters
from app.domain.approval.schemas import ApprovalItem
from app.models import ApprovalRequest, Brand, ChannelAccount, ContentItem, PublishJob, User


@dataclass(slots=True)
class ApprovalRepository:
    session: AsyncSession

    async def list_pending_approvals(self, filters: ApprovalListFilters) -> list[ApprovalItem]:
        channels_expr = func.coalesce(
            func.array_agg(distinct(func.initcap(ChannelAccount.channel_type))).filter(
                ChannelAccount.channel_type.is_not(None)
            ),
            cast(literal([]), ARRAY(String())),
        )
        scheduled_at_expr = func.coalesce(
            ContentItem.planned_publish_at,
            ApprovalRequest.requested_at,
        )
        risk_level_expr = case(
            (ContentItem.priority_cd == "URGENT", "danger"),
            (ContentItem.priority_cd == "HIGH", "warning"),
            else_="info",
        )
        statement = (
            select(
                ApprovalRequest.approval_request_id,
                ContentItem.title,
                Brand.brand_name,
                channels_expr.label("channels"),
                User.display_name.label("requested_by"),
                scheduled_at_expr.label("scheduled_at"),
                risk_level_expr.label("risk_level"),
            )
            .join(ContentItem, ContentItem.content_item_id == ApprovalRequest.content_item_id)
            .join(Brand, Brand.brand_id == ContentItem.brand_id)
            .join(User, User.user_id == ApprovalRequest.requested_by_user_id)
            .outerjoin(PublishJob, PublishJob.content_item_id == ContentItem.content_item_id)
            .outerjoin(ChannelAccount, ChannelAccount.channel_account_id == PublishJob.channel_account_id)
            .where(ApprovalRequest.current_status == "REQUESTED")
        )
        if filters.organization_id is not None:
            statement = statement.where(ContentItem.organization_id == filters.organization_id)
        if filters.brand_id is not None:
            statement = statement.where(ContentItem.brand_id == filters.brand_id)
        statement = (
            statement.group_by(
                ApprovalRequest.approval_request_id,
                ContentItem.title,
                Brand.brand_name,
                User.display_name,
                scheduled_at_expr,
                ContentItem.priority_cd,
            )
            .order_by(scheduled_at_expr.asc())
            .limit(20)
        )

        result = await self.session.execute(statement)
        rows = result.mappings().all()
        return [ApprovalItem.model_validate(row) for row in rows]
