export type NavItem = {
  href: string;
  label: string;
  note: string;
};

export type PageMeta = {
  eyebrow: string;
  title: string;
};

export const workspaceNav: NavItem[] = [
  { href: "/overview", label: "Overview", note: "운영 상황" },
  { href: "/my", label: "My Page", note: "내 작업 허브" },
  { href: "/composer", label: "Composer", note: "게시 준비" },
  { href: "/approvals", label: "Approvals", note: "승인 대기" },
  { href: "/failures", label: "Failures", note: "복구 콘솔" },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Admin Home", note: "조직 상태" },
  { href: "/admin/brands", label: "Brands", note: "브랜드 운영" },
  { href: "/admin/members", label: "Members", note: "권한 관리" },
  { href: "/admin/channels", label: "Channels", note: "계정 연결" },
  { href: "/admin/policies", label: "Policies", note: "승인 정책" },
  { href: "/admin/audit-log", label: "Audit Log", note: "이력 추적" },
];

export const superAdminNav: NavItem[] = [
  { href: "/super-admin", label: "Control", note: "플랫폼 관제" },
  { href: "/super-admin/tenants", label: "Tenants", note: "조직 운영" },
  { href: "/super-admin/system-health", label: "System Health", note: "장애 감시" },
  { href: "/super-admin/billing", label: "Billing", note: "플랜 관리" },
  { href: "/super-admin/incidents", label: "Incidents", note: "조치 이력" },
];

export const workspacePageMeta: Record<string, PageMeta> = {
  "/overview": { eyebrow: "Operations Overview", title: "SNS Deployment Console" },
  "/my": { eyebrow: "My Workspace", title: "개인 작업 허브" },
  "/composer": { eyebrow: "Publish Preparation", title: "Content Composer" },
  "/approvals": { eyebrow: "Approval Queue", title: "Approval Inbox" },
  "/failures": { eyebrow: "Recovery Console", title: "Failure Console" },
};

export const adminPageMeta: Record<string, PageMeta> = {
  "/admin": { eyebrow: "Organization Admin", title: "조직 관리자 관제판" },
  "/admin/brands": { eyebrow: "Brand Operations", title: "브랜드 운영 설정" },
  "/admin/members": { eyebrow: "Member Access", title: "사용자 및 권한 관리" },
  "/admin/channels": { eyebrow: "Channel Accounts", title: "채널 연결 상태" },
  "/admin/policies": { eyebrow: "Approval Policies", title: "승인 정책 운영" },
  "/admin/audit-log": { eyebrow: "Audit Trail", title: "감사로그 탐색" },
};

export const superAdminPageMeta: Record<string, PageMeta> = {
  "/super-admin": { eyebrow: "Platform Control", title: "슈퍼어드민 운영실" },
  "/super-admin/tenants": { eyebrow: "Tenant Health", title: "조직 포트폴리오" },
  "/super-admin/system-health": { eyebrow: "System Health", title: "플랫폼 상태 감시" },
  "/super-admin/billing": { eyebrow: "Billing", title: "플랜 및 과금 현황" },
  "/super-admin/incidents": { eyebrow: "Incident Desk", title: "장애 및 대응 이력" },
};
