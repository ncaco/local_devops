import { SuperAdminSectionScreen } from "@/views/super-admin-section/ui/super-admin-section-screen";

export default function BillingPage() {
  return (
    <SuperAdminSectionScreen
      description="플랜 업셀 기회와 과금 이상을 운영 데이터와 함께 봅니다."
      items={[
        "Agency Ops, overage threshold 82%",
        "Retail Korea, Growth renewal in 12 days",
        "Marketing HQ, invoice paid, annual contract healthy",
      ]}
      label="Billing"
      title="플랜 및 과금 현황"
    />
  );
}
