import { redirect } from "next/navigation";

import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";
import DashboardShell from "@/src/widgets/dashboard/layout/ui/DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getValidatedSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardShell
      userName={session.user.name}
      userEmail={session.user.email}
      userImage={session.user.image}
      userRole={session.user.role}
    >
      {children}
    </DashboardShell>
  );
}
