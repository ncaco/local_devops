import { AppShell } from "@/components/app-shell";
import { StatusChip } from "@/components/status-chip";

export default function ComposerPage() {
  return (
    <AppShell
      eyebrow="Publish Preparation"
      title="Content Composer"
      sidePanel={
        <div className="stack">
          <div className="panel-card">
            <p className="section-label">Validation</p>
            <div className="stack-sm">
              <StatusChip tone="success">Caption valid</StatusChip>
              <StatusChip tone="warning">Thumbnail missing alt text</StatusChip>
              <StatusChip tone="info">Approval routing ready</StatusChip>
            </div>
          </div>
          <div className="panel-card">
            <p className="section-label">Target channels</p>
            <ul className="plain-list">
              <li>Instagram Reel</li>
              <li>Threads Post</li>
              <li>YouTube Shorts</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="stack">
        <section className="hero-card accent-teal">
          <div>
            <p className="hero-eyebrow">Drafting flow</p>
            <h2>게시 전에 실패 요인을 먼저 제거합니다.</h2>
          </div>
          <p>
            이 화면은 글을 예쁘게 쓰는 곳이 아니라, 승인과 배포가 막히지 않도록
            준비하는 작업대입니다.
          </p>
        </section>

        <section className="panel-card">
          <div className="section-heading">
            <div>
              <p className="section-label">Message</p>
              <h3>봄 캠페인 메인 게시물</h3>
            </div>
            <StatusChip tone="warning">Pending approval</StatusChip>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Title</span>
              <input defaultValue="Spring Launch / Hero Cut" />
            </label>
            <label className="field">
              <span>Planned publish</span>
              <input defaultValue="2026-03-29 12:30" />
            </label>
            <label className="field field-wide">
              <span>Caption</span>
              <textarea
                defaultValue="이번 시즌 첫 제품 드롭을 공개합니다. 오늘 12시 30분, 인스타그램과 스레드에서 동시에 시작합니다."
                rows={7}
              />
            </label>
            <label className="field">
              <span>Approval route</span>
              <input defaultValue="Manager -> Brand Lead" />
            </label>
            <label className="field">
              <span>Risk note</span>
              <input defaultValue="스토리 파생 컷은 아직 업로드 전" />
            </label>
          </div>

          <div className="button-row">
            <button className="primary-button" type="button">
              Submit for approval
            </button>
            <button className="ghost-button" type="button">
              Save draft
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
