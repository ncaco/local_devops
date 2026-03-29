import Link from "next/link";
import { Container, SectionHeading } from "@/src/shared/ui";

const aboutContent = {
  hero: {
    label: "소개",
    title: "전략, 마케팅, 디자인, 디지털 전문성이 결합된 특별한 조합.",
    description:
      "구독형 전달 모델로 아이디어를 높은 임팩트의 제품과 브랜드로 전환합니다.",
    cta: "프로젝트 시작하기 →",
  },
  summary:
    "우리 팀은 전략, 마케팅, 디자인을 결합해 연결되고 성과를 내며 확장 가능한 디지털 경험을 만듭니다. 빠르게 움직이고, 긴밀히 협업하며, 측정 가능한 결과에 집중합니다.",
  stats: {
    projects: "220+",
    years: "10+",
    satisfaction: "98%",
    turnaround: "48시간",
    projectsLabel: "프로젝트",
    yearsLabel: "경력",
    satisfactionLabel: "만족도",
    turnaroundLabel: "평균 소요",
  },
};

export default function CompanySection() {
  return (
    <section id="company" className="bg-white">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <SectionHeading
              label={aboutContent.hero.label}
              title={aboutContent.hero.title}
              description={aboutContent.hero.description}
            />
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              {aboutContent.hero.cta}
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">{aboutContent.summary}</p>
          </div>
        </div>
        <div className="mt-6 pb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-semibold">
              {aboutContent.stats.projects}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {aboutContent.stats.projectsLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-semibold">{aboutContent.stats.years}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {aboutContent.stats.yearsLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-semibold">
              {aboutContent.stats.satisfaction}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {aboutContent.stats.satisfactionLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-semibold">
              {aboutContent.stats.turnaround}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {aboutContent.stats.turnaroundLabel}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
