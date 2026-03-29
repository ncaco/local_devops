import { testimonials } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const testimonialsContent = {
  label: "고객 피드백",
  title: "SNSAUTO에 대한 사용자 이야기.",
  description: "일관된 산출, 예측 가능한 일정, 명확한 성과.",
};

export default function TestimonialsSection() {
  return (
    <section id="faq-section" className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={testimonialsContent.label}
            title={testimonialsContent.title}
            description={testimonialsContent.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-lg text-slate-900">“{item.quote}”</p>
                <p className="mt-4 text-sm text-slate-500">
                  {item.name} · {item.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
