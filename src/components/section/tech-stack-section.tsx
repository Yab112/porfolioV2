"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import { DATA } from "@/data/resume";
import { getTechLogoUrl } from "@/lib/tech-logos";
import { getWikiUrl } from "@/lib/wiki-links";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

const BLUR_DELAY = 0.04;

const tagClass =
  "inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary";

function TechItemChip({ item }: { item: string }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const wikiUrl = getWikiUrl(item);
  const logoUrl = getTechLogoUrl(item);
  const showLogo = logoUrl && !logoFailed;

  const inner = (
    <>
      {showLogo ? (
        <img
          src={logoUrl}
          alt=""
          width={18}
          height={18}
          className="size-[18px] shrink-0 object-contain dark:opacity-90"
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      ) : null}
      <span>{item}</span>
      {wikiUrl ? (
        <ExternalLink className="h-3 w-3 opacity-60 shrink-0" aria-hidden />
      ) : null}
    </>
  );

  if (wikiUrl) {
    return (
      <a
        href={wikiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(tagClass, "hover:underline hover:underline-offset-2")}
      >
        {inner}
      </a>
    );
  }

  return <span className={tagClass}>{inner}</span>;
}

export default function TechStackSection() {
  return (
    <section id="skills" className="mt-12 mb-4">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_DELAY * 9}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Tech Stack</h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Technical terms link to Wikipedia; click to learn more.
            </p>
          </div>
        </BlurFade>
        <div className="grid gap-8 sm:grid-cols-2">
          {DATA.techStack.map((group, groupIndex) => (
            <BlurFade
              key={group.label}
              delay={BLUR_DELAY * 10 + groupIndex * 0.05}
              className="h-full"
            >
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <TextWithWikiLinks text={group.description} />
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {group.items.map((item) => (
                    <TechItemChip key={item} item={item} />
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
