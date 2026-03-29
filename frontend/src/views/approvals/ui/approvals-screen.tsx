import { ApprovalItem } from "@/shared/api/dashboard";
import { formatScheduledAt } from "@/shared/lib/time";
import { StatusChip } from "@/shared/ui/status-chip";

export function ApprovalsScreen({ approvals }: { approvals: ApprovalItem[] }) {
  return (
    <div className="stack">
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
  );
}
