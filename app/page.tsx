import { InstagramLoginButton } from "@/app/components/instagram-login-button";
import { getInstagramDebugSnapshot } from "@/lib/instagram";

const envConfigured =
  Boolean(process.env.INSTAGRAM_APP_ID) &&
  Boolean(process.env.INSTAGRAM_APP_SECRET) &&
  Boolean(process.env.INSTAGRAM_REDIRECT_URI);

export default function HomePage() {
  const debug =
    envConfigured
      ? getInstagramDebugSnapshot()
      : null;

  return (
    <main>
      <section className="hero">
        <span className="eyebrow">Next.js App Router</span>
        <h1 className="title">Instagram OAuth Example</h1>
        <p className="lede">
          Meta 설정이 끝난 Instagram Professional 계정을 대상으로, 로그인 버튼
          하나와 콜백 처리만 남긴 가장 단순한 예제입니다.
        </p>
      </section>

      <section className="grid">
        <article className="card stack">
          <h2>시작</h2>
          <p>
            버튼을 누르면 `/api/auth/instagram`으로 이동하고, 서버에서 `state`를
            생성한 뒤 Instagram 권한 페이지로 리다이렉트합니다.
          </p>
          <div>
            <InstagramLoginButton />
          </div>
          <p className={envConfigured ? "ok" : "warn"}>
            {envConfigured
              ? "환경변수가 설정되어 있습니다."
              : "먼저 .env.local에 Instagram 앱 설정을 넣어야 합니다."}
          </p>
        </article>

        <article className="card stack">
          <h3>필수 전제</h3>
          <ul className="list">
            <li>Meta App에서 Instagram 제품과 Redirect URI를 설정해야 합니다.</li>
            <li>예제는 2026년 4월 기준 Basic Display 대신 현재 OAuth 흐름을 가정합니다.</li>
            <li>일반 개인 계정보다 Professional 계정 기준으로 맞추는 편이 안전합니다.</li>
          </ul>
        </article>

        <article className="card stack">
          <h3>흐름</h3>
          <ul className="list">
            <li>로그인 요청</li>
            <li>Instagram 권한 승인</li>
            <li>콜백에서 `code` 검증</li>
            <li>액세스 토큰 교환</li>
            <li>`graph.instagram.com/me` 프로필 조회</li>
          </ul>
        </article>

        <article className="card stack">
          <h3>디버그</h3>
          <p>현재 서버가 실제로 만들고 있는 값입니다. Meta 콘솔 값과 한 글자까지 같아야 합니다.</p>
          <div className="result">
            {debug
              ? JSON.stringify(debug, null, 2)
              : "환경변수가 아직 비어 있습니다."}
          </div>
        </article>
      </section>
    </main>
  );
}
