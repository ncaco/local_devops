import { Container, SectionHeading } from "@/src/shared/ui";

const historyContent = {
  label: "연혁",
  title: "빠르게 성장한 주요 순간",
  description: "제품 출시, 리브랜딩, 글로벌 확장 등의 기록을 정리합니다.",
  items: [
    "2023.01 · 구독형 디자인 서비스 런칭",
    "2024.06 · 100개 프로젝트 돌파",
    "2025.11 · 글로벌 고객 지원 시작",
  ],
};

export default function HistorySection() {
  return (
    <section id="history" className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={historyContent.label}
            title={historyContent.title}
            description={historyContent.description}
          />
          <div className="mt-8 grid gap-4 text-sm text-slate-500">
            {historyContent.items.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
