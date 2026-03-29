import { Container, SectionHeading } from "@/src/shared/ui";

const timelineContent = {
  label: "로드맵",
  title: "진행 흐름",
  description: "브리프부터 런칭까지 명확한 단계로 관리합니다.",
  items: [
    { title: "Kickoff", detail: "목표, 범위, 일정 정의" },
    { title: "Design Sprint", detail: "핵심 화면과 흐름 설계" },
    { title: "Iteration", detail: "피드백 반영 및 개선" },
    { title: "Launch", detail: "런칭 패키지 전달" },
  ],
};

export default function TimelineSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={timelineContent.label}
            title={timelineContent.title}
            description={timelineContent.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {timelineContent.items.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="text-xs font-semibold text-primary">
                  0{index + 1}.
                </span>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
