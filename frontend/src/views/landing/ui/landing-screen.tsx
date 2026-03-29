import Link from "next/link";

import { StatusChip } from "@/shared/ui/status-chip";

export function LandingScreen() {
  return (
    <div className="marketing-frame">
      <header className="marketing-topbar">
        <div className="topbar-brand">
          <span className="brand-chip">NC97 OPS</span>
          <div>
            <strong className="brand-title">SNS Deployment System</strong>
            <p className="meta-copy">승인, 예약, 실패 복구를 한 흐름으로 통제하는 운영 SaaS</p>
          </div>
        </div>

        <div className="topbar-actions">
          <Link className="ghost-button" href="/login">
            로그인
          </Link>
          <Link className="primary-button" href="/signup">
            시작하기
          </Link>
        </div>
      </header>

      <section className="marketing-grid">
        <article className="marketing-hero">
          <div className="stack">
            <span className="eyebrow-chip">Hybrid Landing</span>
            <h1>승인되지 않은 게시와 늦은 실패 발견을 없앱니다.</h1>
            <p className="marketing-lead">
              SNS 자동화는 글을 빨리 쓰는 문제가 아니라, 정확한 조직과 채널에 안전하게
              배포하는 문제입니다. 이 제품은 승인, 예약 게시, 실패 복구, 감사 추적을 한
              흐름으로 묶습니다.
            </p>
            <div className="marketing-cta-row">
              <Link className="primary-button" href="/signup">
                조직 시작하기
              </Link>
              <Link className="ghost-button" href="/login">
                기존 사용자 로그인
              </Link>
            </div>
          </div>

          <div className="proof-grid">
            <div className="feature-card">
              <p className="section-label">승인 기반 파이프라인</p>
              <strong>콘텐츠 작성 → 승인 → 예약 → 게시 → 복구</strong>
              <p className="body-copy">운영자는 한 단계도 추측하지 않습니다.</p>
            </div>
            <div className="feature-card">
              <p className="section-label">운영자 중심 시야</p>
              <strong>오늘 해야 할 일과 위험 신호가 먼저 보입니다.</strong>
              <p className="body-copy">예쁜 대시보드가 아니라 사고를 줄이는 작업대입니다.</p>
            </div>
          </div>
        </article>

        <div className="marketing-stack">
          <section className="hero-panel">
            <div className="section-heading">
              <div>
                <p className="section-label">Why teams buy</p>
                <h3>운영 사고가 줄어드는 구조</h3>
              </div>
              <StatusChip tone="success">98% success goal</StatusChip>
            </div>
            <ul className="stats-list plain-list">
              <li>승인 없는 자동 게시를 서버와 UI에서 동시에 차단</li>
              <li>채널별 토큰 만료와 권한 이상을 즉시 표시</li>
              <li>실패는 원인, 조치, 재시도 상태까지 운영 언어로 번역</li>
            </ul>
          </section>

          <section className="sales-card">
            <div className="section-heading">
              <div>
                <p className="section-label">Role fit</p>
                <h3>한 제품 안에서 역할이 나뉩니다</h3>
              </div>
            </div>
            <div className="stack-sm">
              <div className="timeline-row">
                <span className="icon-bullet icon-info" />
                <div>
                  <strong>운영자</strong>
                  <p className="body-copy">게시 준비, 실패 복구, 예약 슬롯 관리</p>
                </div>
              </div>
              <div className="timeline-row">
                <span className="icon-bullet icon-warning" />
                <div>
                  <strong>승인자</strong>
                  <p className="body-copy">승인 대기함, 반려 사유, 이력 검토</p>
                </div>
              </div>
              <div className="timeline-row">
                <span className="icon-bullet icon-success" />
                <div>
                  <strong>관리자</strong>
                  <p className="body-copy">조직, 브랜드, 채널 계정, 정책 관리</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="feature-grid" style={{ marginTop: 20 }}>
        <article className="feature-card">
          <p className="section-label">Control Room</p>
          <strong>Overview</strong>
          <p className="body-copy">오늘 예정 게시, 승인 대기, 실패 작업, 계정 이상 상태를 한 화면에서 봅니다.</p>
        </article>
        <article className="feature-card">
          <p className="section-label">My Page</p>
          <strong>개인 작업 허브</strong>
          <p className="body-copy">내 알림, 내 승인 요청, 내 보안 설정, 최근 활동을 모읍니다.</p>
        </article>
        <article className="feature-card">
          <p className="section-label">Admin</p>
          <strong>조직 관리자와 슈퍼어드민 분리</strong>
          <p className="body-copy">조직 운영과 플랫폼 운영을 서로 다른 긴장감으로 설계했습니다.</p>
        </article>
      </section>
    </div>
  );
}
