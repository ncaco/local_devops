import { getFailures } from "@/shared/api/dashboard";
import { FailuresScreen } from "@/views/failures/ui/failures-screen";

export const dynamic = "force-dynamic";

export default async function FailuresPage() {
  const failures = await getFailures();
  return <FailuresScreen failures={failures} />;
}
