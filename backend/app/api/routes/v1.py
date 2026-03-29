from fastapi import APIRouter, Depends

from app.api.response import ResponseEnvelope
from app.core.request_id import get_request_id
from app.domain.dashboard.schemas import ApprovalItem, DashboardOverview, FailureItem

router = APIRouter(prefix="/api/v1", tags=["v1"])


@router.get("/dashboard/overview")
async def dashboard_overview(request_id: str = Depends(get_request_id)):
    payload = DashboardOverview(
        pending_approvals=4,
        scheduled_posts=7,
        failed_jobs=2,
        healthy_accounts=5,
        unhealthy_accounts=1,
    )
    return ResponseEnvelope[DashboardOverview](request_id=request_id, data=payload)


@router.get("/approvals")
async def approvals(request_id: str = Depends(get_request_id)):
    payload = [
        ApprovalItem(
            approval_request_id="APR-101",
            title="봄 프로모션 런칭 안내",
            brand_name="브랜드 A",
            channels=["Instagram", "X"],
            requested_by="김도윤",
            scheduled_at="2026-03-29T13:00:00Z",
            risk_level="warning",
        ),
        ApprovalItem(
            approval_request_id="APR-102",
            title="가맹점 정기 공지",
            brand_name="브랜드 B",
            channels=["Facebook"],
            requested_by="이서연",
            scheduled_at="2026-03-29T16:30:00Z",
            risk_level="info",
        ),
    ]
    return ResponseEnvelope[list[ApprovalItem]](request_id=request_id, data=payload)


@router.get("/failures")
async def failures(request_id: str = Depends(get_request_id)):
    payload = [
        FailureItem(
            publish_job_id="JOB-8842",
            title="Instagram 게시 실패",
            channel="Instagram",
            error_code="CHANNEL_RATE_LIMIT",
            message="외부 API 호출 제한에 도달했습니다.",
            next_action="12분 뒤 자동 재시도",
            retryable=True,
        ),
        FailureItem(
            publish_job_id="JOB-8827",
            title="Threads 게시 차단",
            channel="Threads",
            error_code="TOKEN_EXPIRED",
            message="연결 계정 refresh token이 만료되었습니다.",
            next_action="재인증 후 수동 재게시",
            retryable=False,
        ),
    ]
    return ResponseEnvelope[list[FailureItem]](request_id=request_id, data=payload)

