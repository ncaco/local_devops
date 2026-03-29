import { auth } from "@/src/shared/auth/auth";
import HomeLanding from "@/src/widgets/home/landing";

export default async function HomePage() {
  const session = await auth();

  return <HomeLanding isAuthenticated={Boolean(session?.user)} userName={session?.user?.name ?? null} />;
}
