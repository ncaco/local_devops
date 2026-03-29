import { FailureItem } from "@/shared/api/dashboard";
import { StatusChip } from "@/shared/ui/status-chip";

export function FailuresScreen({ failures }: { failures: FailureItem[] }) {
  return (
    <div className="page-grid has-side-panel">
      <section className="page-content">
        <div className="stack">
          <section className="page-panel">
            <div>
              <p className="hero-eyebrow">Failures are actionable</p>
              <h3>실패는 숨기지 않고, 다음 행동으로 바꿉니다.</h3>
            </div>
            <p className="body-copy">빨간 알람이 아니라 운영자의 복구 작업대처럼 보여야 합니다.</p>
          </section>

          {failures.map((item) => (
            <article className="failure-card" key={item.publish_job_id}>
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
      </section>

      <aside className="side-panel">
        <div className="panel-card">
          <p className="section-label">Playbook</p>
          <ol className="plain-list ordered">
            <li>원인 확인</li>
            <li>재시도 가능 여부 판단</li>
            <li>토큰 또는 에셋 복구</li>
            <li>다시 큐에 넣기</li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
