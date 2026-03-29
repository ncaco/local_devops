export type PricingTier = {
  name: string;
  price: string;
  detail: string;
  features: string[];
};

export const tiers: PricingTier[] = [
  {
    name: "월간 패키지",
    price: "$4,990",
    detail: "월 정액으로 무제한 디자인 서비스를 제공합니다.",
    features: [
      "무제한 요청",
      "무제한 수정",
      "무제한 팀원",
      "무제한 저장공간",
      "언제든 일시정지/해지",
    ],
  },
];
