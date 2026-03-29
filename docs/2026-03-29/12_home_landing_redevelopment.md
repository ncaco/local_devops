# 홈 랜딩 재개발

## 개요

- 대상: `frontend/app/page.tsx`
- 목적: 임시 로컬 소개 화면을 `SNS 자동화 배포 서비스`용 전환형 제품 랜딩으로 교체
- 기준: `UI/UX Pro Max`로 생성한 `design-system/snsauto/MASTER.md`, `design-system/snsauto/pages/home.md`

## 이번 작업에서 고정한 결정

- 홈은 기존 `src/widgets/home/sections/*`를 재조합하지 않고 신규 랜딩 위젯으로 구현한다.
- 정보 구조는 `Hero → Problem/Overview → Features → Workflow → Trust/Value → FAQ → Final CTA` 순서로 구성한다.
- CTA는 로그인 상태에 따라 `/login` 또는 `/dashboard`로 분기한다.
- 공용 랜딩 셸은 유지하고, 헤더·푸터·모바일 하단 내비는 홈 섹션 앵커에 맞게 재정렬한다.

## 스킬 도입

- 프로젝트 루트에서 `npx uipro-cli init --ai codex` 실행
- 생성 경로: `.codex/skills/ui-ux-pro-max/`
- 디자인 시스템 생성:

```powershell
python .codex\skills\ui-ux-pro-max\scripts\search.py "sns automation deployment service saas social media operations dashboard" --design-system --persist -f markdown -p "SNSAUTO" --page "home"
```

## 디자인 적용 요약

- 기본 팔레트: rose 계열 브랜드 색 + blue CTA 조합
- 표면 전략: 밝은 배경 위 블록형 카드, 강한 구획, 명확한 행동 유도
- 타이포 전략: 본문은 기존 한글 가독성을 유지하고, 강조 라벨과 수치에 모노 톤을 사용
- 금지 패턴: 낮은 대비, 포커스 미표시, 즉시 점프하는 상태 변화, 클릭 가능한 요소의 `cursor` 누락

## 구현 메모

- 글로벌 CSS 토큰을 확장해 홈 랜딩 전용 색상, 테두리, 그림자 체계를 추가한다.
- `siteNavItems`를 실제 홈 앵커 내비로 채운다.
- 내부 링크는 모두 `next/link`를 사용한다.
- 모바일 하단 내비는 홈, 기능, FAQ, 대시보드 축으로 단순화한다.

## 후속 확장

- 동일 디자인 시스템으로 `/dashboard`, `/settings`, `/admin` 표면의 카드/헤더/상태 색상도 재정렬할 수 있다.
- 필요 시 `design-system/snsauto/pages/`에 대시보드·관리자 오버라이드를 추가한다.
