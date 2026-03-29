import Link from "next/link";
import { Container } from "@/src/shared/ui";

const closingContent = {
  label: "함께 시작해요",
  title: "다음 런칭을 준비하시나요?",
  description: "일정, 목표, 산출물을 알려주세요. 48시간 내에 답변드립니다.",
  cta: "미팅 예약",
};

export default function ClosingSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              {closingContent.label}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {closingContent.title}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {closingContent.description}
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          >
            {closingContent.cta}
          </Link>
        </div>
      </Container>
    </section>
  );
}
