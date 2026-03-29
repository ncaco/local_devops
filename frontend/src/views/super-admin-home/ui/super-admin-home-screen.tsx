import { systemSignals, tenantHealth } from "@/shared/mocks/workspace";
import { StatusChip } from "@/shared/ui/status-chip";

export function SuperAdminHomeScreen() {
  return (
    <div className="stack">
      <section className="admin-grid">
        <article className="metric-card">
          <p className="section-label">Tenants</p>
          <strong className="metric-value">28</strong>
          <p className="body-copy">Enterprise 6, Growth 12, Starter 10</p>
        </article>
        <article className="metric-card">
          <p className="section-label">Incidents</p>
          <strong className="metric-value">1</strong>
          <p className="body-copy">활성 장애 1건, 조사 중 2건</p>
        </article>
        <article className="metric-card">
          <p className="section-label">Scheduler lag</p>
          <strong className="metric-value">14s</strong>
          <p className="body-copy">경고선은 30초, 현재는 안전 범위입니다.</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="page-panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Tenant health</p>
              <h3>조직 포트폴리오</h3>
            </div>
          </div>
          <div className="stack">
            {tenantHealth.map((tenant) => (
              <div className="tenant-card" key={tenant.name}>
                <div className="section-heading">
                  <strong>{tenant.name}</strong>
                  <StatusChip
                    tone={
                      tenant.status === "healthy"
                        ? "success"
                        : tenant.status === "warning"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {tenant.status}
                  </StatusChip>
                </div>
                <p className="body-copy">
                  {tenant.plan} 플랜, 월 {tenant.posts}
                </p>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel-card">
          <p className="section-label">System signals</p>
          <ul className="plain-list">
            {systemSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
