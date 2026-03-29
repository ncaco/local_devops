import Link from "next/link";

import { signupAction } from "@/features/auth/model/actions";
import { AuthPage } from "@/widgets/auth-page/ui/auth-page";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <AuthPage
      kicker="Start organization"
      title="새 조직을 열고 승인 기반 운영을 시작합니다."
      description="일반 회원가입은 새 조직 생성으로 이어집니다. 초대를 받은 사용자는 별도 링크로 기존 조직에 합류합니다."
      asideTitle="Hybrid signup"
      asideBody="외부 유입은 바로 시작하고, 기존 조직 초대는 끊김 없이 수락해야 합니다."
      bullets={[
        "회원가입 후 기본 역할은 조직 관리자",
        "조직 이름을 입력하면 첫 브랜드 운영 공간 생성",
        "초대 링크는 별도 화면에서 approver 흐름으로 수락",
      ]}
      notice={error ? <div className="auth-error">{error}</div> : null}
      footer={
        <span>
          이미 계정이 있나요? <Link href="/login">로그인</Link>
        </span>
      }
    >
      <form action={signupAction} className="auth-form">
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Name</span>
            <input name="name" placeholder="홍길동" />
          </label>
          <label className="field">
            <span className="field-label">Organization</span>
            <input name="organizationName" placeholder="NC97 Marketing HQ" />
          </label>
          <label className="field">
            <span className="field-label">Email</span>
            <input name="email" placeholder="you@company.com" />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input name="password" placeholder="••••••••" type="password" />
          </label>
        </div>
        <div className="button-row">
          <button className="primary-button" type="submit">
            회원가입
          </button>
          <Link className="ghost-button" href="/invite/demo-approver">
            초대 링크 보기
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
