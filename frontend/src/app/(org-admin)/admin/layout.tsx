import { requireOrganizationAdmin } from "@/entities/session/lib/server-session";
import { LogoutButton } from "@/features/auth/ui/logout-button";
import { adminNav, adminPageMeta } from "@/shared/config/navigation";
import { ConsoleShell } from "@/widgets/console-shell/ui/console-shell";

export default async function OrgAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireOrganizationAdmin("/admin");

  return (
    <ConsoleShell
      actions={
        <>
          <a className="ghost-button" href="/overview">
            Workspace
          </a>
          <LogoutButton />
        </>
      }
      navItems={adminNav}
      pageMeta={adminPageMeta}
      sidebarFooter={
        <div className="sidebar-card">
          <p className="sidebar-label">Admin focus</p>
          <ul className="plain-list">
            <li>브랜드별 정책 일관성 유지</li>
            <li>권한 변경은 감사로그 남김</li>
            <li>채널 unhealthy 상태는 즉시 중단</li>
          </ul>
        </div>
      }
      tone="admin"
      user={user}
    >
      {children}
    </ConsoleShell>
  );
}
