type IntegrationCompletePageProps = {
  searchParams: Promise<{
    status?: string;
    value?: string;
  }>;
};

export default async function IntegrationCompletePage({
  searchParams
}: IntegrationCompletePageProps) {
  const params = await searchParams;
  const status = params.status ?? "unknown";
  const value = params.value ?? "No detail";

  return (
    <main className="page-shell">
      <section className="panel stack">
        <span className="pill">Instagram callback</span>
        <h1 className="title-sm">채널 연결 결과</h1>
        <p className={status === "success" ? "success-copy" : "error-copy"}>{status}</p>
        <div className="result-panel">{value}</div>
        <a className="button" href="/">
          대시보드로 돌아가기
        </a>
      </section>
    </main>
  );
}
