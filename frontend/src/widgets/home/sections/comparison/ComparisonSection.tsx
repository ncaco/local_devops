import { Container, SectionHeading } from "@/src/shared/ui";

const comparisonContent = {
  label: "비교",
  title: "구독 vs. 고정 예산",
  description: "필요한 속도와 유연성에 따라 선택할 수 있습니다.",
  columns: ["항목", "구독", "고정 예산"],
  rows: [
    ["요청 수", "무제한", "범위 고정"],
    ["반복 개선", "포함", "추가 비용"],
    ["속도", "48시간 내 피드백", "프로젝트별 상이"],
    ["유연성", "높음", "낮음"],
  ],
};

export default function ComparisonSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={comparisonContent.label}
            title={comparisonContent.title}
            description={comparisonContent.description}
          />
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200">
            <div className="grid grid-cols-3 bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {comparisonContent.columns.map((column) => (
                <div key={column} className="border-r border-slate-200 px-4 py-3">
                  {column}
                </div>
              ))}
            </div>
            {comparisonContent.rows.map((row) => (
              <div key={row[0]} className="grid grid-cols-3 text-sm text-slate-600">
                {row.map((cell, index) => (
                  <div
                    key={`${row[0]}-${index}`}
                    className="border-t border-r border-slate-200 px-4 py-4"
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
