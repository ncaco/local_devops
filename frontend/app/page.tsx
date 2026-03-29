import Link from "next/link";
import { auth } from "@/src/shared/auth/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-20 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Local Init</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">회원 기능 중심으로 초기화된 로컬 베이스</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
          현재 프로젝트는 회원가입, 로그인, 회원정보, 사용자 대시보드, 관리자 사용자 관리만 남긴 상태입니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={session?.user ? "/dashboard" : "/login"}
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {session?.user ? "대시보드로 이동" : "로그인"}
          </Link>
          {!session?.user ? (
            <Link
              href="/signup"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              회원가입
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
