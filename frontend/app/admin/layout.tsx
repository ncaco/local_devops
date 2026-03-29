import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";
import AdminShellClient from "./_components/AdminShellClient";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getValidatedSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const displayName = (session.user.name && session.user.name.trim()) || session.user.email?.split("@")[0] || "회원";
  const email = session.user.email ?? "";

  return (
    <AdminShellClient displayName={displayName} email={email} image={session.user.image} userRole={session.user.role}>
      {children}
    </AdminShellClient>
  );
}
