import { AppShell } from "@/components/app-shell";
import { getFailures } from "@/components/api";
import { StatusChip } from "@/components/status-chip";

export const dynamic = "force-dynamic";

export default async function FailuresPage() {
  const failures = await getFailures();

  return (
    <AppShell
      eyebrow="Recovery Console"
      title="Failure Console"
      sidePanel={
        <div className="panel-card">
          <p className="section-label">Playbook</p>
          <ol className="plain-list ordered">
            <li>원인 확인</li>
            <li>재시도 가능 여부 판단</li>
            <li>토큰 또는 에셋 복구</li>
            <li>다시 큐에 넣기</li>
          </ol>
        </div>
      }
    >
      <div className="stack">
        <section className="hero-card accent-rust">
          <div>
            <p className="hero-eyebrow">Failures are actionable</p>
            <h2>실패는 숨기지 않고, 다음 행동으로 바꿉니다.</h2>
          </div>
          <p>빨간 알람이 아니라 운영자의 복구 작업대처럼 보여야 합니다.</p>
        </section>

        {failures.length === 0 ? (
          <article className="failure-card">
            <div className="section-heading">
              <h3>실패 작업이 없습니다.</h3>
              <StatusChip tone="success">healthy</StatusChip>
            </div>
            <p className="body-copy">백엔드 기준으로 현재 실패 건이 없거나 연결되지 않았습니다.</p>
          </article>
        ) : null}

        {failures.map((item) => (
          <article className="failure-card" key={item.title}>
            <div className="section-heading">
              <h3>{item.title}</h3>
              <StatusChip tone={item.retryable ? "warning" : "danger"}>
                {item.error_code}
              </StatusChip>
            </div>
            <p className="body-copy">{item.message}</p>
            <div className="meta-row">
              <span>{item.channel}</span>
              <span>{item.publish_job_id}</span>
            </div>
            <div className="button-row">
              <button className="primary-button" type="button">
                {item.next_action}
              </button>
              <button className="ghost-button" type="button">
                View log
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
