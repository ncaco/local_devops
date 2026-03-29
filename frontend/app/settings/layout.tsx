import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";
import AccountShell from "@/src/widgets/account/layout/ui/AccountShell";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const session = await getValidatedSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AccountShell
      userName={session.user.name}
      userEmail={session.user.email}
      userImage={session.user.image}
      userRole={session.user.role}
    >
      {children}
    </AccountShell>
  );
}
