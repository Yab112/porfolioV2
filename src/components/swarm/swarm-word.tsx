"use client";

import { useEffect } from "react";

/** While this page is open, the swarm spells `text` (one short word). */
export function SwarmWord({ text }: { text: string }) {
  useEffect(() => {
    const word = text.replace(/[^\p{L}\p{N}+#.]/gu, "").slice(0, 14);
    if (!word) return;
    const shape = `word:${word}`;
    const w = window as unknown as { __swarmSection?: string | null };
    w.__swarmSection = shape;
    window.dispatchEvent(new CustomEvent("swarm:section", { detail: shape }));
    return () => {
      if (w.__swarmSection === shape) w.__swarmSection = null;
    };
  }, [text]);
  return null;
}
