import { formatScheduledAt } from "@/shared/lib/time";

type ResponseEnvelope<T> = {
  request_id: string;
  data: T;
};

export type DashboardOverview = {
  pending_approvals: number;
  scheduled_posts: number;
  failed_jobs: number;
  healthy_accounts: number;
  unhealthy_accounts: number;
};

export type ApprovalItem = {
  approval_request_id: string;
  title: string;
  brand_name: string;
  channels: string[];
  requested_by: string;
  scheduled_at: string;
  risk_level: string;
};

export type FailureItem = {
  publish_job_id: string;
  title: string;
  channel: string;
  error_code: string;
  message: string;
  next_action: string;
  retryable: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:18000";

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        "x-request-id": `frontend_${Date.now()}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ResponseEnvelope<T>;
    return payload.data;
  } catch {
    return null;
  }
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const data = await apiGet<DashboardOverview>("/api/v1/dashboard/overview");
  return data ?? { pending_approvals: 4, scheduled_posts: 7, failed_jobs: 2, healthy_accounts: 5, unhealthy_accounts: 1 };
}

export async function getApprovals(): Promise<ApprovalItem[]> {
  const data = await apiGet<ApprovalItem[]>("/api/v1/approvals");
  return data ?? [
    {
      approval_request_id: "APR-101",
      title: "봄 프로모션 런칭 안내",
      brand_name: "브랜드 A",
      channels: ["Instagram", "X"],
      requested_by: "김도윤",
      scheduled_at: "2026-03-29T13:00:00Z",
      risk_level: "warning",
    },
    {
      approval_request_id: "APR-102",
      title: "가맹점 정기 공지",
      brand_name: "브랜드 B",
      channels: ["Facebook"],
      requested_by: "이서연",
      scheduled_at: "2026-03-29T16:30:00Z",
      risk_level: "info",
    },
  ];
}

export async function getFailures(): Promise<FailureItem[]> {
  const data = await apiGet<FailureItem[]>("/api/v1/failures");
  return data ?? [
    {
      publish_job_id: "JOB-8842",
      title: "Instagram 게시 실패",
      channel: "Instagram",
      error_code: "CHANNEL_RATE_LIMIT",
      message: "외부 API 호출 제한에 도달했습니다.",
      next_action: "12분 뒤 자동 재시도",
      retryable: true,
    },
    {
      publish_job_id: "JOB-8827",
      title: "Threads 게시 차단",
      channel: "Threads",
      error_code: "TOKEN_EXPIRED",
      message: "연결 계정 refresh token이 만료되었습니다.",
      next_action: "재인증 후 수동 재게시",
      retryable: false,
    },
  ];
}

export function buildOverviewMetrics(overview: DashboardOverview) {
  return [
    { label: "승인 대기", value: String(overview.pending_approvals), detail: "지금 승인받아야 할 게시물 수", tone: "warning" as const },
    { label: "오늘 예정 게시", value: String(overview.scheduled_posts), detail: "대기열에 올라간 게시 작업 수", tone: "info" as const },
    { label: "실패 작업", value: String(overview.failed_jobs), detail: "운영자가 즉시 확인해야 할 실패 수", tone: "danger" as const },
    {
      label: "채널 상태",
      value: `${overview.healthy_accounts} / ${overview.healthy_accounts + overview.unhealthy_accounts}`,
      detail: "정상 연결된 채널 계정 수",
      tone: overview.unhealthy_accounts > 0 ? ("warning" as const) : ("success" as const),
    },
  ];
}

export function buildTimeline(approvals: ApprovalItem[], failures: FailureItem[]) {
  const approvalRows = approvals.slice(0, 2).map((item) => ({
    time: formatScheduledAt(item.scheduled_at, { hour: "2-digit", minute: "2-digit", month: undefined, day: undefined }),
    title: `${item.brand_name} 승인 대기`,
    detail: item.title,
    tone: item.risk_level === "warning" ? ("warning" as const) : ("info" as const),
  }));

  const failureRows = failures.slice(0, 2).map((item) => ({
    time: "LIVE",
    title: item.title,
    detail: `${item.channel} / ${item.next_action}`,
    tone: item.retryable ? ("warning" as const) : ("danger" as const),
  }));

  return [...failureRows, ...approvalRows];
}
