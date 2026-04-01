"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

const POPUP_WIDTH = 520;
const POPUP_HEIGHT = 760;

export function InstagramLoginButton() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.source !== "instagram-oauth-popup") {
        return;
      }

      setMessage(String(event.data.payload ?? ""));
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function openPopup(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const left = window.screenX + Math.max(0, (window.outerWidth - POPUP_WIDTH) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - POPUP_HEIGHT) / 2);
    const features = [
      `width=${POPUP_WIDTH}`,
      `height=${POPUP_HEIGHT}`,
      `left=${Math.round(left)}`,
      `top=${Math.round(top)}`,
      "popup=yes",
      "resizable=yes",
      "scrollbars=yes"
    ].join(",");

    const popup = window.open("/api/auth/instagram", "instagram-oauth", features);

    if (!popup) {
      window.location.href = "/api/auth/instagram";
    }
  }

  return (
    <div className="stack">
      <a
        className="button"
        href="/api/auth/instagram"
        target="instagram-oauth"
        rel="noreferrer"
        onClick={openPopup}
      >
        Continue with Instagram
      </a>
      {message ? <div className="result">{message}</div> : null}
    </div>
  );
}
