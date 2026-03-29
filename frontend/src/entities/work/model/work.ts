export type WorkItem = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  highlights: string[];
};

export const workItems: WorkItem[] = [
  {
    slug: "exploid-game",
    title: "Exploid 게임 모바일 앱 2020",
    category: "모바일",
    summary: "모바일 타이틀을 위한 게임플레이 UI와 온보딩 흐름.",
    highlights: [
      "핵심 게임플레이 UI 키트",
      "온보딩 및 튜토리얼 흐름",
      "스토어 및 리워드 리디자인",
    ],
  },
  {
    slug: "taskify-app",
    title: "Taskify 앱 웹 디자인 2023",
    category: "웹 앱",
    summary: "업무 효율을 높이기 위한 생산성 도구 리디자인.",
    highlights: [
      "내비게이션 단순화",
      "태스크 보드 성능 개선",
      "신규 리포팅 대시보드 UI",
    ],
  },
  {
    slug: "fashion-brand",
    title: "패션 브랜드 브랜딩 2024",
    category: "브랜딩",
    summary: "패션 레이블의 비주얼 아이덴티티와 런칭 키트.",
    highlights: [
      "로고 및 모노그램 시스템",
      "런칭 캠페인 에셋",
      "패키징과 룩북",
    ],
  },
  {
    slug: "leardo-ecom",
    title: "Leardo 이커머스 웹사이트 디자인 2025",
    category: "이커머스",
    summary: "전환율 중심의 스토어 개편과 카탈로그 UI.",
    highlights: [
      "상품 상세 페이지 최적화",
      "장바구니 및 결제 흐름 개선",
      "카탈로그 내비게이션 리디자인",
    ],
  },
];

export const getWorkItemBySlug = (slug: string) =>
  workItems.find((item) => item.slug === slug) ?? workItems[0];
