import Link from "next/link";

import { acceptInviteAction } from "@/features/auth/model/actions";
import { AuthPage } from "@/widgets/auth-page/ui/auth-page";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <AuthPage
      kicker="Accept invite"
      title="기존 조직에 합류하고 바로 승인 흐름으로 들어갑니다."
      description="초대 기반 가입은 이미 정해진 조직과 역할에 맞춰 계정을 연결합니다."
      asideTitle="Invite-first org access"
      asideBody="B2B 운영 툴은 아무나 가입하는 것보다, 초대와 권한 맥락이 정확해야 합니다."
      bullets={[
        `초대 토큰: ${token}`,
        "기본 권한은 approver로 설정",
        "가입 완료 후 바로 개인 작업 허브로 이동",
      ]}
      footer={
        <span>
          일반 가입이 필요하면 <Link href="/signup">회원가입</Link>
        </span>
      }
    >
      <form action={acceptInviteAction} className="auth-form">
        <input type="hidden" name="inviteToken" value={token} />
        <label className="field">
          <span className="field-label">Name</span>
          <input name="name" placeholder="이서연" />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input name="email" placeholder="approver@example.com" />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input name="password" placeholder="••••••••" type="password" />
        </label>
        <div className="button-row">
          <button className="primary-button" type="submit">
            초대 수락
          </button>
          <Link className="ghost-button" href="/login">
            로그인으로 이동
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
