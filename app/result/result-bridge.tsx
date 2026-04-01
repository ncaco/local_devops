"use client";

import { useEffect } from "react";

type ResultBridgeProps = {
  payload: string;
};

export function ResultBridge({ payload }: ResultBridgeProps) {
  useEffect(() => {
    if (!window.opener) {
      return;
    }

    window.opener.postMessage(
      {
        source: "instagram-oauth-popup",
        payload
      },
      window.location.origin
    );

    window.close();
  }, [payload]);

  return null;
}
