import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleHelp, Search } from "lucide-react";

import { ProfileMenu } from "@/src/shared/ui";
import AccountNav from "./AccountNav";

type AccountShellProps = {
  children: ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  userRole?: string | null;
};

export default function AccountShell({ children, userName, userEmail, userImage, userRole }: AccountShellProps) {
  const displayName = (userName && userName.trim()) || userEmail?.split("@")[0] || "회원";
  const email = userEmail ?? "";
  const isAdmin = userRole?.toUpperCase() === "ADMIN";

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] text-slate-900">
      <header className="shrink-0 border-b border-slate-200 bg-white px-3.5">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex items-center" aria-label="홈으로 이동">
              <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} className="h-8 w-auto" />
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <p className="hidden text-sm font-semibold text-slate-700 sm:block">계정</p>
          </div>

          <div className="ml-4 flex items-center gap-2.5">
            <label className="hidden h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-500 md:flex">
              <Search className="h-3.5 w-3.5" />
              <input type="text" placeholder="검색..." className="w-32 border-none bg-transparent text-slate-700 outline-none" />
            </label>
            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 md:inline-flex"
              aria-label="도움말"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
            <ProfileMenu name={displayName} email={email} image={userImage} userRole={userRole} showDashboardLink={false} />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-[#f8f9fb] md:block">
          <nav className="px-3 py-5">
            <AccountNav showAdmin={isAdmin} />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="border-b border-slate-200 bg-white px-3 py-4 md:hidden">
            <AccountNav mobile showAdmin={isAdmin} />
          </div>
          <div className="p-5 sm:p-7 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
