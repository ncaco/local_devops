import { AdminSectionScreen } from "@/views/admin-section/ui/admin-section-screen";

export default function AdminBrandsPage() {
  return (
    <AdminSectionScreen
      description="브랜드별 타임존, 활성 채널, 실패 빈도, 배포 규칙을 한 곳에서 유지합니다."
      items={[
        "Brand A, Asia/Seoul, Instagram + Threads 활성",
        "Brand B, Facebook only, 승인 정책 예외 1건",
        "Brand C, YouTube Shorts unhealthy, 재인증 필요",
      ]}
      label="Brands"
      title="브랜드 운영 설정"
    />
  );
}
