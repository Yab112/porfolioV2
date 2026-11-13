import { EducationLogo } from "@/components/education-logo";
import { SectionHeading } from "@/components/fx/section-heading";
import { PageIntro } from "@/components/page-intro";
import AchievementsSection from "@/components/section/achievements-section";
import HobbiesSection from "@/components/section/hobbies-section";
import TechStackSection from "@/components/section/tech-stack-section";
import WorkSection from "@/components/section/work-section";
import TodaysMistakeCard from "@/components/todays-mistake-card";
import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Background of Yabibal Eshetie Molla: experience across AI engineering, automation and multi-tenant SaaS, education, tech stack and life outside work.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `About | ${DATA.name}`, description, url: `${DATA.url.replace(/\/$/, "")}/about` },
};

export default function AboutPage() {
  return (
    <main className="space-y-32">
      <PageIntro
        index="02"
        title={
          <>
            Engineer, <span className="text-ink-purple">end to end.</span>
          </>
        }
      >
        {DATA.summary.split("\n\n").map((p) => (
          <p key={p.slice(0, 24)} className="mb-4 last:mb-0">
            {p}
          </p>
        ))}
      </PageIntro>

      <section id="experience" className="space-y-10">
        <SectionHeading kicker="Experience" title="Where I have shipped." />
        <div className="spotlight-card p-5 sm:p-8">
          <WorkSection />
        </div>
      </section>

      <TechStackSection />

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-10">
        <section id="education" className="space-y-8">
          <SectionHeading kicker="Education" title="Foundations." />
          {DATA.education.map((education) => (
            <div key={education.school} className="spotlight-card space-y-4 p-6">
              <Link
                href={education.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <EducationLogo logoUrl={education.logoUrl} />
                  <span className="min-w-0">
                    <span className="block font-semibold">{education.school}</span>
                    <span className="block text-sm text-muted-foreground">{education.degree}</span>
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {education.start} - {education.end}
                </span>
              </Link>
              {"description" in education && education.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <TextWithWikiLinks text={education.description} />
                </p>
              ) : null}
            </div>
          ))}
        </section>
        <AchievementsSection />
      </div>

      <HobbiesSection />
      <TodaysMistakeCard />
    </main>
  );
}
