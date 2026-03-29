export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export const posts: BlogPost[] = [
  {
    slug: "designing-for-decision-makers",
    title: "의사결정자를 위한 디자인",
    date: "2026년 1월 12일",
    summary: "창업자와 마케팅을 하나의 이야기 흐름으로 정렬하는 방법.",
  },
  {
    slug: "launch-week-checklist",
    title: "런칭 주간 체크리스트",
    date: "2025년 12월 2일",
    summary: "보도와 유료 캠페인 시작 전에 준비해야 할 것들.",
  },
  {
    slug: "modular-content-systems",
    title: "모듈형 콘텐츠 시스템",
    date: "2025년 11월 18일",
    summary: "레이아웃을 다시 만들지 않고 마케팅 페이지를 신선하게 유지하는 방법.",
  },
];
