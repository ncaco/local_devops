export default async function AdminPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">관리자 개요</h1>
        <p className="mt-3 text-sm text-slate-600">
          초기화 이후 관리자 범위는 사용자 관리와 탈퇴회원 관리만 유지됩니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">사용자 관리</p>
          <p className="mt-2 text-sm text-slate-600">권한 변경과 비밀번호 초기화를 처리합니다.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">탈퇴회원 관리</p>
          <p className="mt-2 text-sm text-slate-600">탈퇴 계정 조회와 영구 삭제를 처리합니다.</p>
        </div>
      </div>
    </section>
  );
}
