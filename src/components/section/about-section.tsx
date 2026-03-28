"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import { InfiniteMarquee } from "@/components/ui/infinite-marquee";
import { DATA } from "@/data/resume";

const BLUR_DELAY = 0.04;

/** First sentence of a string (for one-line listing). */
function firstLine(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  return match ? match[0].trim() : text.slice(0, 80) + (text.length > 80 ? "…" : "");
}

export default function AboutSection() {
  const serviceNames = DATA.aboutFocusAreas.map((a) => a.title);

  return (
    <section id="about">
      <div className="flex min-h-0 flex-col gap-y-8">
        <BlurFade delay={BLUR_DELAY * 3}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">About</h2>
          </div>
        </BlurFade>

        {/* Infinite scroll: not wrapped in BlurFade so parent transform/filter does not break CSS marquee */}
        <div className="py-2 -mx-4 md:-mx-6">
          <InfiniteMarquee items={serviceNames} speed="normal" direction="left" />
        </div>

        {/* Short intro: one line, links for terms */}
        <BlurFade delay={BLUR_DELAY * 4}>
          <p className="text-pretty font-sans leading-relaxed text-muted-foreground text-sm sm:text-base max-w-full">
            <TextWithWikiLinks text={DATA.summary} showHint />
          </p>
        </BlurFade>

        {/* What I bring: one-line list; full content in details for SEO */}
        <div className="space-y-4 pt-2">
          <BlurFade delay={BLUR_DELAY * 5}>
            <h3 className="text-xl font-bold">
              What I bring
            </h3>
          </BlurFade>
          <ul className="space-y-3 list-none p-0 m-0">
            {DATA.aboutFocusAreas.map((area, i) => (
              <BlurFade key={area.title} delay={BLUR_DELAY * 6 + i * 0.04}>
                <li className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-foreground shrink-0">
                      {area.title}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      · {firstLine(area.whatIBring)}
                    </span>
                  </div>
                  <details className="group/details">
                    <summary className="text-xs text-muted-foreground/80 cursor-pointer list-none inline-flex items-center gap-1 hover:text-foreground/80 transition-colors [&::-webkit-details-marker]:hidden">
                      <span className="group-open/details:rotate-90 transition-transform inline-block">
                        →
                      </span>
                      <span>More</span>
                    </summary>
                    <div className="pl-4 mt-2 space-y-1 text-sm text-muted-foreground">
                      <p className="leading-relaxed">
                        <TextWithWikiLinks text={area.whatIBring} />
                      </p>
                      <p className="text-xs italic">{area.whyGood}</p>
                    </div>
                  </details>
                </li>
              </BlurFade>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
