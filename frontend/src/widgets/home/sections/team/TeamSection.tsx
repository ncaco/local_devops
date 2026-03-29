import { team } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const teamContent = {
  label: "팀",
  title: "공유된 맥락을 가진 시니어 전문가.",
  description: "핵심 리더 팀이 킥오프부터 런칭까지 함께합니다.",
};

export default function TeamSection() {
  return (
    <section id="team" className="bg-white">
      <Container>
        <div className="py-16">
          <SectionHeading
            label={teamContent.label}
            title={teamContent.title}
            description={teamContent.description}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="h-32 rounded-xl bg-slate-50" />
                <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
                <p className="text-xs text-slate-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
