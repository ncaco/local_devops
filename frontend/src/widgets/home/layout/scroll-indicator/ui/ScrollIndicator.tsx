"use client";

import { useEffect } from "react";

export default function ScrollIndicator() {
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const progress = total > 0 ? doc.scrollTop / total : 0;
      doc.style.setProperty("--scroll-progress", `${progress}`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="scroll-indicator hidden md:block" aria-hidden>
      <div className="scroll-indicator__fill" />
    </div>
  );
}
