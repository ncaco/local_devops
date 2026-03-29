# Design System — SNS 자동화 배포 서비스

## Product Context
- **What this is:** 승인, 예약 게시, 실패 복구를 한 화면 흐름으로 관리하는 SNS 배포 운영 도구다.
- **Who it's for:** 여러 브랜드와 채널을 동시에 운영하는 마케팅 운영자, 콘텐츠 매니저, 승인자다.
- **Space/industry:** 소셜 퍼블리싱, 마케팅 운영, 콘텐츠 승인 워크플로우 도구 영역이다.
- **Project type:** 운영형 웹 앱, 데이터 밀도가 높은 대시보드다.

## Aesthetic Direction
- **Direction:** Quiet Control Room
- **Decoration level:** intentional
- **Mood:** 시끄러운 SaaS 대시보드가 아니라 조용하고 단단한 운영실처럼 보여야 한다. 사용자는 예쁘다보다 통제되고 있다는 느낌을 먼저 받아야 한다.
- **Reference sites:** 별도 외부 리서치 없이 제품 문맥과 운영 도구의 1차 원칙을 기준으로 설계했다.

## Typography
- **Display/Hero:** `Sora` — 짧은 제목에서 각진 긴장감을 만들고, 운영 도구의 결정을 빠르게 읽히게 한다.
- **Body:** `Noto Sans KR` — 한국어 UI 밀도가 높아도 안정적으로 읽힌다.
- **UI/Labels:** `Noto Sans KR`
- **Data/Tables:** `JetBrains Mono` — 카운트, 시간, 상태 코드를 정렬해서 읽히게 만든다.
- **Code:** `JetBrains Mono`
- **Loading:** `next/font/google`로 로드한다.
- **Scale:** hero `3.5rem`, section title `1.5rem`, card title `1rem`, body `0.95rem`, meta `0.82rem`

## Color
- **Approach:** restrained
- **Primary:** `#0f766e` — 승인, 안정, 실행 버튼에 쓰는 주 액션 컬러다.
- **Secondary:** `#c76832` — 예약, 주의, 보조 강조에 쓰는 온기 있는 액센트다.
- **Neutrals:** `#f3f1ea`, `#fbfaf6`, `#ffffff`, `#ddd6c8`, `#b8ad98`, `#6b7a7e`, `#38484c`, `#1d2a2f`
- **Semantic:** success `#dff3e7`, warning `#fff1cf`, error `#f7d9d4`, info `#d9ecea`
- **Dark mode:** 배경은 먹색 계열로 내리고, 상태색 채도는 10-15% 줄이되 대비는 유지한다.

## Spacing
- **Base unit:** `4px`
- **Density:** compact
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** hybrid
- **Grid:** desktop 12 columns, tablet 8 columns, mobile 4 columns
- **Max content width:** `1440px`
- **Border radius:** sm `8px`, md `14px`, lg `20px`, pill `9999px`

## Motion
- **Approach:** minimal-functional
- **Easing:** enter(`ease-out`) exit(`ease-in`) move(`ease-in-out`)
- **Duration:** micro(`80ms`) short(`160ms`) medium(`240ms`) long(`420ms`)

## Rules
- 상태가 먼저 보이고, 원인은 바로 뒤따라야 한다.
- 실패 화면은 빨간 박스가 아니라 복구 콘솔처럼 보여야 한다.
- 승인과 게시는 같은 흐름 안에 있지만 시각적 긴장감은 다르게 둔다.
- 보라색 SaaS 그라디언트, 둥근 카드만 가득한 화면, 중앙 정렬 랜딩 패턴은 금지한다.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-29 | Quiet Control Room 방향 유지 | 이 제품의 핵심은 배포 통제와 실패 복구라서 화려함보다 운영 감각이 중요하다 |
| 2026-03-29 | Sora + Noto Sans KR + JetBrains Mono 조합 확정 | 제목, 본문, 데이터 읽기 패턴이 분리돼야 운영 화면이 빨라진다 |
| 2026-03-29 | restrained color system 유지 | 상태색은 강해야 하지만 전체 화면은 조용해야 한다 |
