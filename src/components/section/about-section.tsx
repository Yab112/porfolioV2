import { DATA } from "@/data/resume";

/** The four disciplines as a ruled index: what I bring, and the proof next to it. */
export default function AboutSection() {
  return (
    <div>
      {DATA.aboutFocusAreas.map((area, i) => (
        <article key={area.title} className="row grid gap-x-8 gap-y-3 py-7 md:grid-cols-[3rem_minmax(0,1fr)]">
          <span className="font-mono text-xs tabular-nums text-signal">0{i + 1}</span>
          <div className="space-y-3">
            <h3 className="poster text-3xl sm:text-4xl">{area.title}</h3>
            <p className="max-w-xl leading-relaxed">{area.whatIBring}</p>
            <p className="max-w-xl border-l-2 border-[var(--purple)] pl-4 text-sm leading-relaxed text-muted-foreground">
              {area.whyGood}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
