import Link from "next/link";
import { workItems } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const workContent = {
  heading: {
    label: "작업",
    title: "앱, 브랜드, 이커머스 전반의 최근 작업.",
    description: "우리가 전달하는 범위를 보여주는 선택된 프로젝트.",
  },
  cta: "케이스 스터디 보기 →",
};

const isAppCategory = (category: string) =>
  ["모바일", "앱"].some((keyword) => category.includes(keyword));

export default function AppSection() {
  const appItems = workItems.filter((item) => isAppCategory(item.category));
  const resolvedAppItems = appItems.length > 0 ? appItems : workItems;

  return (
    <section id="app" className="bg-white">
      <Container>
        <div className="py-10">
          <SectionHeading
            label={workContent.heading.label}
            title="앱"
            description="앱 중심 프로젝트 모음."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {resolvedAppItems.map((item) => (
              <Link
                key={`${item.slug}-app`}
                href={`/work/${item.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-slate-400"
              >
                <div className="h-48 rounded-2xl bg-slate-50" />
                <div className="mt-5 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <span className="text-xs text-slate-400">
                    {item.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-primary">
                  {workContent.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
