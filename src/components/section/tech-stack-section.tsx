"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { getTechLogoUrl } from "@/lib/tech-logos";
import { getWikiUrl } from "@/lib/wiki-links";
import { cn } from "@/lib/utils";
import { useState } from "react";

const BLUR_DELAY = 0.04;

const N8N_AMBASSADOR = new Set(["n8n"]);

function TechChip({ item }: { item: string }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const wikiUrl = getWikiUrl(item);
  const logoUrl = getTechLogoUrl(item);
  const showLogo = logoUrl && !logoFailed;
  const isAmbassador = N8N_AMBASSADOR.has(item);

  const inner = (
    <>
      {showLogo && (
        <img
          src={logoUrl}
          alt=""
          width={14}
          height={14}
          className="size-[14px] shrink-0 object-contain dark:opacity-90"
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      )}
      <span>{item}</span>
      {isAmbassador && (
        <span className="rounded-full bg-primary/15 px-1.5 py-px font-mono text-[8px] uppercase tracking-widest text-primary">
          Ambassador
        </span>
      )}
    </>
  );

  const chipClass = cn(
    "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground transition-colors",
    wikiUrl && "hover:border-primary/40 hover:bg-muted hover:text-primary"
  );

  if (wikiUrl) {
    return (
      <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className={chipClass}>
        {inner}
      </a>
    );
  }

  return <span className={chipClass}>{inner}</span>;
}

export default function TechStackSection() {
  return (
    <section id="skills" className="mt-12 mb-4">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_DELAY * 9}>
          <h2 className="text-xl font-bold">Tech Stack</h2>
        </BlurFade>

        <div className="flex flex-col divide-y divide-border border-y border-border">
          {DATA.techStack.map((group, i) => (
            <BlurFade key={group.label} delay={BLUR_DELAY * 10 + i * 0.04}>
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:gap-8">
                <p className="w-full shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 sm:w-36">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <TechChip key={item} item={item} />
                  ))}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
