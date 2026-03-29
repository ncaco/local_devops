import Link from "next/link";
import { auth } from "@/src/shared/auth/auth";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">User Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          {(user?.name && `${user.name} 님`) || "회원님"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">초기화된 상태입니다. 현재는 회원 정보 관리와 관리자 기능만 남아 있습니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Account</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">이름</dt>
              <dd className="font-medium text-slate-900">{user?.name ?? "-"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">이메일</dt>
              <dd className="font-medium text-slate-900">{user?.email ?? "-"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">권한</dt>
              <dd className="font-medium text-slate-900">{user?.role ?? "USER"}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Quick Links</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/settings/profile"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              회원정보 관리
            </Link>
            {user?.role?.toUpperCase() === "ADMIN" ? (
              <Link
                href="/admin"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                관리자 화면
              </Link>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
