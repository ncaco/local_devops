import { getSessionUser, requireAuthenticatedUser } from "@/entities/session/lib/server-session";
import { MyScreen } from "@/views/my/ui/my-screen";

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAuthenticatedUser("/my");
  const user = await getSessionUser();
  const params = await searchParams;
  const welcome = typeof params.welcome === "string" ? params.welcome : undefined;

  if (!user) {
    return null;
  }

  return <MyScreen user={user} welcome={welcome} />;
}
