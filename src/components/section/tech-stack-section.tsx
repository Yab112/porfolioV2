"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { getTechLogoUrl } from "@/lib/tech-logos";
import { getWikiUrl } from "@/lib/wiki-links";
import { SectionHeading } from "@/components/fx/section-heading";
import { SpotlightCard } from "@/components/fx/spotlight-card";
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
        <span className="rounded-none bg-primary/15 px-1.5 py-px font-mono text-[8px] uppercase tracking-widest text-primary">
          Ambassador
        </span>
      )}
    </>
  );

  const chipClass = cn(
    "inline-flex items-center gap-1.5 relative z-10 rounded-none border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors",
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
    <section id="skills">
      <div className="flex min-h-0 flex-col gap-y-10">
        <BlurFade delay={BLUR_DELAY * 9}>
          <SectionHeading kicker="Toolbox" title="The stack I reach for." />
        </BlurFade>

        <div className="grid gap-4 md:grid-cols-2">
          {DATA.techStack.map((group, i) => (
            <BlurFade key={group.label} delay={BLUR_DELAY * 4 + i * 0.05} className="h-full">
              <SpotlightCard className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="poster text-2xl tracking-tight">{group.label}</h3>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
                    {String(group.items.length).padStart(2, "0")} tools
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{group.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {group.items.map((item) => (
                    <TechChip key={item} item={item} />
                  ))}
                </div>
              </SpotlightCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
