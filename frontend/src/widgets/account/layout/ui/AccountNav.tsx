"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Shield } from "lucide-react";

type AccountNavProps = {
  mobile?: boolean;
  showAdmin?: boolean;
};

const baseItemClass = "flex items-center gap-2 rounded-md px-2.5 py-1.5";

function getItemClass(isActive: boolean, mobile: boolean) {
  if (mobile) {
    return isActive
      ? `${baseItemClass} whitespace-nowrap bg-slate-200 font-semibold text-slate-900`
      : `${baseItemClass} whitespace-nowrap font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900`;
  }

  return isActive
    ? `${baseItemClass} bg-slate-200 font-semibold text-slate-900`
    : `${baseItemClass} font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900`;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/admin") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

const mainItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
];

const settingsItems = [
  { href: "/settings/profile", label: "프로필정보", icon: Settings },
  { href: "/settings/password", label: "비밀번호변경", icon: Settings },
  { href: "/settings/withdrawal", label: "회원탈퇴", icon: Settings },
];

export default function AccountNav({ mobile = false, showAdmin = false }: AccountNavProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <div className="space-y-3">
        <div>
          <p className="px-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500">메뉴</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 text-sm">
            {mainItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={getItemClass(isActivePath(pathname, item.href), true)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {showAdmin ? (
              <Link href="/admin" className={getItemClass(isActivePath(pathname, "/admin"), true)}>
                <Shield className="h-4 w-4" />
                <span>관리자</span>
              </Link>
            ) : null}
          </div>
        </div>

        <div>
          <p className="px-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500">계정 설정</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 text-sm">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={getItemClass(isActivePath(pathname, item.href), true)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="px-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500">메뉴</p>
        <ul className="mt-2 space-y-0.5 text-sm">
          {mainItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href} className={getItemClass(isActivePath(pathname, item.href), false)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          {showAdmin ? (
            <li>
              <Link href="/admin" className={getItemClass(isActivePath(pathname, "/admin"), false)}>
                <Shield className="h-4 w-4" />
                <span>관리자</span>
              </Link>
            </li>
          ) : null}
        </ul>
      </div>

      <div>
        <p className="px-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500">계정 설정</p>
        <ul className="mt-2 space-y-0.5 text-sm">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href} className={getItemClass(isActivePath(pathname, item.href), false)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
