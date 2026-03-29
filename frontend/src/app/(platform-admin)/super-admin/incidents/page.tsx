import { SuperAdminSectionScreen } from "@/views/super-admin-section/ui/super-admin-section-screen";

export default function IncidentsPage() {
  return (
    <SuperAdminSectionScreen
      description="플랫폼 장애, 조치 이력, 고객 영향 범위를 한 곳에서 추적합니다."
      items={[
        "INC-203, Threads adapter degraded, customer impact 3 tenants",
        "INC-202, db replica lag, mitigated in 12 minutes",
        "INC-201, scheduler restart, no post loss confirmed",
      ]}
      label="Incidents"
      title="장애 및 대응 이력"
    />
  );
}
