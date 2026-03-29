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
      kicker="바로 시작하기"
      title="가게 SNS 운영을 한곳에서 정리해보세요."
      description="회원가입 후 바로 예약 발행 흐름을 만들고, 채널 상태와 실패 알림을 한 화면에서 관리할 수 있습니다."
      asideTitle="작은 팀용 SNS 운영"
      asideBody="사장님과 직원이 같이 써도 복잡하지 않고, 오늘 해야 할 게시물부터 보이게 설계합니다."
      bullets={[
        "가게나 브랜드 이름으로 바로 워크스페이스 생성",
        "예약 발행과 채널 상태를 기본 화면에서 확인",
        "필요하면 데모 로그인으로 먼저 화면 체험 가능",
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
            <input autoComplete="name" name="name" placeholder="홍길동" required />
          </label>
          <label className="field">
            <span className="field-label">Organization</span>
            <input name="organizationName" placeholder="NC97 Marketing HQ" />
          </label>
          <label className="field">
            <span className="field-label">Email</span>
            <input autoComplete="email" name="email" placeholder="you@company.com" required type="email" />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input autoComplete="new-password" name="password" placeholder="••••••••" required type="password" />
          </label>
        </div>
        <div className="button-row">
          <button className="primary-button" type="submit">
            시작하기
          </button>
          <Link className="ghost-button" href="/login">
            데모 로그인
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
