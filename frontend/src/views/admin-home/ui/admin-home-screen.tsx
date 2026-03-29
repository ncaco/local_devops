import { organizationAlerts } from "@/shared/mocks/workspace";
import { StatusChip } from "@/shared/ui/status-chip";

export function AdminHomeScreen() {
  return (
    <div className="stack">
      <section className="admin-grid">
        <article className="metric-card">
          <p className="section-label">Brands</p>
          <strong className="metric-value">12</strong>
          <p className="body-copy">활성 브랜드 9개, 점검 필요 3개</p>
        </article>
        <article className="metric-card">
          <p className="section-label">Members</p>
          <strong className="metric-value">38</strong>
          <p className="body-copy">승인자 7, 운영자 18, 조회자 13</p>
        </article>
        <article className="metric-card">
          <p className="section-label">Policy drift</p>
          <strong className="metric-value">2</strong>
          <p className="body-copy">두 개 브랜드가 최신 승인 정책과 다릅니다.</p>
        </article>
      </section>

      <section className="page-panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Admin alerts</p>
            <h3>운영 위험을 먼저 정리해야 합니다</h3>
          </div>
          <StatusChip tone="warning">needs action</StatusChip>
        </div>
        <ul className="plain-list">
          {organizationAlerts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
