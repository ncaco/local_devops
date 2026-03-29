import { faqs } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const faqsContent = {
  label: "FAQ",
  title: "자주 묻는 질문",
  description: "궁금한 내용을 빠르게 확인하세요.",
};

export default function FaqAccordionSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={faqsContent.label}
            title={faqsContent.title}
            description={faqsContent.description}
          />
          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm text-slate-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
