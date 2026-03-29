export const queue = [
  { title: "Brand A / Instagram", window: "11:30", state: "QUEUED" },
  { title: "Brand B / Threads", window: "12:00", state: "WAITING_APPROVAL" },
  { title: "Brand C / YouTube Shorts", window: "12:20", state: "BLOCKED" },
  { title: "Brand A / Facebook", window: "13:10", state: "QUEUED" },
];

export const myTasks = [
  { title: "승인 대기 카피 재검토", detail: "Brand A, 11:20 전 승인 요청 수정", tone: "warning" as const },
  { title: "토큰 만료 알림 확인", detail: "YouTube Shorts 계정 재인증 필요", tone: "danger" as const },
  { title: "오후 배포 슬롯 점검", detail: "Threads 예약 3건 최종 검수", tone: "info" as const },
];

export const recentActivity = [
  "09:12 승인 요청 생성, 봄 프로모션 런칭 안내",
  "09:46 실패 작업 확인, Threads refresh token 만료",
  "10:05 Brand B 승인 코멘트 반영 후 재요청",
];

export const organizationAlerts = [
  "Brand C 채널 한 개가 unhealthy 상태입니다.",
  "승인 정책 변경이 아직 전체 브랜드에 반영되지 않았습니다.",
  "감사로그 보관 기간 7일 전 만료 예정입니다.",
];

export const tenantHealth = [
  { name: "Marketing HQ", plan: "Enterprise", status: "healthy", posts: "1,284/mo" },
  { name: "Retail Korea", plan: "Growth", status: "warning", posts: "684/mo" },
  { name: "Agency Ops", plan: "Enterprise", status: "incident", posts: "2,184/mo" },
];

export const systemSignals = [
  "Scheduler lag 14s, 허용 범위 내",
  "Instagram adapter rate limit spike 감지",
  "DB read replica 지연 220ms",
];
