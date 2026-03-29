import Link from "next/link";

type AuthPageProps = {
  kicker: string;
  title: string;
  description: string;
  asideTitle: string;
  asideBody: string;
  bullets: string[];
  children: React.ReactNode;
  footer: React.ReactNode;
  notice?: React.ReactNode;
};

export function AuthPage({
  kicker,
  title,
  description,
  asideTitle,
  asideBody,
  bullets,
  children,
  footer,
  notice,
}: AuthPageProps) {
  return (
    <div className="auth-shell">
      <div className="auth-frame">
        <aside className="auth-aside">
          <div className="auth-brand">
            <span className="brand-chip">NC97 OPS</span>
            <strong>NC97 Social Ops</strong>
          </div>
          <div className="stack">
            <div>
              <p className="auth-kicker">{asideTitle}</p>
              <p className="marketing-proof-quote">{asideBody}</p>
            </div>
            <ul className="auth-bullet-list">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="auth-helper">
              가게 SNS 운영은 화려한 기능보다 오늘 올릴 게시물을 놓치지 않는 게 먼저입니다.
            </p>
          </div>
        </aside>

        <section className="auth-card">
          <div>
            <p className="auth-kicker">{kicker}</p>
            <h1>{title}</h1>
            <p className="marketing-lead">{description}</p>
          </div>

          {notice}
          {children}

          <div className="auth-inline-note">
            <Link href="/">랜딩으로 돌아가기</Link>
            {footer}
          </div>
        </section>
      </div>
    </div>
  );
}
