import { faqs } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const faqsContent = {
  label: "자주 묻는 질문",
  title: "시작 전에 미리 답해드립니다.",
  description: "범위, 일정, 협업에 대한 핵심 안내.",
};

export default function FaqsSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={faqsContent.label}
            title={faqsContent.title}
            description={faqsContent.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
