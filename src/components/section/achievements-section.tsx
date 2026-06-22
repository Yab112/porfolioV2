import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import Link from "next/link";

const BLUR_DELAY = 0.04;

export default function AchievementsSection() {
  const items = DATA.achievements;
  if (!items.length) return null;

  return (
    <section id="achievements" className="mt-12 mb-4">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_DELAY * 8.5}>
          <h2 className="text-xl font-bold">Achievements</h2>
        </BlurFade>

        <BlurFade delay={BLUR_DELAY * 9}>
          <div className="flex flex-col divide-y divide-border border-y border-border">
            {items.map((item) => (
              <div key={item.title} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:gap-8">
                <div className="flex shrink-0 items-center gap-3 sm:w-48">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {item.organization}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground/50">
                    {item.year}
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
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
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
