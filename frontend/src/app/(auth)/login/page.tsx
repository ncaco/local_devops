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
      kicker="Sign in"
      title="팀의 게시 운영으로 바로 복귀합니다."
      description="이메일과 비밀번호로 로그인하면 내 작업 허브, 승인함, 관리자 화면까지 권한에 맞게 열립니다."
      asideTitle="Trust-first auth"
      asideBody="운영 도구의 로그인 화면은 빨라야 하고, 위험 신호는 숨기면 안 됩니다."
      bullets={[
        "세션 만료 시 다시 로그인 페이지로 유도",
        "역할에 따라 조직 관리자와 슈퍼어드민 분기",
        "초대 링크 사용자는 가입 흐름으로 자연스럽게 연결",
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
          <input name="email" placeholder="admin@example.com" />
          <p className="field-hint">데모 계정: admin/operator/approver/viewer/superadmin@example.com</p>
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input name="password" placeholder="••••••••" type="password" />
        </label>
        <div className="button-row">
          <button className="primary-button" type="submit">
            로그인
          </button>
          <Link className="ghost-button" href="/signup">
            조직 시작하기
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
