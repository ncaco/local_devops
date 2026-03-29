import { AdminSectionScreen } from "@/views/admin-section/ui/admin-section-screen";

export default function AdminAuditPage() {
  return (
    <AdminSectionScreen
      description="권한 변경, 승인, 실패 복구, 채널 재인증까지 모두 감사로그로 남깁니다."
      items={[
        "10:02, approval_request APR-102 승인, actor 홍길동",
        "09:57, channel account 상태 변경, Threads token expired",
        "09:31, user role 업데이트, viewer -> approver",
      ]}
      label="Audit Log"
      title="감사로그 탐색"
    />
  );
}
