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
            <strong>SNS Deployment System</strong>
          </div>
          <div className="stack">
            <div>
              <p className="auth-kicker">{asideTitle}</p>
              <p className="marketing-proof-quote">{asideBody}</p>
            </div>
            <ul className="plain-list">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="auth-helper">
              운영 도구는 화려함보다 신뢰가 먼저입니다. 로그인 화면도 그 원칙을 따릅니다.
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
            <Link href="/">Back to landing</Link>
            {footer}
          </div>
        </section>
      </div>
    </div>
  );
}
