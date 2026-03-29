"use client";

import Link from "next/link";
import { FolderKanban, LogOut, Settings, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";

type ProfileMenuProps = {
  name: string;
  email?: string | null;
  image?: string | null;
  userRole?: string | null;
  showNameInTrigger?: boolean;
  showDashboardLink?: boolean;
};

export default function ProfileMenu({
  name,
  email,
  image,
  userRole,
  showNameInTrigger = false,
  showDashboardLink = true,
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = userRole?.toUpperCase() === "ADMIN";

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={
          showNameInTrigger
            ? "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            : "inline-flex items-center rounded-md p-0.5 transition hover:bg-slate-100"
        }
        aria-label="프로필 메뉴 열기"
        aria-expanded={isOpen}
      >
        <ProfileAvatar name={name} image={image} size={24} className="h-6 w-6" />
        {showNameInTrigger ? <span className="max-w-[140px] truncate">{name} 님</span> : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-500">
            <ProfileAvatar name={name} image={image} size={36} className="h-9 w-9" iconClassName="h-5 w-5" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{name} 님</p>
              <p className="truncate">{email}</p>
            </div>
          </div>
          {showDashboardLink ? (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <FolderKanban className="h-4 w-4" />
              대시보드
            </Link>
          ) : null}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <Settings className="h-4 w-4" />
            설정
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <Shield className="h-4 w-4" />
              관리자
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      ) : null}
    </div>
  );
}
