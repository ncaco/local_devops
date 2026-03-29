import {
  hasOrganizationRole,
  requireAuthenticatedUser,
} from "@/entities/session/lib/server-session";
import { LogoutButton } from "@/features/auth/ui/logout-button";
import { workspaceNav, workspacePageMeta } from "@/shared/config/navigation";
import { ConsoleShell } from "@/widgets/console-shell/ui/console-shell";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuthenticatedUser("/overview");
  const canAccessAdmin = hasOrganizationRole(user, ["admin"]);

  return (
    <ConsoleShell
      actions={
        <>
          {canAccessAdmin ? (
            <a className="ghost-button" href="/admin">
              Admin
            </a>
          ) : null}
          {user.platformRole === "super_admin" ? (
            <a className="ghost-button" href="/super-admin">
              Super Admin
            </a>
          ) : null}
          <LogoutButton />
        </>
      }
      navItems={workspaceNav}
      pageMeta={workspacePageMeta}
      sidebarFooter={
        <div className="sidebar-card">
          <p className="sidebar-label">Rules</p>
          <ul className="plain-list">
            <li>승인 없는 게시 금지</li>
            <li>실패 5분 내 확인</li>
            <li>토큰 만료는 우선 복구</li>
          </ul>
        </div>
      }
      tone="workspace"
      user={user}
    >
      {children}
    </ConsoleShell>
  );
}
