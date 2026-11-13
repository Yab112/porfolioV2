import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { SectionHeading } from "@/components/fx/section-heading";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import Link from "next/link";

const BLUR_DELAY = 0.04;

export default function AchievementsSection() {
  const items = DATA.achievements;
  if (!items.length) return null;

  return (
    <section id="achievements">
      <div className="flex min-h-0 flex-col gap-y-8">
        <BlurFade delay={BLUR_DELAY * 8.5}>
          <SectionHeading kicker="Recognition" title="Achievements." />
        </BlurFade>

        <BlurFade delay={BLUR_DELAY * 9}>
          <SpotlightCard className="flex flex-col divide-y divide-border px-6">
            {items.map((item) => (
              <div key={item.title} className="flex flex-col gap-1 py-6">
                <div className="mb-2 flex shrink-0 items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {item.organization}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground/50">
                    {item.year}
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-semibold text-foreground">{item.title}</span>
                    {item.url && (
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-wider text-primary hover:underline"
                      >
                        ↗
                      </Link>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </SpotlightCard>
        </BlurFade>
      </div>
    </section>
  );
}
