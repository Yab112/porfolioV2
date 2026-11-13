import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  description,
  href,
  hrefLabel = "See all",
  className,
}: {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-4", className)}>
      <div className="max-w-2xl space-y-3">
        <p className="section-kicker">{kicker}</p>
        <h2 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {description ? (
          <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          {hrefLabel}
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
