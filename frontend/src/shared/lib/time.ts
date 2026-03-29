const KOREA_TIME_ZONE = "Asia/Seoul";

export function formatScheduledAt(
  scheduledAt: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return scheduledAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KOREA_TIME_ZONE,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
  }).format(date);
}
