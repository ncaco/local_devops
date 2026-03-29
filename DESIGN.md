# SNS 자동화 배포 서비스 디자인 시스템

작성일: 2026-03-29
기준 문서: `docs/2026-03-29/11_design_strategy.md`

## 디자인 원칙

이 제품은 소비자용 SNS 앱이 아니다.

운영자가 실패 없이 게시를 끝내고, 문제가 생기면 바로 복구하는 운영 도구다.

따라서 디자인의 목표는 화려함이 아니라 통제감이다.

- 상태가 먼저 보여야 한다.
- 실패는 숨기지 말고 설명해야 한다.
- 승인과 게시는 같은 흐름으로 느껴지되 시각적으로는 분리돼야 한다.
- 숫자, 시간, 상태값은 빠르게 읽혀야 한다.
- 운영 화면은 조용하고 단단해야 한다.

## Aesthetic Direction

방향은 "Quiet Control Room"으로 고정한다.

밝은 중립 배경, 진한 잉크 톤 텍스트, 선명한 상태 색, 높은 정보 밀도, 낮은 장식성.

이 제품은 사용자를 들뜨게 만들 필요가 없다. 대신 지금 무슨 일이 일어나는지 즉시 이해되게 해야 한다.

## Typography

- Display/Hero: `Sora`
  이유: 각지고 단단한 인상이 있어서 운영 도구의 신뢰감을 만든다.
- Body: `Noto Sans KR`
  이유: 한국어 가독성이 안정적이고 정보 밀도가 높은 UI에 적합하다.
- UI/Labels: `Noto Sans KR`
- Data/Tables: `JetBrains Mono`
  이유: 시간, 상태 코드, 카운트, ID를 정렬해서 읽기 좋다.
- Code: `JetBrains Mono`

## Color System

### Base

- `--bg-canvas`: `#f3f1ea`
- `--bg-panel`: `#fbfaf6`
- `--bg-elevated`: `#ffffff`
- `--line-soft`: `#ddd6c8`
- `--line-strong`: `#b8ad98`
- `--text-strong`: `#1d2a2f`
- `--text-body`: `#38484c`
- `--text-muted`: `#6b7a7e`

### Brand / Action

- `--accent-primary`: `#0f766e`
- `--accent-primary-strong`: `#0b5c56`
- `--accent-secondary`: `#c76832`

### Status

- `--status-success-bg`: `#dff3e7`
- `--status-success-text`: `#1d6b42`
- `--status-warning-bg`: `#fff1cf`
- `--status-warning-text`: `#8a5a00`
- `--status-danger-bg`: `#f7d9d4`
- `--status-danger-text`: `#9d2f1e`
- `--status-info-bg`: `#d9ecea`
- `--status-info-text`: `#125e59`

## Spacing

- Base unit: `4px`
- Card padding: `20px`
- Panel gap: `16px`
- Section gap: `24px`
- Dense table cell padding: `10px 12px`

정보 밀도가 중요하므로 여백은 넉넉하되 낭비하지 않는다.

## Layout

- Desktop max width: `1440px`
- Main grid:
  - Left nav `240px`
  - Main content flexible
  - Optional side panel `360px`
- Mobile:
  - Single-column
  - 상태 요약 카드 우선
  - 승인/반려 같은 핵심 액션은 하단 고정 가능

## Components

핵심 컴포넌트는 다음으로 고정한다.

- App Shell
- Sidebar Navigation
- Brand Switcher
- Section Header
- KPI Card
- Status Chip
- Approval Card
- Timeline Rail
- Failure Panel
- Signal Table
- Sticky Action Bar

## Motion

- 페이지 진입: `180ms` fade + slight translate
- 상태 전환: `120ms` ease
- 토스트: `160ms`

과한 장식 모션은 금지한다.

운영 도구는 빠르고 조용해야 한다.

## Interaction Rules

- 파괴적 액션은 항상 맥락을 같이 보여준다.
- 승인 버튼은 눈에 띄되 가볍게 보이면 안 된다.
- 실패는 빨간색만 크게 쓰지 말고, 원인과 다음 행동을 함께 보여준다.
- 빈 상태는 CTA와 다음 행동을 반드시 포함한다.
- Overview는 요약, Detail은 진실의 원장 역할을 해야 한다.

## Accessibility

- 본문 대비는 WCAG AA 이상
- 키보드 탐색 가능
- 상태는 색만으로 구분하지 않는다
- 클릭 타깃 최소 `40px`

## Do / Don't

### Do

- 상태를 먼저 보여라
- 시간과 카운트는 monospace로 정렬하라
- 실패를 설명 가능한 문장으로 바꿔라
- 화면 간 맥락을 유지하라

### Don't

- 보라색 중심 SaaS UI로 만들지 마라
- 과도한 gradient와 글로우를 쓰지 마라
- 카드만 많은 일반 대시보드처럼 보이게 하지 마라
- 승인과 게시를 하나의 가벼운 CTA처럼 보이게 하지 마라

