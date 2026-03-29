import Link from "next/link";
import { Container } from "@/src/shared/ui";

const ctaContent = {
  label: "다음 단계",
  title: "지금 시작하면 48시간 내 첫 결과물을 전달합니다.",
  description:
    "프로젝트 목표와 일정만 공유해 주세요. 빠른 킥오프와 예측 가능한 전달로 지원합니다.",
  primary: "미팅 예약",
  secondary: "요금 보기",
};

export default function CtaSection() {
  return (
    <section className="bg-slate-900">
      <Container>
        <div className="flex flex-col gap-6 py-16 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              {ctaContent.label}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">{ctaContent.title}</h2>
            <p className="mt-3 max-w-xl text-sm text-slate-200">
              {ctaContent.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              {ctaContent.primary}
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
            >
              {ctaContent.secondary}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
