import { AdminSectionScreen } from "@/views/admin-section/ui/admin-section-screen";

export default function AdminPoliciesPage() {
  return (
    <AdminSectionScreen
      description="승인 없는 게시를 막기 위한 조직 정책과 예외 규칙을 관리합니다."
      items={[
        "기본 정책, 모든 게시물은 approval required",
        "긴급 공지 정책, 관리자 1인 승인 허용",
        "중복 게시 차단, 24시간 내 동일 콘텐츠 재게시 금지",
      ]}
      label="Policies"
      title="승인 정책 운영"
    />
  );
}
