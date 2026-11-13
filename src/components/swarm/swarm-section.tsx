"use client";

import type { SwarmShape } from "@/lib/swarm-bus";
import { useEffect, useRef, type ReactNode } from "react";

/** While this block crosses the middle of the screen, the swarm takes `shape`. */
export function SwarmSection({
  shape,
  children,
  className,
  id,
}: {
  shape: SwarmShape;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.dispatchEvent(new CustomEvent("swarm:section", { detail: shape }));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shape]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
