import { Container, SectionHeading } from "@/src/shared/ui";

const logosContent = {
  label: "파트너",
  title: "함께한 팀",
  description: "브랜드, 스타트업, 엔터프라이즈와 협업해 왔습니다.",
  items: [
    "Aurora",
    "Northwind",
    "Studio 38",
    "Luma",
    "Atlas",
    "Monolith",
  ],
};

export default function LogosSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={logosContent.label}
            title={logosContent.title}
            description={logosContent.description}
          />
          <div className="mt-10 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">
            {logosContent.items.map((name) => (
              <div
                key={name}
                className="flex h-20 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold tracking-[0.2em] text-slate-500"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
