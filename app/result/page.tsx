import { ResultBridge } from "@/app/result/result-bridge";

type ResultPageProps = {
  searchParams: Promise<{
    data?: string;
  }>;
};

function formatPayload(data: string | undefined) {
  if (!data) {
    return "No result payload found.";
  }

  try {
    const parsed = JSON.parse(data) as Record<string, unknown>;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return data;
  }
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const result = formatPayload(params.data);

  return (
    <main>
      <ResultBridge payload={result} />
      <section className="hero">
        <span className="eyebrow">Callback Result</span>
        <h1 className="title">OAuth Result</h1>
        <p className="lede">
          콜백 처리 결과를 그대로 출력합니다. 실서비스에서는 여기서 토큰 저장,
          세션 연결, DB 업서트 같은 후속 작업을 이어가면 됩니다.
        </p>
      </section>

      <section className="grid">
        <article className="card stack">
          <h2>Payload</h2>
          <div className="result">{result}</div>
        </article>

        <article className="card stack">
          <h3>다음 단계</h3>
          <ul className="list">
            <li>장기 토큰 교환이 필요하면 서버에서 추가 교환 로직을 붙입니다.</li>
            <li>토큰은 반드시 서버 저장소나 암호화된 비밀 저장소에 보관합니다.</li>
            <li>권한 범위는 실제 기능에 필요한 최소값으로 줄이는 편이 좋습니다.</li>
          </ul>
          <a className="button secondary" href="/">
            Back Home
          </a>
        </article>
      </section>
    </main>
  );
}
