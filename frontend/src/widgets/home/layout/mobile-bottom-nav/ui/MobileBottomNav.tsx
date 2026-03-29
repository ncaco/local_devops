"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, CircleHelp, Home, LayoutDashboard } from "lucide-react";

const mobileNavItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "#features", label: "기능", icon: Boxes },
  { href: "#faq", label: "FAQ", icon: CircleHelp },
  { href: "/dashboard", label: "대시", icon: LayoutDashboard },
];

const isActivePath = (pathname: string, href: string) => {
  if (href.startsWith("#")) {
    return pathname === "/";
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[rgba(255,247,248,0.94)] backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="모바일 하단 메뉴"
    >
      <ul className="mx-auto grid h-[3.75rem] max-w-xl grid-cols-4">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <li key={item.href} className="h-full">
              <Link
                href={item.href}
                className={`flex h-full w-full cursor-pointer flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
                  isActive ? "text-[var(--accent-strong)]" : "text-slate-500 hover:text-slate-900"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
