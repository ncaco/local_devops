import {
  ApprovalItem,
  buildOverviewMetrics,
  buildTimeline,
  DashboardOverview,
  FailureItem,
} from "@/shared/api/dashboard";
import { queue } from "@/shared/mocks/workspace";
import { StatusChip } from "@/shared/ui/status-chip";

type OverviewScreenProps = {
  overview: DashboardOverview;
  approvals: ApprovalItem[];
  failures: FailureItem[];
};

export function OverviewScreen({ overview, approvals, failures }: OverviewScreenProps) {
  const overviewMetrics = buildOverviewMetrics(overview);
  const timeline = buildTimeline(approvals, failures);

  return (
    <div className="page-grid has-side-panel">
      <section className="page-content">
        <div className="stack">
          <section className="dashboard-hero">
            <div>
              <p className="hero-eyebrow">Live control room</p>
              <h3>오늘의 게시 흐름과 막힌 지점을 바로 읽는 운영 화면</h3>
            </div>
            <p className="body-copy">
              상태, 원인, 다음 조치가 같은 문맥 안에 보여야 운영자가 덜 헤맵니다.
            </p>
          </section>

          <section className="metric-grid dashboard-metric-grid">
            {overviewMetrics.map((metric) => (
              <article className="metric-card dashboard-metric-card" key={metric.label}>
                <div className="section-heading">
                  <p className="section-label">{metric.label}</p>
                  <StatusChip tone={metric.tone}>{metric.tone}</StatusChip>
                </div>
                <strong className="metric-value">{metric.value}</strong>
                <p className="body-copy">{metric.detail}</p>
              </article>
            ))}
          </section>

          <section className="dashboard-table">
            <div className="section-heading">
              <div>
                <p className="section-label">Recent events</p>
                <h3>운영 타임라인</h3>
              </div>
            </div>

            <div className="timeline">
              {timeline.map((entry) => (
                <div className="timeline-row dashboard-timeline-row" key={`${entry.time}-${entry.title}`}>
                  <span className="mono-time">{entry.time}</span>
                  <div className={`timeline-marker timeline-${entry.tone}`} />
                  <div className="timeline-body">
                    <strong>{entry.title}</strong>
                    <p>{entry.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <aside className="side-panel">
        <div className="stack">
          <div className="panel-card dashboard-side-card">
            <p className="section-label">Shift note</p>
            <p className="body-copy">
              점심 직전 게시량이 몰립니다. Brand C 토큰 만료를 먼저 복구하지 않으면 오후
              예약이 연쇄 지연됩니다.
            </p>
          </div>
          <div className="panel-card dashboard-side-card">
            <p className="section-label">Queue snapshot</p>
            <div className="stack-sm">
              {queue.map((item) => (
                <div className="queue-row dashboard-queue-row" key={`${item.title}-${item.window}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.window}</p>
                  </div>
                  <StatusChip
                    tone={
                      item.state === "BLOCKED"
                        ? "danger"
                        : item.state === "WAITING_APPROVAL"
                          ? "warning"
                          : "info"
                    }
                  >
                    {item.state}
                  </StatusChip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
