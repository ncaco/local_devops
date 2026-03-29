import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CircleHelp, Search } from "lucide-react";

import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";
import { ProfileMenu } from "@/src/shared/ui";
import SettingsNav from "./_components/SettingsNav";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const session = await getValidatedSession();

  if (!session?.user) {
    redirect("/login");
  }

  const displayName = (session.user.name && session.user.name.trim()) || session.user.email?.split("@")[0] || "회원";
  const email = session.user.email ?? "";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f6f7f9] text-slate-900">
      <header className="shrink-0 flex h-11 items-center justify-between border-b border-slate-200 bg-white px-3.5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center" aria-label="홈으로 이동">
            <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} className="h-6 w-auto" />
          </Link>
          <span className="h-5 w-px bg-slate-200" />
          <p className="text-sm font-semibold text-slate-700">계정</p>
        </div>

        <div className="ml-4 flex items-center gap-2.5">
          <label className="flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-500">
            <Search className="h-3.5 w-3.5" />
            <input type="text" placeholder="검색..." className="w-32 border-none bg-transparent text-slate-700 outline-none" />
          </label>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="도움말"
          >
            <CircleHelp className="h-4 w-4" />
          </button>
          <ProfileMenu
            name={displayName}
            email={email}
            image={session.user.image}
            userRole={session.user.role}
            showDashboardLink
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-56 border-r border-slate-200 bg-[#f8f9fb]">
          <div className="border-b border-slate-200 px-3 py-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              대시보드로 돌아가기
            </Link>
          </div>

          <nav className="px-3 py-5">
            <p className="px-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500">계정 설정</p>
            <SettingsNav />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-10">{children}</main>
      </div>
    </div>
  );
}
