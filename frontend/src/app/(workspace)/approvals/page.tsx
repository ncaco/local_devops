import { getApprovals } from "@/shared/api/dashboard";
import { ApprovalsScreen } from "@/views/approvals/ui/approvals-screen";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const approvals = await getApprovals();
  return <ApprovalsScreen approvals={approvals} />;
}
