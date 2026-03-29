"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, PanelLeftClose, PanelLeftOpen, Shield, X } from "lucide-react";
import { useState } from "react";

import { ProfileMenu } from "@/src/shared/ui";
import AdminNav from "./AdminNav";

type AdminShellClientProps = {
  displayName: string;
  email: string;
  image?: string | null;
  userRole?: string | null;
  children: ReactNode;
};

export default function AdminShellClient({ displayName, email, image, userRole, children }: AdminShellClientProps) {
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f6f7f9] text-slate-900">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3.5">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center" aria-label="홈으로 이동">
            <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} className="h-6 w-auto" />
          </Link>
          <span className="hidden h-5 w-px bg-slate-200 sm:block" />
          <p className="hidden items-center gap-1.5 text-sm font-semibold text-slate-700 sm:flex">
            <Shield className="h-4 w-4" />
            관리자
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProfileMenu name={displayName} email={email} image={image} userRole={userRole} showDashboardLink />
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
            aria-label="관리자 메뉴 열기"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={`${isDesktopSidebarExpanded ? "w-56" : "w-14"} relative hidden border-r border-slate-200 bg-[#f8f9fb] p-2 transition-[width] duration-200 lg:block`}
        >
          <div className="mb-2 px-1">
            {isDesktopSidebarExpanded ? (
              <p className="px-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500">ADMIN MENU</p>
            ) : (
              <span className="w-full text-center text-[11px] font-semibold tracking-[0.14em] text-slate-500">ADM</span>
            )}
          </div>
          <div className="h-full overflow-y-auto pb-12">
            <AdminNav collapsed={!isDesktopSidebarExpanded} />
          </div>
          <div className="absolute bottom-3 left-3">
            <button
              type="button"
              onClick={() => setIsDesktopSidebarExpanded((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              aria-label={isDesktopSidebarExpanded ? "사이드 메뉴 접기" : "사이드 메뉴 펼치기"}
            >
              {isDesktopSidebarExpanded ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-[80] flex justify-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-950/30"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="관리자 메뉴 닫기"
          />
          <section className="relative z-20 flex h-full w-[84vw] max-w-xs flex-col border-l border-slate-200 bg-white shadow-xl">
            <div className="flex h-12 items-center justify-between border-b border-slate-200 px-3">
              <p className="text-sm font-semibold text-slate-900">관리자 메뉴</p>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700"
                aria-label="관리자 메뉴 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <AdminNav onNavigate={() => setIsMobileSidebarOpen(false)} />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
