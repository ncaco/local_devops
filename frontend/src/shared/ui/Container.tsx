import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-10 sm:px-12 lg:px-16">
      {children}
    </div>
  );
}
