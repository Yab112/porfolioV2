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
    <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-5", className)}>
      <div className="max-w-2xl space-y-4">
        <p className="section-kicker">{kicker}</p>
        <h2 className="poster text-balance text-5xl sm:text-6xl">{title}</h2>
        {description ? <p className="text-base leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="act">
          {hrefLabel} <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );
}
