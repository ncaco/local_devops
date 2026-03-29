import { getApprovals, getDashboardOverview, getFailures } from "@/shared/api/dashboard";
import { OverviewScreen } from "@/views/overview/ui/overview-screen";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [overview, approvals, failures] = await Promise.all([
    getDashboardOverview(),
    getApprovals(),
    getFailures(),
  ]);

  return <OverviewScreen approvals={approvals} failures={failures} overview={overview} />;
}
