"use client";

import type { ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { PageSubHeader } from "@/src/shared/ui";

type MobileFilterToggleLabel = {
  open: string;
  close: string;
};

type OrgMenuPageTemplateProps = {
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  errorMessage?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyState?: ReactNode;
  className?: string;
  mobileFilterToggleLabel?: MobileFilterToggleLabel;
};

function cn(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

const defaultMobileFilterToggleLabel: MobileFilterToggleLabel = {
  open: "검색/통계 열기",
  close: "검색/통계 닫기",
};

export default function OrgMenuPageTemplate({
  title,
  description,
  primaryAction,
  sidebar,
  children,
  errorMessage,
  isLoading,
  isEmpty,
  emptyState,
  className,
  mobileFilterToggleLabel = defaultMobileFilterToggleLabel,
}: OrgMenuPageTemplateProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-white", className)}>
      <PageSubHeader
        title={title}
        description={description}
        className="sticky top-0 z-20 rounded-none border-x-0 border-t-0 bg-white"
        contentClassName="gap-2 px-4 py-3"
        actions={primaryAction}
      />

      <div className="border-b border-slate-200 p-2 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700"
          aria-label={isMobileSidebarOpen ? mobileFilterToggleLabel.close : mobileFilterToggleLabel.open}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-[80] flex justify-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-950/20"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label={mobileFilterToggleLabel.close}
          />
          <section className="relative z-20 flex h-full w-[84vw] max-w-xs flex-col border-l border-slate-200 bg-white shadow-xl">
            <div className="flex h-12 items-center justify-between border-b border-slate-200 px-3">
              <p className="text-sm font-semibold text-slate-900">검색/통계</p>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700"
                aria-label={mobileFilterToggleLabel.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">{sidebar}</div>
          </section>
        </div>
      ) : null}

      <div className="min-h-0 flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-0 flex-1 overflow-y-auto border-b border-slate-200 lg:overflow-hidden lg:border-b-0 lg:border-r">
          {errorMessage ? <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{errorMessage}</div> : null}

          {isLoading ? (
            <div className="space-y-2 p-4">
              <div className="h-10 animate-pulse bg-slate-100" />
              <div className="h-10 animate-pulse bg-slate-100" />
              <div className="h-10 animate-pulse bg-slate-100" />
            </div>
          ) : null}

          {!isLoading && isEmpty ? emptyState : null}
          {!isLoading && !isEmpty ? children : null}
        </div>

        <aside className="hidden border-l border-slate-200 lg:block">
          <div className="sticky top-0">{sidebar}</div>
        </aside>
      </div>
    </div>
  );
}
