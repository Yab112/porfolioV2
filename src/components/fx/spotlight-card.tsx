import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Kept for call-site compatibility; cards no longer tilt. */
  tilt?: number;
}

/** Flat sheet card with registration marks; lifts onto a purple offset shadow on hover. */
export function SpotlightCard({ className, children, tilt: _tilt, ...rest }: Props) {
  return (
    <div className={cn("spotlight-card", className)} {...rest}>
      {children}
    </div>
  );
}
