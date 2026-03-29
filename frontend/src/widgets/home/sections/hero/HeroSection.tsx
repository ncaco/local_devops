"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Instagram, Rss, Youtube } from "lucide-react";
import { Container } from "@/src/shared/ui";

const heroContent = {
  tag: "단일 구독, 무제한 디자인",
  lineOne: "아이디어를 디지털로",
  lineTwo: "생생하게 구현",
  ctaPrimary: "지금 시작하기",
  ctaSecondary: "작업 보기",
  socials: {
    instagramLabel: "인스타그램",
    blogLabel: "블로그",
    youtubeLabel: "유튜브",
  },
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoWrapRef.current) {
      return;
    }

    const updateCutoff = () => {
      const section = sectionRef.current;
      const videoWrap = videoWrapRef.current;
      if (!section || !videoWrap) {
        return;
      }

      const start = 0;
      const height = 900;

      section.style.setProperty("--dot-start", `${start}px`);
      section.style.setProperty("--dot-height", `${height}px`);
    };

    updateCutoff();

    const observer = new ResizeObserver(updateCutoff);
    observer.observe(videoWrapRef.current);

    window.addEventListener("resize", updateCutoff);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCutoff);
    };
  }, []);

  const charStep = 45;
  const lineGap = 200;
  const lineOne = heroContent.lineOne;
  const lineTwo = heroContent.lineTwo;

  const renderTypeLine = (text: string, delayMs: number) => (
    <span
      className="hero-type-line"
      style={{ "--line-delay": `${delayMs}ms` } as CSSProperties}
    >
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="hero-type-char"
          style={{ "--i": index } as CSSProperties}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="hero-section relative overflow-hidden"
    >
      <div className="hero-content">
        <Container>
          <div className="relative grid gap-8 py-12 pb-12 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-14 md:pb-20 lg:pb-14">
            <div className="space-y-8">
              <span className="hero-tag inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-900">
                <span className="hero-tag-line" aria-hidden />
                {heroContent.tag}
              </span>
              <h1 className="hero-title text-4xl font-semibold leading-tight text-slate-900 md:text-7xl">
                {renderTypeLine(lineOne, 0)}
                {renderTypeLine(lineTwo, lineOne.length * charStep + lineGap)}
              </h1>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link
                  href="/sections"
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:px-7 md:py-3.5 md:text-base"
                >
                  {heroContent.ctaPrimary}
                </Link>
                <Link
                  href="/sections"
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-500 md:px-7 md:py-3.5 md:text-base"
                >
                  {heroContent.ctaSecondary}
                </Link>
              </div>
            </div>
            <div className="relative flex flex-col items-end gap-8">
              <div className="hero-socials absolute right-0 -bottom-8 flex items-center gap-3 text-xs text-slate-500 lg:static lg:mt-auto">
                <span className="hero-divider" aria-hidden />
                <Link
                  href="/#"
                  className="hero-social"
                  aria-label={heroContent.socials.instagramLabel}
                >
                  <Instagram size={16} />
                </Link>
                <Link
                  href="/#"
                  className="hero-social"
                  aria-label={heroContent.socials.blogLabel}
                >
                  <Rss size={16} />
                </Link>
                <Link
                  href="/#"
                  className="hero-social"
                  aria-label={heroContent.socials.youtubeLabel}
                >
                  <Youtube size={16} />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 mb-10 md:mt-6" ref={videoWrapRef}>
            <div className="aspect-video w-full overflow-hidden bg-slate-50">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/videos/hero-sample.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
