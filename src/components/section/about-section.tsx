import { Reveal } from "@/components/fx/reveal";
import { SectionHeading } from "@/components/fx/section-heading";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { BrainCircuit, Layers, Network, Workflow, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Layers, BrainCircuit, Workflow, Network];
// Bento rhythm on large screens: wide / narrow, then narrow / wide.
const SPANS = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3"];

export default function AboutSection() {
  return (
    <section id="about" className="space-y-10">
      <Reveal>
        <SectionHeading
          kicker="What I do"
          title={
            <>
              Four disciplines, <span className="text-gradient">one engineer</span> accountable for the outcome.
            </>
          }
        />
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DATA.aboutFocusAreas.map((area, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={area.title} delay={i * 0.07} className={cn("h-full", SPANS[i % SPANS.length])}>
              <SpotlightCard className="group flex h-full flex-col gap-5 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-background/60 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="space-y-2.5">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{area.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{area.whatIBring}</p>
                </div>
                <p className="mt-auto border-t border-border/70 pt-4 text-[13px] leading-relaxed text-muted-foreground/90">
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Proof</span>
                  {area.whyGood}
                </p>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
