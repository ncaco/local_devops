import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Check,
  ChevronRight,
  Clock3,
  FolderKanban,
  Layers3,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Container } from "@/src/shared/ui";

type HomeLandingProps = {
  isAuthenticated: boolean;
  userName?: string | null;
};

const heroStats = [
  { value: "24/7", label: "자동 감시·실행 파이프라인" },
  { value: "1곳", label: "배포, 권한, 운영 상태 단일 콘솔" },
  { value: "0→1", label: "초기 운영 체계를 빠르게 표준화" },
];

const painPoints = [
  {
    title: "수작업 배포와 운영 체크가 반복됩니다",
    description: "담당자마다 배포 방식이 달라지고, 누가 무엇을 했는지 추적이 어렵습니다.",
  },
  {
    title: "권한과 계정 흐름이 제품 운영을 늦춥니다",
    description: "가입, 로그인, 사용자 관리, 관리자 승인까지 흐름이 끊겨 운영 비용이 계속 증가합니다.",
  },
  {
    title: "현황 파악이 늦어 장애 대응이 뒤로 밀립니다",
    description: "운영 데이터가 흩어져 있어 이슈 발생 시 확인과 공유가 모두 늦어집니다.",
  },
];

const features = [
  {
    icon: Bot,
    title: "자동화 중심 운영",
    description: "반복적인 배포와 운영 작업을 규칙 기반 흐름으로 정리해 팀 편차를 줄입니다.",
  },
  {
    icon: ShieldCheck,
    title: "권한·회원 관리 일원화",
    description: "회원, 관리자, 설정 흐름을 하나의 콘솔 경험 안에서 일관되게 유지합니다.",
  },
  {
    icon: Radar,
    title: "상태 가시성 강화",
    description: "핵심 상태와 진행 상황을 요약 카드와 단계형 구조로 빠르게 읽을 수 있게 만듭니다.",
  },
  {
    icon: Layers3,
    title: "FSD 기반 확장성",
    description: "현재 구조를 해치지 않고 홈, 인증, 대시보드 표면을 분리된 책임으로 확장합니다.",
  },
];

const workflowSteps = [
  { step: "01", title: "회원 진입", description: "가입과 로그인 진입을 단순화해 첫 전환 손실을 줄입니다." },
  { step: "02", title: "운영 환경 연결", description: "프로젝트와 운영 대상을 표준화된 흐름으로 연결합니다." },
  { step: "03", title: "자동화 실행", description: "반복 작업을 규칙화해 대시보드에서 즉시 실행하거나 추적합니다." },
  { step: "04", title: "관리자 통제", description: "사용자 관리와 운영 정책을 관리 표면에서 일관되게 검토합니다." },
];

const proofItems = [
  "회원 기능 중심 베이스를 실제 운영형 랜딩으로 재구성",
  "로그인 상태에 따라 CTA가 즉시 전환",
  "헤더·푸터·모바일 내비를 홈 정보구조와 정렬",
];

const faqItems = [
  {
    question: "현재 단계에서 바로 사용할 수 있는 기능은 무엇인가요?",
    answer:
      "회원가입, 로그인, 내 정보, 대시보드, 관리자 사용자 관리가 이미 연결돼 있어 운영 콘솔의 핵심 흐름을 바로 확장할 수 있습니다.",
  },
  {
    question: "이 랜딩은 단순 소개 페이지인가요?",
    answer:
      "아닙니다. 로그인 상태, 대시보드 진입, CTA 흐름을 실제 서비스 사용 경로와 연결해 전환형 제품 랜딩으로 동작합니다.",
  },
  {
    question: "디자인 시스템은 어디에 남나요?",
    answer:
      "프로젝트 루트의 design-system 자산과 문서에 남기며, 이후 다른 화면 구현 시 동일한 색상·타이포·상태 규칙을 재사용할 수 있습니다.",
  },
];

