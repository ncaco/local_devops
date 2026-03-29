import { AdminSectionScreen } from "@/views/admin-section/ui/admin-section-screen";

export default function AdminMembersPage() {
  return (
    <AdminSectionScreen
      description="운영자, 승인자, 조회자 권한을 조직과 브랜드 맥락으로 관리합니다."
      items={[
        "홍길동, admin, 전체 브랜드 접근",
        "김도윤, operator, Brand A/B 접근",
        "이서연, approver, Brand B 승인 전용",
      ]}
      label="Members"
      title="사용자 및 권한 관리"
    />
  );
}
