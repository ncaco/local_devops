import { ApprovalItem } from "@/shared/api/dashboard";
import { formatScheduledAt } from "@/shared/lib/time";
import { StatusChip } from "@/shared/ui/status-chip";

export function ApprovalsScreen({ approvals }: { approvals: ApprovalItem[] }) {
  return (
    <div className="stack">
      {approvals.length === 0 ? (
        <section className="page-panel">
          <p className="section-label">Approval queue</p>
          <h3>지금 처리할 승인 요청이 없습니다.</h3>
          <p className="body-copy">
            새 요청이 들어오면 이 화면에서 우선순위와 예약 시각을 함께 확인할 수 있습니다.
          </p>
        </section>
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
            <span>예약 시각 {formatScheduledAt(item.scheduled_at)}</span>
            <span>요청자 {item.requested_by}</span>
          </div>
          <div className="stack-sm">
            <p className="section-label">Review status</p>
            <p className="body-copy">
              승인 처리 API가 연결되기 전까지 이 화면은 읽기 전용입니다. 요청 ID{" "}
              {item.approval_request_id} 기준으로 검토 대상과 예약 시각을 먼저 확인하세요.
            </p>
            <div className="inline-badges">
              <StatusChip tone="warning">읽기 전용</StatusChip>
              <StatusChip tone="info">{item.approval_request_id}</StatusChip>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
