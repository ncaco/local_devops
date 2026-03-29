import { requirePlatformAdmin } from "@/entities/session/lib/server-session";
import { LogoutButton } from "@/features/auth/ui/logout-button";
import { superAdminNav, superAdminPageMeta } from "@/shared/config/navigation";
import { ConsoleShell } from "@/widgets/console-shell/ui/console-shell";

export default async function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requirePlatformAdmin("/super-admin");

  return (
    <ConsoleShell
      actions={
        <>
          <a className="ghost-button" href="/overview">
            Workspace
          </a>
          <a className="ghost-button" href="/admin">
            Org Admin
          </a>
          <LogoutButton />
        </>
      }
      navItems={superAdminNav}
      pageMeta={superAdminPageMeta}
      sidebarFooter={
        <div className="sidebar-card">
          <p className="sidebar-label">Platform policy</p>
          <ul className="plain-list">
            <li>장애 감지는 사용자보다 먼저</li>
            <li>과금 이슈는 tenant health와 함께 보기</li>
            <li>슈퍼어드민 액션은 항상 기록</li>
          </ul>
        </div>
      }
      tone="platform"
      user={user}
    >
      {children}
    </ConsoleShell>
  );
}
