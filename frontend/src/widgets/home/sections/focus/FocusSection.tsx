import { values } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const focusContent = {
  label: "핵심",
  title: "우리가 전달하는 것",
};

export default function FocusSection() {
  return (
    <section id="focus" className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading label={focusContent.label} title={focusContent.title} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
