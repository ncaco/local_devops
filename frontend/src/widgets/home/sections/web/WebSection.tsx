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
  loadMore: "더 보기",
};

const isAppCategory = (category: string) =>
  ["모바일", "앱"].some((keyword) => category.includes(keyword));

export default function WebSection() {
  const webItems = workItems.filter((item) => !isAppCategory(item.category));
  const resolvedWebItems = webItems.length > 0 ? webItems : workItems;

  return (
    <section id="web" className="bg-white">
      <Container>
        <div className="py-10">
          <SectionHeading
            label={workContent.heading.label}
            title="웹"
            description="웹 중심 프로젝트 모음."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {resolvedWebItems.map((item) => (
              <Link
                key={item.slug}
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
          <div className="mt-8">
            <button
              type="button"
              className="rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-900"
            >
              {workContent.loadMore}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
