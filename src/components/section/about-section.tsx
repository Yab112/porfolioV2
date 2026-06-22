"use client";

import { useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { InfiniteMarquee } from "@/components/ui/infinite-marquee";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

const BLUR_DELAY = 0.04;

export default function AboutSection() {
  const [active, setActive] = useState<number | null>(0);
  const serviceNames = DATA.aboutFocusAreas.map((a) => a.title);

  return (
    <section id="about">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>

        <div className="py-2 -mx-4 md:-mx-6">
          <InfiniteMarquee items={serviceNames} speed="normal" direction="left" />
        </div>

        <BlurFade delay={BLUR_DELAY * 5}>
          <div className="border-y border-border divide-y divide-border">
              {DATA.aboutFocusAreas.map((area, i) => {
                const isOpen = active === i;
                return (
                  <div key={area.title}>
                    <button
                      type="button"
                      onClick={() => setActive(isOpen ? null : i)}
                      className="w-full flex items-center gap-4 py-4 text-left group"
                    >
                      <span className="text-[11px] font-mono tabular-nums shrink-0 text-muted-foreground/40 w-5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-sm font-semibold transition-colors duration-200",
                          isOpen
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {area.title}
                      </span>
                      <span
                        className={cn(
                          "text-xl font-light text-muted-foreground transition-transform duration-300 select-none leading-none",
                          isOpen ? "rotate-45" : "rotate-0"
                        )}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isOpen ? "max-h-[200px] pb-5" : "max-h-0"
                      )}
                    >
                      <div className="pl-9 pr-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {area.whatIBring}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </BlurFade>
      </div>
    </section>
  );
}
