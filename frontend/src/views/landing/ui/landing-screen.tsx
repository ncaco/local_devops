import Link from "next/link";

import { StatusChip } from "@/shared/ui/status-chip";

export function LandingScreen() {
  return (
    <div className="marketing-frame">
      <header className="marketing-topbar">
        <div className="topbar-brand">
          <span className="brand-chip">NC97 OPS</span>
          <div>
            <strong className="brand-title">NC97 Social Ops</strong>
            <p className="meta-copy">소상공인 SNS 운영을 예약, 확인, 복구 흐름으로 정리하는 도구</p>
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
          <div className="hero-copy stack">
            <span className="eyebrow-chip">Small business social ops</span>
            <h1>가게 SNS 운영 시간을 줄여주는 예약 발행 워크스페이스</h1>
            <p className="marketing-lead">
              사장님과 직원 한 명이 인스타그램, 스레드, 쇼츠를 같이 운영하면 가장 먼저
              무너지는 건 시간입니다. 어디에 올렸는지, 예약이 잡혔는지, 실패가 났는지
              다시 확인하는 데 하루가 다 갑니다. NC97 OPS는 그 반복 확인 시간을 줄이도록
              설계했습니다.
            </p>
            <div className="marketing-cta-row">
              <Link className="primary-button" href="/signup">
                바로 시작하기
              </Link>
              <Link className="ghost-button" href="/login">
                데모 로그인
              </Link>
            </div>
            <div className="trust-strip">
              <span>INSTAGRAM</span>
              <span>THREADS</span>
              <span>YOUTUBE</span>
              <span>TIKTOK</span>
              <span>AUDIT LOG</span>
            </div>
          </div>

          <div className="dashboard-preview">
            <div className="preview-topbar">
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
              <p>NC97 OPS / 오늘의 SNS 운영</p>
            </div>
            <div className="preview-shell">
              <div className="preview-sidebar">
                <span className="preview-nav is-active">오늘 할 일</span>
                <span className="preview-nav">예약 목록</span>
                <span className="preview-nav">채널 상태</span>
                <span className="preview-nav">문제 알림</span>
              </div>
              <div className="preview-main">
                <div className="preview-metric-row">
                  <div className="preview-metric">
                    <span>오늘 예약</span>
                    <strong>06</strong>
                  </div>
                  <div className="preview-metric">
                    <span>확인 필요</span>
                    <strong>02</strong>
                  </div>
                  <div className="preview-metric">
                    <span>실패 알림</span>
                    <strong>01</strong>
                  </div>
                </div>
                <div className="preview-table">
                  <div className="preview-table-row preview-table-head">
                    <span>Post</span>
                    <span>상태</span>
                    <span>시간</span>
                  </div>
                  <div className="preview-table-row">
                    <span>주말 할인 공지 릴스</span>
                    <span className="preview-badge preview-badge-warning">검토</span>
                    <span>11:30</span>
                  </div>
                  <div className="preview-table-row">
                    <span>신메뉴 소개 스레드</span>
                    <span className="preview-badge preview-badge-success">예약</span>
                    <span>12:00</span>
                  </div>
                  <div className="preview-table-row">
                    <span>매장 스토리 업로드</span>
                    <span className="preview-badge preview-badge-danger">실패</span>
                    <span>12:20</span>
                  </div>
                </div>
                <div className="preview-footer">
                  <span>instagram 연결됨</span>
                  <span>threads 확인 필요</span>
                  <span>댓글 기록 저장</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="marketing-side">
          <section className="hero-panel">
            <div className="section-heading">
              <div>
                <p className="section-label">왜 필요한가</p>
                <h3>소상공인은 SNS를 못해서가 아니라 시간이 없어서 놓칩니다.</h3>
              </div>
              <StatusChip tone="success">time saver</StatusChip>
            </div>
            <ul className="stats-list plain-list">
              <li>채널마다 따로 들어가 예약을 걸면 올렸는지 다시 확인하는 시간이 커집니다.</li>
              <li>오늘 나갈 게시물이 한곳에 안 모이면 매장 운영 중간마다 확인하게 됩니다.</li>
              <li>실패 알림을 늦게 보면 홍보 일정이 아니라 손님과의 약속이 어긋납니다.</li>
            </ul>
          </section>

          <section className="sales-card">
            <p className="section-label">무엇을 줄여주나</p>
            <div className="marketing-list">
              <div>
                <strong>예약 확인 시간</strong>
                <p className="body-copy">오늘 예약된 게시물을 한 화면에서 보고 바로 수정합니다.</p>
              </div>
              <div>
                <strong>채널별 반복 작업</strong>
                <p className="body-copy">인스타그램, 스레드, 쇼츠 상태를 따로 열지 않아도 됩니다.</p>
              </div>
              <div>
                <strong>문제 대응 지연</strong>
                <p className="body-copy">실패 알림과 재시도 대상을 바로 보여줘서 놓치는 일을 줄입니다.</p>
              </div>
            </div>
          </section>
        </aside>
      </section>

      <section className="feature-band-grid">
        <article className="feature-band">
          <p className="section-label">오늘 일정</p>
          <strong>예약 발행을 한곳에서 확인</strong>
          <p className="body-copy">오늘 올릴 게시물과 시간을 바로 확인합니다.</p>
        </article>
        <article className="feature-band">
          <p className="section-label">채널 상태</p>
          <strong>계정 이상을 먼저 표시</strong>
          <p className="body-copy">토큰 만료나 연결 문제를 늦지 않게 확인합니다.</p>
        </article>
        <article className="feature-band">
          <p className="section-label">문제 복구</p>
          <strong>실패를 놓치지 않고 다시 올리기</strong>
          <p className="body-copy">실패 알림과 다음 조치를 한 화면에서 확인합니다.</p>
        </article>
      </section>
    </div>
  );
}
