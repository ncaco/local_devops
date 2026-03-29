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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:18000";
const KOREA_TIME_ZONE = "Asia/Seoul";

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

  return (
    data ?? {
      pending_approvals: 0,
      scheduled_posts: 0,
      failed_jobs: 0,
      healthy_accounts: 0,
      unhealthy_accounts: 0,
    }
  );
}

export async function getApprovals(): Promise<ApprovalItem[]> {
  const data = await apiGet<ApprovalItem[]>("/api/v1/approvals");
  return data ?? [];
}

export async function getFailures(): Promise<FailureItem[]> {
  const data = await apiGet<FailureItem[]>("/api/v1/failures");
  return data ?? [];
}

export function formatScheduledAt(
  scheduledAt: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return scheduledAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KOREA_TIME_ZONE,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
  }).format(date);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
