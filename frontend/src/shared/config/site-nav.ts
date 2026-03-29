export type SiteNavItem = {
  href: string;
  label: string;
  children?: Array<{
    href: string;
    label: string;
  }>;
};

export const siteNavItems: SiteNavItem[] = [
  { href: "#overview", label: "개요" },
  { href: "#features", label: "기능" },
  { href: "#workflow", label: "흐름" },
  { href: "#pricing", label: "가치" },
  { href: "#faq", label: "FAQ" },
];
