import { SessionUser } from "@/entities/session/model/types";
import { myTasks, recentActivity } from "@/shared/mocks/workspace";
import { StatusChip } from "@/shared/ui/status-chip";

export function MyScreen({ user, welcome }: { user: SessionUser; welcome?: string }) {
  return (
    <div className="stack">
      {welcome ? (
        <div className="auth-success">
          {welcome === "invite"
            ? "조직 초대를 수락했습니다. 바로 내 작업 허브로 진입합니다."
            : "회원가입이 완료됐습니다. 조직 운영을 시작할 수 있습니다."}
        </div>
      ) : null}

      <section className="dashboard-grid">
        <article className="page-panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Today</p>
              <h3>{user.name} 님이 지금 처리해야 할 일</h3>
            </div>
            <StatusChip tone="info">{user.organizationMemberships[0]?.role ?? "member"}</StatusChip>
          </div>
          <div className="stack">
            {myTasks.map((task) => (
              <div className="task-card" key={task.title}>
                <div className="section-heading">
                  <strong>{task.title}</strong>
                  <StatusChip tone={task.tone}>{task.tone}</StatusChip>
                </div>
                <p className="body-copy">{task.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="stack">
          <div className="panel-card">
            <p className="section-label">Account</p>
            <strong>{user.email}</strong>
            <p className="body-copy">
              조직 {user.organizationMemberships[0]?.organizationName}에 연결되어 있습니다.
            </p>
          </div>
          <div className="panel-card">
            <p className="section-label">Security</p>
            <ul className="plain-list">
              <li>마지막 로그인 2026-03-29 10:12</li>
              <li>2단계 인증 권장 상태</li>
              <li>비밀번호 회전 주기 90일</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="settings-grid">
        <article className="setting-card">
          <p className="section-label">Notifications</p>
          <ul className="settings-list plain-list">
            <li>실패 작업 즉시 알림, Slack + email</li>
            <li>승인 요청 요약 알림, 오전 09:00 / 오후 14:00</li>
            <li>채널 토큰 만료 24시간 전 경고</li>
          </ul>
        </article>
        <article className="setting-card">
          <p className="section-label">Recent activity</p>
          <ul className="settings-list plain-list">
            {recentActivity.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
