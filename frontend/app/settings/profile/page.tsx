import { redirect } from "next/navigation";

import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";
import SettingsContent from "../_components/SettingsContent";

export default async function SettingsProfilePage() {
  const session = await getValidatedSession();

  if (!session?.user) {
    redirect("/login");
  }

  const displayName = (session.user.name && session.user.name.trim()) || session.user.email?.split("@")[0] || "회원";
  const email = session.user.email ?? "";

  return <SettingsContent fallbackName={displayName} fallbackEmail={email} fallbackImage={session.user.image ?? null} tab="profile" />;
}
