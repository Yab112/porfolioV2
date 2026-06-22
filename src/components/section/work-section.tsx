"use client";

import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { useState } from "react";

function descriptionToBullets(description: string): string[] {
  return description
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function WorkSection({ limit }: { limit?: number }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const work = limit ? DATA.work.slice(0, limit) : DATA.work;
  const selected = work[selectedIndex];
  const bullets = selected ? descriptionToBullets(selected.description) : [];

  if (!work.length) return null;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      {/* Tab list */}
      <div className="flex shrink-0 gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0 md:w-44">
        {work.map((w, i) => {
          const isActive = selectedIndex === i;
          return (
            <button
              key={w.company + i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                "min-w-max md:min-w-0 md:w-full",
                isActive
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {w.company?.trim() || w.title}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="flex-1 min-w-0 space-y-4 border-l border-border pl-6 md:pl-8">
          <div>
            <h3 className="font-semibold text-foreground">
              {selected.title}
              {selected.company?.trim() && (
                <span className="text-primary"> · {selected.company}</span>
              )}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
              {[selected.start, selected.end].filter(Boolean).join(" — ")}
              {selected.location?.trim() ? ` · ${selected.location}` : ""}
            </p>
          </div>

          <ul className="space-y-2">
            {bullets.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <TextWithWikiLinks text={line} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
