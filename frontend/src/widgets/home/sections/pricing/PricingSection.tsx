import Link from "next/link";
import { tiers } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const pricingContent = {
  heading: {
    label: "요금",
    title: "월간 패키지",
    description: "월 정액으로 빠른 턴어라운드의 무제한 디자인을 제공합니다.",
  },
  priceSuffix: "/월",
  ctaPrimary: "지금 시작하기",
  custom: {
    label: "맞춤 플랜이 필요하신가요?",
    title: "맞춤 리테이너로 설계합니다.",
    description: "제품, 브랜드, 마케팅 지원이 필요한 팀에 적합합니다.",
    cta: "미팅 예약",
  },
};

export default function PricingSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-10">
          <SectionHeading
            label={pricingContent.heading.label}
            title={pricingContent.heading.title}
            description={pricingContent.heading.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                id="fixed"
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {tier.name}
                </p>
                <p className="mt-4 text-4xl font-semibold">
                  {tier.price}
                  {pricingContent.priceSuffix}
                </p>
                <p className="mt-2 text-sm text-slate-500">{tier.detail}</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  {tier.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
                >
                  {pricingContent.ctaPrimary}
                </Link>
              </div>
            ))}
            <div
              id="custom"
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {pricingContent.custom.label}
              </p>
              <h3 className="mt-4 text-2xl font-semibold">
                {pricingContent.custom.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {pricingContent.custom.description}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900"
              >
                {pricingContent.custom.cta}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
