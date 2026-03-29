import Link from "next/link";

import { loginAction } from "@/features/auth/model/actions";
import { AuthPage } from "@/widgets/auth-page/ui/auth-page";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const next = typeof params.next === "string" ? params.next : "/overview";

  return (
    <AuthPage
      kicker="로그인"
      title="오늘 올릴 게시물과 예약 상태를 바로 확인합니다."
      description="이메일로 로그인하면 예약 발행, 채널 상태, 실패 알림을 한 화면에서 다시 볼 수 있습니다."
      asideTitle="사장님 + 직원 1명 운영"
      asideBody="적은 인원으로 SNS를 운영할수록 확인해야 할 화면은 줄고, 놓치는 일정은 없어야 합니다."
      bullets={[
        "오늘 예약된 게시물과 시간을 다시 확인",
        "채널 연결 이상과 실패 알림을 한곳에서 점검",
        "데모 계정으로 바로 화면 흐름 확인 가능",
      ]}
      notice={error ? <div className="auth-error">{error}</div> : null}
      footer={
        <span>
          계정이 없나요? <Link href="/signup">회원가입</Link>
        </span>
      }
    >
      <form action={loginAction} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label className="field">
          <span className="field-label">Email</span>
          <input autoComplete="email" name="email" placeholder="admin@example.com" required type="email" />
          <p className="field-hint">데모 계정: admin/operator/approver/viewer/superadmin@example.com</p>
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input autoComplete="current-password" name="password" placeholder="••••••••" required type="password" />
        </label>
        <div className="button-row">
          <button className="primary-button" type="submit">
            로그인
          </button>
          <Link className="ghost-button" href="/signup">
            바로 시작하기
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
