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

          {failures.length === 0 ? (
            <section className="page-panel">
              <p className="section-label">Recovery queue</p>
              <h3>지금은 복구가 필요한 실패 작업이 없습니다.</h3>
              <p className="body-copy">
                채널 상태 이상이나 게시 실패가 생기면 이 화면에서 원인과 다음 조치를 함께 보여줍니다.
              </p>
            </section>
          ) : null}

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
              <div className="stack-sm">
                <p className="section-label">Next step</p>
                <p className="body-copy">
                  {item.next_action}. 세부 조치 로그는 작업 ID {item.publish_job_id} 기준으로 백엔드 복구 콘솔에서 확인합니다.
                </p>
                <div className="inline-badges">
                  <StatusChip tone={item.retryable ? "warning" : "danger"}>
                    {item.retryable ? "자동 재시도 후보" : "수동 복구 필요"}
                  </StatusChip>
                  <StatusChip tone="info">{item.publish_job_id}</StatusChip>
                </div>
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
