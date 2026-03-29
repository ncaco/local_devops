"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseItemClass = "block rounded-md px-2.5 py-1.5";

function getItemClass(isActive: boolean) {
  if (isActive) {
    return `${baseItemClass} bg-slate-200 font-semibold text-slate-900`;
  }
  return `${baseItemClass} font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900`;
}

export default function SettingsNav() {
  const pathname = usePathname();
  const isProfile = pathname === "/settings/profile";
  const isPassword = pathname === "/settings/password";
  const isWithdrawal = pathname === "/settings/withdrawal";

  return (
    <ul className="mt-2 space-y-0.5 text-sm">
      <li>
        <Link href="/settings/profile" className={getItemClass(isProfile)}>
          프로필정보
        </Link>
      </li>
      <li>
        <Link href="/settings/password" className={getItemClass(isPassword)}>
          비밀번호변경
        </Link>
      </li>
      <li>
        <Link href="/settings/withdrawal" className={getItemClass(isWithdrawal)}>
          회원탈퇴
        </Link>
      </li>
    </ul>
  );
}
