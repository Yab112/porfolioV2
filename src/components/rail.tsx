"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { DATA } from "@/data/resume";
import { requestShape, STATIONS, stationForPath } from "@/lib/swarm-bus";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Site navigation as a measuring rail: numbered stations along the left edge
 * (bottom edge on phones). Hovering a station makes the swarm preview where
 * you are about to go; number keys 0–5 jump straight there.
 */
export default function Rail() {
  const pathname = usePathname();
  const router = useRouter();
  const active = stationForPath(pathname);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const st = STATIONS.find((s) => s.key === e.key);
      if (st) router.push(st.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed z-40 flex border-border bg-background/90 backdrop-blur-sm",
        "inset-x-0 bottom-0 h-14 items-stretch border-t",
        "lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-[4.5rem] lg:flex-col lg:border-r lg:border-t-0"
      )}
    >
      <Link
        href="/"
        aria-label={`${DATA.name} — home`}
        className="poster hidden h-[4.5rem] shrink-0 items-center justify-center border-b border-border text-2xl text-ink-purple lg:flex"
      >
        Y<span className="text-signal">E</span>
      </Link>

      <ol className="flex flex-1 items-stretch lg:flex-col lg:justify-center">
        {STATIONS.map((st) => {
          const on = st.href === active.href;
          return (
            <li key={st.href} className="relative flex-1 lg:flex-none">
              <Link
                href={st.href}
                aria-current={on ? "page" : undefined}
                onPointerEnter={(e) => e.pointerType === "mouse" && requestShape(st.shape)}
                onPointerLeave={(e) => e.pointerType === "mouse" && requestShape(null)}
                onFocus={() => requestShape(st.shape)}
                onBlur={() => requestShape(null)}
                className={cn(
                  "group relative flex h-full flex-col items-center justify-center gap-0.5 outline-none transition-colors",
                  "lg:h-[4.25rem]",
                  on ? "text-foreground" : "text-muted-foreground hover:text-foreground focus-visible:text-foreground"
                )}
              >
                {/* station marker */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bg-signal transition-transform duration-300",
                    "inset-x-0 top-0 h-[3px] origin-left lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[3px] lg:origin-top",
                    on ? "scale-100" : "scale-0 group-hover:scale-100 group-focus-visible:scale-100"
                  )}
                />
                <span className={cn("font-mono text-[10px] tabular-nums", on && "text-signal")}>0{st.key}</span>
                <span className="font-mono text-[9px] uppercase tracking-normal lg:text-[10px] lg:tracking-[0.14em]">{st.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="flex shrink-0 items-center border-l border-border lg:flex-col lg:border-l-0 lg:border-t">
        <button
          type="button"
          aria-label="Search the site (Ctrl or Command + K)"
          onClick={() => window.dispatchEvent(new CustomEvent("palette:open"))}
          className="flex h-14 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-signal lg:h-12 lg:w-full"
        >
          <Search className="size-4" aria-hidden />
        </button>
        <div className="relative flex h-14 w-12 items-center justify-center text-muted-foreground lg:h-12 lg:w-full">
          <ModeToggle className="size-9 rounded-none hover:bg-transparent hover:text-signal" />
        </div>
      </div>
    </nav>
  );
}
