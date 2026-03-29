import type { ReactNode } from "react";

export default function SectionHeading({
  label,
  title,
  description,
  actions,
}: {
  label: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {label}
      </span>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
