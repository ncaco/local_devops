export const overviewMetrics = [
  { label: "오늘 예정 게시", value: "24", detail: "3건은 30분 내 실행", tone: "info" as const },
  { label: "승인 대기", value: "7", detail: "고우선순위 2건 포함", tone: "warning" as const },
  { label: "실패 작업", value: "2", detail: "토큰 만료 1건, 업로드 오류 1건", tone: "danger" as const },
  { label: "채널 상태", value: "11 / 12", detail: "1개 채널 주의 필요", tone: "success" as const },
];

export function createOverviewMetrics(overview: {
  pending_approvals: number;
  scheduled_posts: number;
  failed_jobs: number;
  healthy_accounts: number;
  unhealthy_accounts: number;
}) {
  return [
    {
      label: "승인 대기",
      value: String(overview.pending_approvals),
      detail: "지금 승인받아야 할 게시물 수",
      tone: "warning" as const,
    },
    {
      label: "오늘 예정 게시",
      value: String(overview.scheduled_posts),
      detail: "대기열에 올라간 게시 작업 수",
      tone: "info" as const,
    },
    {
      label: "실패 작업",
      value: String(overview.failed_jobs),
      detail: "운영자가 즉시 확인해야 할 실패 수",
      tone: "danger" as const,
    },
    {
      label: "채널 상태",
      value: `${overview.healthy_accounts} / ${overview.healthy_accounts + overview.unhealthy_accounts}`,
      detail: "정상 연결된 채널 계정 수",
      tone: overview.unhealthy_accounts > 0 ? ("warning" as const) : ("success" as const),
    },
  ];
}

export const timeline = [
  { time: "09:10", title: "Brand A 릴스 게시 완료", detail: "Instagram / 캠페인 런칭 티저", tone: "success" as const },
  { time: "09:25", title: "승인 요청 접수", detail: "Threads / 세일즈 문구 A/B", tone: "info" as const },
  { time: "09:40", title: "토큰 만료 감지", detail: "YouTube Shorts / Brand C", tone: "warning" as const },
  { time: "09:58", title: "실패 재시도 대기", detail: "Instagram / 이미지 업로드 413", tone: "danger" as const },
];

export const approvals = [
  { title: "봄 시즌 런칭 카피", channel: "Instagram", schedule: "오늘 12:30", priority: "HIGH", summary: "브랜드 톤 승인 필요, 해시태그 5개 포함" },
  { title: "Threads 실시간 반응형 문안", channel: "Threads", schedule: "오늘 14:00", priority: "URGENT", summary: "빠른 승인 후 즉시 배포 예정" },
  { title: "쇼츠 스크립트 요약본", channel: "YouTube Shorts", schedule: "내일 09:00", priority: "NORMAL", summary: "썸네일 카피와 본문 검수 필요" },
];

export function buildTimelineFromApi(
  approvalsFromApi: Array<{
    title: string;
    brand_name: string;
    scheduled_at: string;
    risk_level: string;
  }>,
  failuresFromApi: Array<{
    title: string;
    channel: string;
    next_action: string;
    retryable: boolean;
  }>,
) {
  const approvalRows = approvalsFromApi.slice(0, 2).map((item) => ({
    time: item.scheduled_at.slice(11, 16),
    title: `${item.brand_name} 승인 대기`,
    detail: item.title,
    tone: item.risk_level === "warning" ? ("warning" as const) : ("info" as const),
  }));

  const failureRows = failuresFromApi.slice(0, 2).map((item) => ({
    time: "LIVE",
    title: item.title,
    detail: `${item.channel} / ${item.next_action}`,
    tone: item.retryable ? ("warning" as const) : ("danger" as const),
  }));

  return [...failureRows, ...approvalRows];
}

export const failures = [
  { title: "Brand C YouTube token expired", detail: "재인증 필요, 마지막 성공 게시 3일 전", action: "Reconnect channel", severity: "warning" as const },
  { title: "Instagram image upload rejected", detail: "파일 크기 초과 가능성, 413 응답", action: "Retry with compressed asset", severity: "danger" as const },
];

export const queue = [
  { title: "Brand A / Instagram", window: "11:30", state: "QUEUED" },
  { title: "Brand B / Threads", window: "12:00", state: "WAITING_APPROVAL" },
  { title: "Brand C / YouTube Shorts", window: "12:20", state: "BLOCKED" },
  { title: "Brand A / Facebook", window: "13:10", state: "QUEUED" },
];
