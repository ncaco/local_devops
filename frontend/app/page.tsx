import { AppShell } from "@/components/app-shell";
import { getApprovals, getDashboardOverview, getFailures } from "@/components/api";
import { buildTimelineFromApi, createOverviewMetrics, queue } from "@/components/mock-data";
import { StatusChip } from "@/components/status-chip";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [overview, approvals, failures] = await Promise.all([
    getDashboardOverview(),
    getApprovals(),
    getFailures(),
  ]);

  const overviewMetrics = createOverviewMetrics(overview);
  const timeline = buildTimelineFromApi(approvals, failures);

  return (
    <AppShell
      eyebrow="Operations Overview"
      title="SNS Deployment Console"
      sidePanel={
        <div className="stack">
          <div className="panel-card">
            <p className="section-label">Shift note</p>
            <p className="body-copy">
              오늘은 점심 시간 직전 게시량이 몰립니다. Brand C 토큰 만료부터
              복구하지 않으면 오후 예약이 연쇄 지연됩니다.
            </p>
          </div>
          <div className="panel-card">
            <p className="section-label">Queue snapshot</p>
            <div className="stack-sm">
              {queue.map((item) => (
                <div className="queue-row" key={`${item.title}-${item.window}`}>
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
      }
    >
      <div className="stack">
        <section className="hero-card">
          <div>
            <p className="hero-eyebrow">Live control room</p>
            <h2>승인, 예약, 실패 복구가 한 흐름으로 보여야 운영이 빨라집니다.</h2>
          </div>
          <p>
            이 목업은 예쁜 마케팅 대시보드가 아니라, 게시 실패를 줄이고 승인
            병목을 없애는 운영 콘솔 기준으로 구성했습니다.
          </p>
        </section>

        <section className="metric-grid">
          {overviewMetrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <div className="section-heading">
                <p className="section-label">{metric.label}</p>
                <StatusChip tone={metric.tone}>{metric.tone}</StatusChip>
              </div>
              <strong className="metric-value">{metric.value}</strong>
              <p className="body-copy">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="panel-card">
          <div className="section-heading">
            <div>
              <p className="section-label">Operational timeline</p>
              <h3>최근 이벤트</h3>
            </div>
            <button className="ghost-button" type="button">
              Open audit trail
            </button>
          </div>

          <div className="timeline">
            {timeline.map((entry) => (
              <div className="timeline-row" key={`${entry.time}-${entry.title}`}>
                <span className="mono-time">{entry.time}</span>
                <div className={`timeline-marker timeline-${entry.tone}`} />
                <div className="timeline-body">
                  <strong>{entry.title}</strong>
                  <p>{entry.detail}</p>
                </div>
              </div>
            ))}
            {timeline.length === 0 ? (
              <p className="body-copy">백엔드 응답이 없어 타임라인을 비워둔 상태입니다.</p>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
