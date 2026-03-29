import { SuperAdminSectionScreen } from "@/views/super-admin-section/ui/super-admin-section-screen";

export default function SystemHealthPage() {
  return (
    <SuperAdminSectionScreen
      description="스케줄러, 워커, 데이터베이스, 채널 어댑터 상태를 플랫폼 시점에서 감시합니다."
      items={[
        "Scheduler lag 14s, green",
        "Worker queue depth 28, yellow",
        "DB replica lag 220ms, green",
        "Instagram adapter rate limit spike, yellow",
      ]}
      label="System Health"
      title="플랫폼 상태 감시"
    />
  );
}
