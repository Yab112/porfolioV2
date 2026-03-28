"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { Check, DotIcon } from "lucide-react";

const DEFAULT_COMPANY_ICON = "/Icon Color Version@700x.png";
const DEFAULT_COMPANY_ICON_WHITE = "/Icon White Version@700x.png";

/** Company logo on the left: custom `logoUrl` when set; otherwise your brand icon. */
function CompanyLogo({ logoUrl }: { logoUrl: string }) {
  const hasLogo = logoUrl && logoUrl.trim() !== "";
  const src = hasLogo ? logoUrl : DEFAULT_COMPANY_ICON;
  const srcDark = hasLogo ? undefined : DEFAULT_COMPANY_ICON_WHITE;

  return (
    <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] shrink-0 overflow-hidden flex items-center justify-center rounded-lg">
      {hasLogo ? (
        <img
          src={src}
          alt=""
          className="w-full h-full max-w-full max-h-full object-contain"
        />
      ) : (
        <>
          <img
            src={src}
            alt=""
            className="w-full h-full max-w-full max-h-full object-contain dark:hidden"
          />
          <img
            src={srcDark!}
            alt=""
            className="w-full h-full max-w-full max-h-full object-contain hidden dark:block"
          />
        </>
      )}
    </div>
  );
}

function isPlaceholder(value: string) {
  return !value || value.trim() === "";
}

function descriptionToBullets(description: string): string[] {
  return description
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function WorkSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const work = DATA.work;
  const selected = work[selectedIndex];
  const bullets = selected ? descriptionToBullets(selected.description) : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const detailRef = useRef<HTMLDivElement>(null);
  const [connector, setConnector] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const tab = tabRefs.current[selectedIndex];
      const detail = detailRef.current;
      if (!container || !tab || !detail) {
        setConnector(null);
        return;
      }
      const cr = container.getBoundingClientRect();
      const tr = tab.getBoundingClientRect();
      const dr = detail.getBoundingClientRect();
      // Underline sits near bottom of tab row (match text underline position)
      const underlineY = tr.bottom - cr.top - 10;
      const startX = tr.right - cr.left;
      const endX = dr.left - cr.left;
      const width = Math.max(0, endX - startX);
      setConnector({ left: startX, top: underlineY, width });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selectedIndex, work.length]);

  if (!work.length) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full md:flex md:flex-row md:items-stretch md:gap-0"
    >
      {/* Left: company logo + name only */}
      <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:shrink-0 md:min-w-[200px]">
        {work.map((w, i) => {
          const tabLabel = isPlaceholder(w.company) ? w.title : w.company;
          return (
            <button
              key={w.company + i}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "flex items-center gap-3 w-full min-w-[140px] md:min-w-0 text-left px-3 py-2.5 rounded-lg transition-colors",
                selectedIndex === i
                  ? "underline underline-offset-4 decoration-2 decoration-primary"
                  : "no-underline hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-primary/50"
              )}
            >
              <CompanyLogo logoUrl={w.logoUrl} />
              <span
                className={cn(
                  "font-medium text-sm truncate",
                  selectedIndex === i ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {tabLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Connector: horizontal line from active tab underline to description box border (md+) */}
      {connector && connector.width > 0 && (
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block h-0.5 bg-primary"
          style={{
            left: connector.left,
            top: connector.top,
            width: connector.width,
          }}
          aria-hidden
        />
      )}

    
      <div className="min-w-0 flex-1 md:pl-6 md:pt-0">
        <div
          ref={detailRef}
          className="relative min-w-0 h-full rounded-lg bg-background p-[1px] overflow-hidden"
        >
          {/* Animated looping light border */}
          <div className="absolute inset-[-1000%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,theme(colors.primary.DEFAULT)_30%,theme(colors.primary.DEFAULT)_50%,transparent_70%)]" />
          
          <div className="relative z-10 h-full w-full rounded-[calc(var(--radius)-1px)] bg-background overflow-hidden pt-4 pb-4 px-4 md:px-5">
            {/* Brand pattern background */}
            <div
              className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04] bg-repeat bg-[length:250px] bg-pattern-light dark:bg-pattern-dark pointer-events-none"
              aria-hidden
            />

            <div className="relative space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selected.title}
                  {!isPlaceholder(selected.company) && (
                    <span className="text-primary"> @ {selected.company}</span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5 tabular-nums">
                  {isPlaceholder(selected.start)
                    ? selected.end
                    : `${selected.start} - ${selected.end}`}
                </p>
                {selected.location && !isPlaceholder(selected.location) && (
                  <p className="text-sm text-muted-foreground">{selected.location}</p>
                )}
              </div>
              <ul className="space-y-2 list-none p-0 m-0">
                {bullets.map((line, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <DotIcon className="size-3 shrink-0 text-primary mt-1.5" aria-hidden />
                    <span className="leading-relaxed">
                      <TextWithWikiLinks text={line} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
