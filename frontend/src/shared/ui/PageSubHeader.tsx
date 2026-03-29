import type { ReactNode } from "react";

type PageSubHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
};

function cn(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function PageSubHeader({ title, description, actions, className, contentClassName }: PageSubHeaderProps) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white", className)}>
      <div className={cn("flex flex-col items-start gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between", contentClassName)}>
        <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h1>
          {description ? <p className="max-w-full truncate text-sm text-slate-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}
