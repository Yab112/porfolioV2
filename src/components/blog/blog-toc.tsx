"use client";

import type { TocItem } from "@/lib/blog-toc";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

type Section = TocItem & { number: number; children: TocItem[] };

/** Group `###` headings under their `##` section and number the sections. */
function toSections(items: TocItem[]): Section[] {
  const out: Section[] = [];
  for (const item of items) {
    if (item.level === 2 || out.length === 0) out.push({ ...item, level: 2, number: out.length + 1, children: [] });
    else out[out.length - 1].children.push(item);
  }
  return out;
}

/**
 * The post outline: numbered sections, the one you are reading marked and
 * expanded, and a bar showing how far through the article you are.
 */
export function BlogToc({ items, className }: { items: TocItem[]; className?: string }) {
  const sections = useMemo(() => toSections(items), [items]);
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const body = document.querySelector<HTMLElement>(".blog-body");
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!body || headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 120; // a heading counts as "current" once it passes this far from the top
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActive(current);
      const rect = body.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      setProgress(total > 0 ? Math.min(1, Math.max(0, (line - rect.top) / total)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  const activeSection = sections.find((s) => s.id === active || s.children.some((c) => c.id === active));
  const done = sections.findIndex((s) => s === activeSection);

  return (
    <nav aria-label="In this article" className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">In this article</span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{Math.round(progress * 100)}%</span>
      </div>
      <div className="mt-2 h-[3px] w-full bg-border" aria-hidden>
        <div className="h-full bg-[var(--green)] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      <ol className="mt-4 space-y-0.5">
        {sections.map((s, i) => {
          const isActive = s === activeSection;
          const isDone = done >= 0 && i < done;
          return (
            <li key={`${s.id}-${i}`}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "group grid grid-cols-[1.6rem_minmax(0,1fr)] items-baseline gap-1 border-l-2 py-1.5 pl-3 pr-1 text-[13px] leading-snug transition-colors",
                  isActive
                    ? "border-[var(--green)] bg-[var(--green)]/[0.07] font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <span className={cn("font-mono text-[11px] tabular-nums", isActive ? "text-[var(--green)]" : isDone ? "text-[var(--purple)]" : "opacity-60")}>
                  {isDone ? "✓" : String(s.number).padStart(2, "0")}
                </span>
                <span>{s.text}</span>
              </a>
              {isActive && s.children.length > 0 ? (
                <ol className="mb-1 ml-[2.35rem] mt-0.5 space-y-0.5 border-l border-border">
                  {s.children.map((c, j) => (
                    <li key={`${c.id}-${j}`}>
                      <a
                        href={`#${c.id}`}
                        className={cn(
                          "block py-1 pl-3 text-[12.5px] leading-snug transition-colors",
                          c.id === active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {c.text}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
