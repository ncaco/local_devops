"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
import { signOut } from "next-auth/react";

import { ProfileAvatar } from "@/src/shared/ui";

type DashboardShellProps = {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  userRole?: string | null;
};

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/settings/profile", label: "회원정보", icon: Settings },
];

export default function DashboardShell({ children, userName, userEmail, userImage, userRole }: DashboardShellProps) {
  const displayName = (userName && userName.trim()) || userEmail?.split("@")[0] || "회원";
  const isAdmin = userRole?.toUpperCase() === "ADMIN";

  return (
    <div className="flex min-h-screen bg-[#f6f7f9] text-slate-900">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <Link href="/" className="inline-flex items-center" aria-label="홈으로 이동">
            <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} className="h-7 w-auto" />
          </Link>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <ProfileAvatar name={displayName} image={userImage} size={40} className="h-10 w-10" iconClassName="h-5 w-5" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
            </div>
            <p className="mt-3 inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600">
              {userRole ?? "USER"}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAdmin ? (
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Shield className="h-4 w-4" />
                <span>관리자</span>
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="inline-flex items-center" aria-label="홈으로 이동">
              <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} className="h-6 w-auto" />
            </Link>
            {isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <Shield className="h-3.5 w-3.5" />
                관리자
              </Link>
            ) : null}
          </div>
        </header>
        <div className="mx-auto w-full max-w-5xl px-5 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