export default function HomeLanding({ isAuthenticated, userName }: HomeLandingProps) {
  const primaryHref = isAuthenticated ? "/dashboard" : "/login";
  const primaryLabel = isAuthenticated ? "대시보드 열기" : "지금 로그인";
  const secondaryHref = isAuthenticated ? "#features" : "/signup";
  const secondaryLabel = isAuthenticated ? "핵심 기능 보기" : "회원가입";
  const displayName = userName?.trim() || "팀";

  return (
    <main className="home-page relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <section className="home-hero-grid relative isolate overflow-hidden border-b border-[var(--line)]">
        <div className="home-hero-aurora absolute inset-0 opacity-90" aria-hidden />
        <Container>
          <div className="grid min-h-[calc(100vh-72px)] items-center gap-12 py-14 md:py-18 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                UI/UX Pro Max 기반 리빌드
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950 md:text-6xl lg:text-8xl">
                SNS 운영과 배포를
                <span className="mt-3 block font-mono text-[var(--accent-strong)]">하나의 콘솔 흐름으로</span>
                <span className="mt-3 block">정리하는 랜딩과 제품 진입면</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
                SNSAUTO는 회원 기능 중심 베이스를 출발점으로, 운영 자동화와 관리자 통제를 한 화면 언어로 연결하는
                제품형 랜딩입니다. 소개 페이지가 아니라 실제 사용 흐름으로 바로 이어지는 진입면을 만듭니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[var(--cta)] px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-strong)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--cta-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta)]"
                >
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={secondaryHref}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {secondaryLabel}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {heroStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.75rem] border border-white/70 bg-white/72 p-4 shadow-[var(--shadow-soft)] backdrop-blur"
                  >
                    <p className="font-mono text-2xl font-semibold text-[var(--accent-strong)]">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[2rem] border border-[var(--line-strong)] bg-slate-950 p-4 text-white shadow-[var(--shadow-hero)]">
                <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(225,29,72,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.42),transparent_35%),linear-gradient(180deg,#1b1020_0%,#09090b_100%)] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.24em] text-rose-200/80">LIVE ENTRY SURFACE</p>
                      <p className="mt-2 text-2xl font-semibold">{displayName}의 운영 시작점</p>
                    </div>
                    <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                      Conversion-focused
                    </div>
                  </div>
                  <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                    <div className="aspect-[4/3] bg-[linear-gradient(145deg,rgba(225,29,72,0.28),rgba(15,23,42,0.95)),url('/images/site-logo.png')] bg-cover bg-center">
                      <div className="flex h-full flex-col justify-between bg-black/45 p-5">
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                            <Play className="h-3.5 w-3.5" />
                            Deployment Flow
                          </span>
                          <span>Preview Surface</span>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-white/65">현재 초점</p>
                              <p className="mt-1 text-xl font-semibold">운영 자동화 + 사용자 통제</p>
                            </div>
                            <BadgeCheck className="h-10 w-10 text-emerald-300" />
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                              <p className="text-xs text-white/60">핵심 진입</p>
                              <p className="mt-1 font-mono text-lg">Auth → Dashboard</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                              <p className="text-xs text-white/60">관리 표면</p>
                              <p className="mt-1 font-mono text-lg">Admin Controls</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <SignalCard icon={Workflow} label="Flow" value="4단계" />
                    <SignalCard icon={FolderKanban} label="Surface" value="회원+관리자" />
                    <SignalCard icon={Clock3} label="Response" value="실시간 진입" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="overview" className="border-b border-[var(--line)] bg-white/65 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Problem to Product</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
                운영 팀이 겪는 병목을
                <span className="mt-2 block text-[var(--accent-strong)]">바로 제품 메시지로 연결합니다</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
                홈은 단순 소개 영역이 아니라 사용자가 왜 이 콘솔이 필요한지, 어디서 시작해야 하는지, 다음 행동이
                무엇인지 즉시 이해하게 만드는 전환면이어야 합니다.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {painPoints.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-[var(--accent-strong)]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="features" className="py-20">
        <Container>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Core Features</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
                현재 베이스가 가진 기능을
                <span className="mt-2 block text-[var(--accent-strong)]">운영형 제품 언어로 재배치</span>
              </h2>
            </div>
            <div className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-slate-600">
              FSD 구조를 유지하면서 랜딩 계층만 신규 구성
            </div>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group rounded-[2rem] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1.5 hover:border-[var(--accent)]"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-[var(--accent-strong)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 transition duration-200 group-hover:text-[var(--cta)]" />
                  </div>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="workflow" className="border-y border-[var(--line)] bg-[var(--surface)] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">How It Works</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
                랜딩에서 제품까지
                <span className="mt-2 block">행동이 끊기지 않도록 설계합니다</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
                첫 방문자에게는 신뢰와 방향을, 로그인 사용자에게는 즉시 대시보드 진입을 제공하는 흐름입니다.
              </p>
            </div>
            <div className="grid gap-4">
              {workflowSteps.map((item) => (
                <article
                  key={item.step}
                  className="grid gap-4 rounded-[1.75rem] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)] md:grid-cols-[88px_1fr]"
                >
                  <div className="font-mono text-3xl font-semibold text-[var(--accent-strong)]">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="trust" className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-[var(--line)] bg-slate-950 p-8 text-white shadow-[var(--shadow-hero)]">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-rose-200/80">Trust Layer</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
                제품 신뢰는 화려한 문구보다
                <span className="mt-2 block text-rose-300">구조와 일관성으로 만듭니다</span>
              </h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {proofItems.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                    <Check className="h-5 w-5 text-emerald-300" />
                    <p className="mt-4 text-sm leading-7 text-white/82">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div id="pricing" className="grid gap-4">
              <article className="rounded-[2rem] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-soft)]">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Launch Surface</p>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950">지금 필요한 것은 복잡한 설명보다 명확한 진입</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  홈에서는 기능, 구조, 신뢰를 보여주고 사용자는 바로 가입하거나 대시보드로 이동합니다.
                </p>
                <div className="mt-6 rounded-[1.5rem] bg-[var(--surface)] p-5">
                  <p className="text-sm font-medium text-slate-500">권장 CTA</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">
                    {isAuthenticated ? "운영 현황 확인하기" : "지금 계정을 만들고 운영 흐름 시작하기"}
                  </p>
                </div>
              </article>
              <article className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-7 shadow-[var(--shadow-soft)]">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent-strong)]">Rebuild Scope</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                  <li>홈 랜딩 신규 조립</li>
                  <li>헤더·푸터·모바일 내비 재정렬</li>
                  <li>디자인 시스템 문서와 토큰 확장</li>
                </ul>
              </article>
            </div>
          </div>
        </Container>
      </section>

      <section id="faq" className="border-t border-[var(--line)] bg-white/70 py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">FAQ</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
                구현과 확장 전에 자주 생기는 질문
              </h2>
            </div>
            <div className="mt-10 grid gap-4">
              {faqItems.map((item) => (
                <article key={item.question} className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="rounded-[2.5rem] border border-[var(--line-strong)] bg-[linear-gradient(135deg,#ffffff_0%,#ffe0ea_55%,#dbeafe_100%)] p-8 shadow-[var(--shadow-hero)] md:p-12">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent-strong)]">Final CTA</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
                  랜딩은 정리됐고,
                  <span className="mt-2 block">다음은 실제 운영 흐름을 확장하는 단계입니다</span>
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
                  회원, 관리자, 대시보드 흐름을 중심으로 홈 진입면을 재구성했습니다. 이제 같은 디자인 시스템으로
                  내부 표면도 일관되게 확장할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href={primaryHref}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
                >
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#overview"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-white/85 px-6 py-3.5 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  전체 흐름 다시 보기
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function SignalCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Workflow;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-white/55">{label}</span>
        <Icon className="h-4 w-4 text-white/70" />
      </div>
      <p className="mt-3 font-mono text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
