export type AboutValue = {
  title: string;
  description: string;
};

export type TeamMember = {
  name: string;
  role: string;
};

export const values: AboutValue[] = [
  {
    title: "전략",
    description: "빠르게 움직이는 팀을 위한 명확한 포지셔닝과 메시지.",
  },
  {
    title: "디자인",
    description: "채널 전반으로 확장되는 브랜드·제품 시스템.",
  },
  {
    title: "디지털",
    description: "측정 가능한 성과를 만드는 웹·앱 전달.",
  },
];

export const team: TeamMember[] = [
  { name: "Reese Nolan", role: "크리에이티브 디렉터" },
  { name: "Morgan Lee", role: "브랜드 전략가" },
  { name: "Jamie Patel", role: "프로덕트 디자이너" },
  { name: "Alex Park", role: "모션 & 콘텐츠" },
];
