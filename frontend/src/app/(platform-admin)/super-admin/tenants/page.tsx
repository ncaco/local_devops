import { SuperAdminSectionScreen } from "@/views/super-admin-section/ui/super-admin-section-screen";

export default function SuperAdminTenantsPage() {
  return (
    <SuperAdminSectionScreen
      description="조직별 플랜, 활동량, 장애 빈도를 묶어 고객 운영 상태를 봅니다."
      items={[
        "Marketing HQ, Enterprise, healthy, 1,284 posts / month",
        "Retail Korea, Growth, warning, Instagram rate limit spike",
        "Agency Ops, Enterprise, incident, Threads adapter degraded",
      ]}
      label="Tenants"
      title="조직 포트폴리오"
    />
  );
}
