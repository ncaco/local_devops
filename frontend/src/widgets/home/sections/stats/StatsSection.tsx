import { Container, SectionHeading } from "@/src/shared/ui";

const statsContent = {
  label: "성과",
  title: "숫자로 보는 SNSAUTO",
  description: "프로젝트 성과와 고객 만족도를 한눈에 확인하세요.",
  items: [
    { value: "220+", label: "프로젝트" },
    { value: "10+", label: "경력" },
    { value: "98%", label: "만족도" },
    { value: "48시간", label: "평균 소요" },
  ],
};

export default function StatsSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={statsContent.label}
            title={statsContent.title}
            description={statsContent.description}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statsContent.items.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <p className="text-3xl font-semibold text-slate-900">
                  {item.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
