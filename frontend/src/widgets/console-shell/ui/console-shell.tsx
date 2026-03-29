"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SessionUser } from "@/entities/session/model/types";
import { NavItem, PageMeta } from "@/shared/config/navigation";

type ConsoleShellProps = {
  tone: "workspace" | "admin" | "platform";
  user: SessionUser;
  navItems: NavItem[];
  pageMeta: Record<string, PageMeta>;
  children: React.ReactNode;
  actions?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
};

export function ConsoleShell({
  tone,
  user,
  navItems,
  pageMeta,
  children,
  actions,
  sidebarFooter,
}: ConsoleShellProps) {
  const pathname = usePathname();
  const current = pageMeta[pathname] ?? { eyebrow: "Workspace", title: "SNS Deployment System" };
  const primaryMembership = user.organizationMemberships[0];

  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <div className="brand-lockup">
          <span className="brand-chip">NC97 OPS</span>
          <div>
            <p className="brand-title">SNS Deployment</p>
            <p className="sidebar-meta">
              {tone === "platform" ? "Platform Control Room" : "Quiet Control Room"}
            </p>
          </div>
        </div>

        <div className="sidebar-card">
          <p className="sidebar-label">Signed in</p>
          <strong>{user.name}</strong>
          <p className="sidebar-meta">{user.email}</p>
          <div className="inline-badges">
            <span className="status-pill status-pill-info">
              {user.platformRole ?? primaryMembership?.role ?? "member"}
            </span>
            {primaryMembership ? (
              <span className="status-pill status-pill-neutral">
                {primaryMembership.organizationName}
              </span>
            ) : null}
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`nav-link${pathname === item.href ? " is-active" : ""}`}
              href={item.href}
            >
              <span>{item.label}</span>
              <small>{item.note}</small>
            </Link>
          ))}
        </nav>

        {sidebarFooter}
      </aside>

      <main className="app-main">
        <header className="console-topbar">
          <div>
            <p className="page-eyebrow">{current.eyebrow}</p>
            <h1 className="page-title">{current.title}</h1>
          </div>
          <div className="page-actions">{actions}</div>
        </header>

        {children}
      </main>
    </div>
  );
}
