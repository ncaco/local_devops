import { testimonials } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const carouselContent = {
  label: "리뷰",
  title: "스크롤로 보는 후기",
  description: "가장 빠르고 확실한 증거는 고객의 목소리입니다.",
};

export default function TestimonialCarouselSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={carouselContent.label}
            title={carouselContent.title}
            description={carouselContent.description}
          />
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="min-w-[260px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:min-w-[320px]"
              >
                <p className="text-base text-slate-900">“{item.quote}”</p>
                <p className="mt-4 text-xs text-slate-500">
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
