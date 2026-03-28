"use client";

import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}

const speedMap = { slow: "40s", normal: "25s", fast: "15s" };

export function InfiniteMarquee({
  items,
  className,
  itemClassName,
  speed = "normal",
  direction = "left",
}: InfiniteMarqueeProps) {
  const duration = speedMap[speed];
  const duplicate = [...items, ...items];

  return (
    <div className={cn("overflow-x-hidden select-none", className)} aria-hidden>
      <div
        className="marquee-track flex w-max gap-8 whitespace-nowrap will-change-transform"
        style={{
          animation: `marquee ${duration} linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {duplicate.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className={cn(
              "text-sm font-medium text-muted-foreground/90 px-3 py-1.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm",
              "hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors",
              itemClassName
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
