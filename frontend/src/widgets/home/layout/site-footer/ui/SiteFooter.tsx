import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Globe, Instagram, Rss, Twitter, Youtube } from "lucide-react";
import { siteNavItems } from "@/src/shared/config/site-nav";
import { Container } from "@/src/shared/ui";

const footerContent = {
  socials: [
    { label: "인스타그램", href: "https://www.instagram.com" },
    { label: "블로그", href: "https://naver.com" },
    { label: "유튜브", href: "https://www.youtube.com" },
    { label: "X", href: "https://x.com" },
    { label: "쓰레드", href: "https://www.threads.net" },
  ],
  copyright: "© 2026 SNSAUTO. All rights reserved.",
};

export default function SiteFooter() {
  const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    인스타그램: Instagram,
    블로그: Rss,
    유튜브: Youtube,
    X: Twitter,
    쓰레드: Globe,
  };

  return (
    <footer className="mb-[60px] border-t border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,241,242,0.96)_100%)] text-slate-900 md:mb-0">
      <Container>
        <div className="grid gap-10 py-16 lg:grid-cols-[1.2fr_2.8fr]">
          <div className="space-y-6">
            <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} className="h-8 w-auto" />
            <p className="max-w-sm text-sm leading-7 text-slate-600">
              회원 기능 중심 베이스를 운영 자동화 제품의 실제 진입면으로 재구성한 랜딩입니다.
            </p>
            <div className="flex gap-3 text-slate-500">
              {footerContent.socials.map((social) => {
                const Icon = iconMap[social.label] ?? Globe;
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] transition hover:border-[var(--accent)] hover:text-slate-900"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {siteNavItems.map((item) => (
              <div key={item.label} className="space-y-3 text-sm text-slate-500">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                  {item.label}
                </p>
                <ul className="space-y-2">
                  {item.children?.length ? (
                    item.children.map((child) => (
                      <li key={child.label}>
                        <Link href={child.href} className="cursor-pointer hover:text-slate-900">
                          {child.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <Link href={item.href} className="cursor-pointer hover:text-slate-900">
                        {item.label}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] py-6 text-xs text-slate-500 md:flex-row">
          <p>{footerContent.copyright}</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Globe className="h-4 w-4" />
            <span>KO</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
