"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  cancelPost,
  createInstagramConnectUrl,
  createPost,
  listIntegrations,
  listPosts,
  verifySession
} from "@/lib/api";
import type {
  AuthUser,
  IntegrationSummary,
  ScheduledPostInput,
  ScheduledPostListItem
} from "@/lib/contracts";
import { frontendEnv, hasSupabaseConfig } from "@/lib/env";
import { getBrowserSupabaseClient } from "@/lib/supabase";

type DashboardState = {
  user: AuthUser | null;
  integrations: IntegrationSummary[];
  posts: ScheduledPostListItem[];
};

const initialForm = (): ScheduledPostInput => ({
  social_account_id: "",
  caption: "",
  media_url: "",
  scheduled_for: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
});

export function DashboardShell() {
  const [state, setState] = useState<DashboardState>({
    user: null,
    integrations: [],
    posts: []
  });
  const [error, setError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ScheduledPostInput>(initialForm);
  const [email, setEmail] = useState(frontendEnv.devUserEmail);
  const [password, setPassword] = useState("password123!");
  const [isPending, startTransition] = useTransition();

  const activeInstagram = useMemo(
    () => state.integrations.find((item) => item.provider === "instagram" && item.status === "active"),
    [state.integrations]
  );

  useEffect(() => {
    void refreshData();
  }, []);

  useEffect(() => {
    if (activeInstagram && !form.social_account_id) {
      setForm((current) => ({ ...current, social_account_id: activeInstagram.id }));
    }
  }, [activeInstagram, form.social_account_id]);

  async function refreshData() {
    try {
      setError(null);
      const [user, integrations, posts] = await Promise.all([
        verifySession(),
        listIntegrations(),
        listPosts()
      ]);
      setState({ user, integrations, posts });
    } catch (caughtError) {
      setError(asMessage(caughtError));
    }
  }

  async function handleSignIn() {
    if (!hasSupabaseConfig) {
      setAuthMessage("Supabase 미설정 상태라 개발용 사용자로 동작합니다.");
      await refreshData();
      return;
    }

    const client = getBrowserSupabaseClient();
    if (!client) {
      setAuthMessage("Supabase client를 만들 수 없습니다.");
      return;
    }

    const { error: signInError } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setAuthMessage(signInError.message);
      return;
    }

    setAuthMessage("로그인 세션을 갱신했습니다.");
    await refreshData();
  }

  async function handleSignUp() {
    if (!hasSupabaseConfig) {
      setAuthMessage("개발 모드에서는 Supabase 회원가입을 건너뜁니다.");
      return;
    }

    const client = getBrowserSupabaseClient();
    if (!client) {
      setAuthMessage("Supabase client를 만들 수 없습니다.");
      return;
    }

    const { error: signUpError } = await client.auth.signUp({
      email,
      password
    });

    setAuthMessage(signUpError ? signUpError.message : "가입 요청을 보냈습니다.");
  }

  async function handleSignOut() {
    const client = getBrowserSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setAuthMessage("세션을 정리했습니다.");
    await refreshData();
  }

  function handleConnectInstagram() {
    startTransition(async () => {
      try {
        setError(null);
        const payload = await createInstagramConnectUrl();
        window.location.href = payload.authorize_url;
      } catch (caughtError) {
        setError(asMessage(caughtError));
      }
    });
  }

  function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        setError(null);
        await createPost({
          ...form,
          scheduled_for: new Date(form.scheduled_for).toISOString()
        });
        setForm(initialForm());
        await refreshData();
      } catch (caughtError) {
        setError(asMessage(caughtError));
      }
    });
  }

  function handleCancel(postId: string) {
    startTransition(async () => {
      try {
        setError(null);
        await cancelPost(postId);
        await refreshData();
      } catch (caughtError) {
        setError(asMessage(caughtError));
      }
    });
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="pill">Instagram scheduling MVP</span>
          <h1>멀티채널로 확장 가능한 SNS 자동화 운영 콘솔</h1>
          <p>
            현재 1차 구현은 Instagram 단일 채널 기준입니다. 사용자 인증,
            채널 연결, 예약 게시, 워커 실행 상태를 한 화면에서 관리합니다.
          </p>
        </div>
        <div className="hero-meta">
          <div className="metric-card">
            <span>백엔드</span>
            <strong>{frontendEnv.backendUrl}</strong>
          </div>
          <div className="metric-card">
            <span>로그인 모드</span>
            <strong>{hasSupabaseConfig ? "Supabase Auth" : "Dev headers"}</strong>
          </div>
        </div>
      </section>

      {error ? <p className="banner error">{error}</p> : null}
      {authMessage ? <p className="banner">{authMessage}</p> : null}

      <section className="dashboard-grid">
        <article className="panel stack">
          <header className="panel-header">
            <div>
              <p className="kicker">Auth</p>
              <h2>사용자 세션</h2>
            </div>
            <button className="button secondary" onClick={() => void refreshData()} type="button">
              새로고침
            </button>
          </header>

          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <div className="actions">
            <button className="button" onClick={() => void handleSignIn()} type="button">
              로그인
            </button>
            <button className="button secondary" onClick={() => void handleSignUp()} type="button">
              가입
            </button>
            <button className="button secondary" onClick={() => void handleSignOut()} type="button">
              로그아웃
            </button>
          </div>

          <div className="result-panel">
            {state.user ? `${state.user.email} (${state.user.id})` : "세션이 아직 확인되지 않았습니다."}
          </div>
        </article>

        <article className="panel stack">
          <header className="panel-header">
            <div>
              <p className="kicker">Integration</p>
              <h2>Instagram 연결</h2>
            </div>
            <button className="button" onClick={handleConnectInstagram} type="button">
              {isPending ? "처리 중..." : "계정 연결"}
            </button>
          </header>

          {state.integrations.length === 0 ? (
            <p className="muted">
              아직 연결된 채널이 없습니다. Meta App과 backend Instagram env를 설정한 뒤 계정을 연결하세요.
            </p>
          ) : (
            <ul className="timeline">
              {state.integrations.map((integration) => (
                <li className="timeline-item" key={integration.id}>
                  <div>
                    <strong>@{integration.username ?? integration.provider_user_id}</strong>
                    <p>{integration.status}</p>
                  </div>
                  <small>{new Date(integration.updated_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel stack span-two">
          <header className="panel-header">
            <div>
              <p className="kicker">Composer</p>
              <h2>예약 게시 작성</h2>
            </div>
            <span className="hint">이미지 1장 + 캡션만 지원</span>
          </header>

          <form className="stack" onSubmit={handleCreatePost}>
            <label className="field">
              <span>Instagram 계정</span>
              <select
                value={form.social_account_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, social_account_id: event.target.value }))
                }
              >
                <option value="">계정을 선택하세요</option>
                {state.integrations.map((integration) => (
                  <option key={integration.id} value={integration.id}>
                    @{integration.username ?? integration.provider_user_id}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>이미지 URL</span>
              <input
                placeholder="https://example.com/post.jpg"
                value={form.media_url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, media_url: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>게시 시각</span>
              <input
                type="datetime-local"
                value={form.scheduled_for}
                onChange={(event) =>
                  setForm((current) => ({ ...current, scheduled_for: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>캡션</span>
              <textarea
                rows={5}
                value={form.caption}
                onChange={(event) =>
                  setForm((current) => ({ ...current, caption: event.target.value }))
                }
              />
            </label>

            <div className="actions">
              <button className="button" disabled={isPending} type="submit">
                예약 저장
              </button>
            </div>
          </form>
        </article>

        <article className="panel stack span-two">
          <header className="panel-header">
            <div>
              <p className="kicker">Queue</p>
              <h2>예약 및 실행 결과</h2>
            </div>
            <span className="hint">{state.posts.length}건</span>
          </header>

          {state.posts.length === 0 ? (
            <p className="muted">아직 예약된 게시물이 없습니다.</p>
          ) : (
            <div className="post-list">
              {state.posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-header">
                    <div>
                      <strong>@{post.social_username ?? "unknown"}</strong>
                      <p>{new Date(post.scheduled_for).toLocaleString()}</p>
                    </div>
                    <span className={`status-badge ${post.status}`}>{post.status}</span>
                  </div>
                  <p className="caption">{post.caption}</p>
                  <a className="muted" href={post.media_url} rel="noreferrer" target="_blank">
                    {post.media_url}
                  </a>
                  {post.last_error ? <p className="error-copy">{post.last_error}</p> : null}
                  <div className="actions">
                    {(post.status === "scheduled" || post.status === "failed") ? (
                      <button
                        className="button secondary"
                        onClick={() => handleCancel(post.id)}
                        type="button"
                      >
                        취소
                      </button>
                    ) : null}
                  </div>
                  {post.executions.length > 0 ? (
                    <ul className="execution-list">
                      {post.executions.map((execution) => (
                        <li key={execution.id}>
                          attempt {execution.attempt_no}: {execution.status}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

function asMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}
