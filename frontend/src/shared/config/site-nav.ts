export type SiteNavItem = {
  href: string;
  label: string;
  children?: Array<{
    href: string;
    label: string;
  }>;
};

export const siteNavItems: SiteNavItem[] = [
  {
    href: "/login",
    label: "로그인",
  },
];
