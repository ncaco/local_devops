"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MobileBottomNav, ScrollIndicator, SiteFooter, SiteHeader } from "@/src/widgets/home/layout";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password";
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isSettingsRoute = pathname.startsWith("/settings");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAuthRoute || isDashboardRoute || isSettingsRoute || isAdminRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main className="pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <SiteFooter />
      <MobileBottomNav />
      <ScrollIndicator />
    </>
  );
}
