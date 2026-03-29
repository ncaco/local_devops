import { Container, SectionHeading } from "@/src/shared/ui";

const featureContent = {
  label: "기능",
  title: "빠르게 결과를 만드는 구성 요소",
  description: "산출물을 빠르게 내기 위한 시스템과 도구를 제공합니다.",
  items: [
    {
      title: "브리프 정리",
      description: "요구사항을 한 장으로 정리해 협업을 단순화합니다.",
    },
    {
      title: "디자인 시스템",
      description: "반복을 줄이고 일관성을 유지하는 컴포넌트 세트.",
    },
    {
      title: "실시간 피드백",
      description: "48시간 내 빠른 검토 주기를 유지합니다.",
    },
    {
      title: "전환 최적화",
      description: "핵심 지표에 집중한 레이아웃 설계.",
    },
    {
      title: "브랜드 톤",
      description: "메시지와 비주얼을 일관된 톤으로 통합합니다.",
    },
    {
      title: "런칭 패키지",
      description: "런칭에 필요한 에셋을 묶어 전달합니다.",
    },
  ],
};

export default function FeatureGridSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={featureContent.label}
            title={featureContent.title}
            description={featureContent.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureContent.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
