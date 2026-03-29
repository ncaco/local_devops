type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

type StatusChipProps = {
  children: React.ReactNode;
  tone?: StatusTone;
};

export function StatusChip({ children, tone = "neutral" }: StatusChipProps) {
  return <span className={`status-pill status-pill-${tone}`}>{children}</span>;
}
