import { getWorkItemBySlug } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const workDetailContent = {
  headingLabel: "케이스 스터디",
  meta: {
    categoryLabel: "카테고리",
    deliverablesLabel: "산출물",
    deliverables: "디자인, UX, 비주얼",
  },
  summary:
    "클라이언트 팀과 긴밀히 협업하며 목표를 정렬하고 메시지를 다듬어, 향후 릴리스까지 대비한 유연한 디자인 시스템을 구축했습니다.",
  footnote: "레이아웃 확인을 위한 임시 미디어와 콘텐츠입니다.",
};

export default function DetailSection({ slug }: { slug: string }) {
  const item = getWorkItemBySlug(slug);

  return (
    <section className="bg-white">
      <Container>
        <div className="py-10">
          <SectionHeading
            label={workDetailContent.headingLabel}
            title={item.title}
            description={item.summary}
          />
          <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="h-64 rounded-2xl bg-slate-50" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {workDetailContent.meta.categoryLabel}
                  </p>
                  <p className="mt-2 text-sm">{item.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {workDetailContent.meta.deliverablesLabel}
                  </p>
                  <p className="mt-2 text-sm">
                    {workDetailContent.meta.deliverables}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">
                {workDetailContent.summary}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>• {highlight}</li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                {workDetailContent.footnote}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
