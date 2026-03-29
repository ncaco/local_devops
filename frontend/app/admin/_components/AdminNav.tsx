"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserX } from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "개요 관리", icon: Home },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/withdrawn-users", label: "탈퇴회원 관리", icon: UserX },
];

type AdminNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export default function AdminNav({ collapsed = false, onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            aria-label={item.label}
            className={`flex items-center rounded-lg px-3 py-2 text-sm transition ${
              isActive ? "bg-slate-200 font-medium text-slate-900" : "text-slate-700 hover:bg-slate-100"
            } ${collapsed ? "justify-center" : "gap-2"}`}
          >
            <Icon className="h-4 w-4" />
            {collapsed ? null : item.label}
          </Link>
        );
      })}
    </nav>
  );
}
