import { processSteps } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const processContent = {
  label: "프로세스",
  title: "빠르게 움직이는 간단한 단계.",
  description: "일관된 전달을 위해 모든 과정을 표준화했습니다.",
};

export default function ProcessSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={processContent.label}
            title={processContent.title}
            description={processContent.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="text-xs font-semibold text-primary">
                  0{index + 1}.
                </span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
