"use client";

import { cn } from "@/lib/utils";
import { useRef, type HTMLAttributes, type PointerEvent } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Max tilt in degrees; 0 disables the 3D tilt and keeps only the spotlight. */
  tilt?: number;
}

/** Glass card: pointer-tracked spotlight + gradient border, with optional 3D tilt. */
export function SpotlightCard({ className, children, tilt = 0, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--sx", `${x}px`);
    el.style.setProperty("--sy", `${y}px`);
    if (tilt) {
      const rx = (0.5 - y / r.height) * tilt;
      const ry = (x / r.width - 0.5) * tilt;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    }
  };

  const onLeave = () => {
    if (ref.current && tilt) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("spotlight-card", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
