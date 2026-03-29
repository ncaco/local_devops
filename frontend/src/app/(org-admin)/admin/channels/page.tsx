import { AdminSectionScreen } from "@/views/admin-section/ui/admin-section-screen";

export default function AdminChannelsPage() {
  return (
    <AdminSectionScreen
      description="토큰 만료, 권한 부족, 재인증 필요 여부를 채널 단위로 추적합니다."
      items={[
        "Instagram / Brand A, healthy, 마지막 검증 09:02",
        "Threads / Brand B, healthy, scope 정상",
        "YouTube Shorts / Brand C, token expired, 재인증 필요",
      ]}
      label="Channel Accounts"
      title="채널 연결 상태"
    />
  );
}
