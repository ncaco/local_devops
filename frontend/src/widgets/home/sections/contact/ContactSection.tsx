import { ContactForm } from "@/src/features";
import { Container, SectionHeading } from "@/src/shared/ui";

const contactContent = {
  heading: {
    label: "문의하기",
    title: "다음 런칭에 대해 알려주세요.",
    description: "일정, 범위, 목표를 공유해 주세요. 48시간 내에 답변드립니다.",
  },
};

const contactFormContent = {
  labels: {
    name: "이름",
    email: "이메일",
    details: "프로젝트 상세",
  },
  placeholders: {
    name: "이름을 입력하세요",
    email: "예: hello@company.com",
    details: "일정, 범위, 산출물",
  },
  submitLabel: "문의 보내기",
  helperText: "이 폼은 데모용입니다. 준비되면 백엔드와 연동하세요.",
};

export default function ContactSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="grid gap-10 py-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              label={contactContent.heading.label}
              title={contactContent.heading.title}
              description={contactContent.heading.description}
            />
            <div className="mt-8 space-y-4 text-sm text-slate-500">
              <p>hello@snsauto.app</p>
              <p>ops@snsauto.app</p>
              <p>2464 Royal Ln. Mesa, New Jersey 45463</p>
              <p>342-000-0000</p>
            </div>
          </div>
          <ContactForm content={contactFormContent} />
        </div>
      </Container>
    </section>
  );
}
