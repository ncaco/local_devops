import Link from "next/link";
import { ReactNode } from "react";

import { getApiBaseUrl } from "@/components/api";

const navigation = [
  { href: "/", label: "Overview", note: "운영 상황" },
  { href: "/composer", label: "Composer", note: "게시 준비" },
  { href: "/approvals", label: "Approvals", note: "승인 대기" },
  { href: "/failures", label: "Failures", note: "복구 콘솔" },
];

type AppShellProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  sidePanel?: ReactNode;
};

export function AppShell({ title, eyebrow, children, sidePanel }: AppShellProps) {
  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <div className="brand-lockup">
          <span className="brand-chip">NC97 OPS</span>
          <div>
            <p className="brand-title">SNS Deployment</p>
            <p className="brand-subtitle">Quiet Control Room</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.href} className="nav-link" href={item.href}>
              <span>{item.label}</span>
              <small>{item.note}</small>
            </Link>
          ))}
        </nav>

        <section className="sidebar-card">
          <p className="sidebar-label">Active brand</p>
          <strong>Brand A / Korea</strong>
          <p className="sidebar-meta">Instagram, Threads, YouTube Shorts</p>
        </section>

        <section className="sidebar-card">
          <p className="sidebar-label">Rules</p>
          <ul className="sidebar-list">
            <li>승인 없는 게시 금지</li>
            <li>실패 5분 내 확인</li>
            <li>토큰 만료는 우선 복구</li>
          </ul>
        </section>
      </aside>

      <main className="app-main">
        <header className="page-header">
          <div>
            <p className="page-eyebrow">{eyebrow}</p>
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="page-actions">
            <span className="status-pill status-pill-info">API {getApiBaseUrl()}</span>
            <button className="ghost-button" type="button">
              Shift Report
            </button>
          </div>
        </header>

        <div className={sidePanel ? "page-grid has-side-panel" : "page-grid"}>
          <section className="page-content">{children}</section>
          {sidePanel ? <aside className="side-panel">{sidePanel}</aside> : null}
        </div>
      </main>
    </div>
  );
}
