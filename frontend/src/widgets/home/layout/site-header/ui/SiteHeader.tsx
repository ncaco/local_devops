"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ProfileMenu } from "@/src/shared/ui";
import { siteNavItems } from "@/src/shared/config/site-nav";

export default function SiteHeader() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY <= 4) {
          setIsVisible(true);
        } else if (delta > 6) {
          setIsVisible(false);
        } else if (delta < -6) {
          setIsVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rawName = session?.user?.name?.trim();
  const fallbackName = session?.user?.email?.split("@")[0] ?? "회원";
  const displayName = rawName && rawName.length > 0 ? rawName : fallbackName;
  const profileImage = session?.user?.image ?? null;

  return (
    <header
      className={`sticky top-0 z-40 h-[72px] border-b border-[var(--line)] bg-[rgba(255,247,248,0.86)] backdrop-blur-md transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-14">
        <div className="flex h-[72px] items-center">
          <Link href="/" className="flex items-center py-4 text-slate-900">
            <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} priority className="h-9 w-auto" />
          </Link>
          <div className="ml-auto flex h-full items-center gap-3">
            <nav className="hidden h-full items-center gap-2 text-sm text-slate-700 md:flex">
              {siteNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="cursor-pointer rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {status === "authenticated" ? (
              <ProfileMenu
                name={displayName}
                email={session?.user?.email}
                image={profileImage}
                userRole={session?.user?.role}
                showNameInTrigger
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className="cursor-pointer rounded-full border border-[var(--line-strong)] bg-white/80 px-4 py-2 text-xs font-medium text-slate-900 transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="cursor-pointer rounded-full bg-[var(--cta)] px-4 py-2 text-xs font-medium text-white transition hover:bg-[var(--cta-strong)]"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
