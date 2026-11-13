"use client";

import { useEffect, useRef } from "react";

/** Fixed aurora + grid + grain backdrop with a soft glow that trails the pointer. */
export function SiteBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="site-backdrop" aria-hidden>
      <div className="site-backdrop__blob site-backdrop__blob--a" />
      <div className="site-backdrop__blob site-backdrop__blob--b" />
      <div className="site-backdrop__blob site-backdrop__blob--c" />
      <div className="site-backdrop__grid" />
      <div className="site-backdrop__cursor" />
      <div className="site-backdrop__grain" />
    </div>
  );
}
