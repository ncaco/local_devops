from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.request_id import get_request_id
from app.core.db import get_db_session
from app.domain.approval.repository import ApprovalRepository
from app.domain.approval.service import ApprovalService
from app.domain.dashboard.repository import DashboardRepository
from app.domain.dashboard.service import DashboardService
from app.domain.publish.repository import PublishRepository
from app.domain.publish.service import PublishService


def request_id_dep(request: Request) -> str:
    return get_request_id(request)


RequestId = Depends(request_id_dep)


DbSession = Annotated[AsyncSession, Depends(get_db_session)]


def get_dashboard_service(session: DbSession) -> DashboardService:
    return DashboardService(repository=DashboardRepository(session=session))


DashboardServiceDep = Annotated[DashboardService, Depends(get_dashboard_service)]


def get_approval_service(session: DbSession) -> ApprovalService:
    return ApprovalService(repository=ApprovalRepository(session=session))


ApprovalServiceDep = Annotated[ApprovalService, Depends(get_approval_service)]


def get_publish_service(session: DbSession) -> PublishService:
    return PublishService(repository=PublishRepository(session=session))


PublishServiceDep = Annotated[PublishService, Depends(get_publish_service)]
