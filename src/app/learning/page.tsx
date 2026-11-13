import { DescentLab } from "@/components/descent-lab";
import { SectionHeading } from "@/components/fx/section-heading";
import { PageIntro } from "@/components/page-intro";
import { LEARNING } from "@/data/learning";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";

const description =
  "What Yabibal Eshetie is studying now: mathematics, Python and core machine learning, then deep learning. Includes an interactive gradient descent playground.";

export const metadata: Metadata = {
  title: "Lab",
  description,
  alternates: { canonical: "/learning" },
  openGraph: { title: `Lab | ${DATA.name}`, description, url: `${DATA.url.replace(/\/$/, "")}/learning` },
};

const STATUS_LABEL = { done: "done", "in-progress": "in progress", next: "next" } as const;

export default function LearningPage() {
  return (
    <main className="space-y-28">
      <PageIntro
        index="03"
        title={
          <>
            Currently <span className="text-ink-purple">training.</span>
          </>
        }
      >
        <p>{LEARNING.intro}</p>
      </PageIntro>

      <section className="space-y-10">
        <SectionHeading
          kicker="Playground"
          title="Descend it yourself."
          description="This is the idea every model I deploy is built on. Pick a starting point, choose a learning rate, and see whether the optimiser finds a valley or flies off the map."
        />
        <DescentLab />
      </section>

      <section className="space-y-10">
        <SectionHeading kicker={`Curriculum · ${LEARNING.platform}`} title="The syllabus." />
        <ol>
          {LEARNING.tracks.map((t, i) => (
            <li key={t.title} className="row grid gap-x-8 gap-y-3 py-7 md:grid-cols-[3rem_minmax(0,1fr)_auto]">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">0{i + 1}</span>
              <div className="space-y-3">
                <h3 className="poster text-3xl sm:text-4xl">{t.title}</h3>
                <p className="max-w-xl leading-relaxed text-muted-foreground">{t.why}</p>
                <p className="flex flex-wrap gap-1.5">
                  {t.topics.map((topic) => (
                    <span key={topic} className="tag">
                      {topic}
                    </span>
                  ))}
                </p>
                {t.certificateUrl ? (
                  <a href={t.certificateUrl} target="_blank" rel="noopener noreferrer" className="act">
                    View certificate
                  </a>
                ) : null}
              </div>
              <span
                className={`font-mono text-[11px] uppercase tracking-wider ${
                  t.status === "next" ? "text-muted-foreground" : "text-signal"
                }`}
              >
                {STATUS_LABEL[t.status]}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
