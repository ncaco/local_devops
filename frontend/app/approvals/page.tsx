import { AppShell } from "@/components/app-shell";
import { getApprovals } from "@/components/api";
import { StatusChip } from "@/components/status-chip";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const approvals = await getApprovals();

  return (
    <AppShell eyebrow="Approval Queue" title="Approval Inbox">
      <div className="stack">
        {approvals.length === 0 ? (
          <article className="approval-card">
            <div className="section-heading">
              <div>
                <p className="section-label">No data</p>
                <h3>승인 대기 데이터가 없습니다.</h3>
              </div>
              <StatusChip tone="neutral">offline</StatusChip>
            </div>
            <p className="body-copy">백엔드 연결 전에는 이 화면이 빈 상태로 보입니다.</p>
          </article>
        ) : null}
        {approvals.map((item) => (
          <article className="approval-card" key={`${item.approval_request_id}-${item.title}`}>
            <div className="section-heading">
              <div>
                <p className="section-label">{item.brand_name}</p>
                <h3>{item.title}</h3>
              </div>
              <StatusChip tone={item.risk_level === "warning" ? "warning" : "info"}>
                {item.risk_level}
              </StatusChip>
            </div>
            <p className="body-copy">{item.channels.join(", ")} 채널로 배포될 승인 요청입니다.</p>
            <div className="meta-row">
              <span>예약 시각 {item.scheduled_at}</span>
              <span>요청자 {item.requested_by}</span>
            </div>
            <div className="button-row">
              <button className="primary-button" type="button">
                Approve
              </button>
              <button className="danger-button" type="button">
                Reject
              </button>
              <button className="ghost-button" type="button">
                {item.approval_request_id}
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
