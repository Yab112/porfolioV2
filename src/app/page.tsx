import BlurFade from "@/components/magicui/blur-fade";
import { OG_ROUTES } from "@/data/seo-routes";
import { DATA } from "@/data/resume";
import Link from "next/link";
import type { Metadata } from "next";
import AboutSection from "@/components/section/about-section";
import TodaysMistakeCard from "@/components/todays-mistake-card";
import ContactSection from "@/components/section/contact-section";
import HobbiesSection from "@/components/section/hobbies-section";
import ProjectsSection from "@/components/section/projects-section";
import TechStackSection from "@/components/section/tech-stack-section";
import AchievementsSection from "@/components/section/achievements-section";
import WorkSection from "@/components/section/work-section";
import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import Hero from "@/components/hero";
import { PipelineStatus } from "@/components/pipeline-status";
import { Reveal } from "@/components/fx/reveal";
import { SectionHeading } from "@/components/fx/section-heading";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { EducationLogo } from "@/components/education-logo";
import { ArrowUpRight } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

const site = DATA.url.replace(/\/$/, "");
const homeOg = OG_ROUTES.home;
const homeOgImage = homeOg?.image ?? DATA.ogImage;
const homeOgAlt = homeOg?.alt ?? DATA.ogImageAlt;
const homeTitle = `${DATA.name} | Fullstack Engineer`;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: DATA.description,
    url: `${site}/`,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
    images: [{ url: homeOgImage, alt: homeOgAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: DATA.description,
    images: [homeOgImage],
  },
};

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-col gap-24 sm:gap-32">
      <Hero />

      <AboutSection />

      <section id="work" className="space-y-10">
        <Reveal>
          <SectionHeading
            kicker="Experience"
            title="Where I have shipped."
            href="/work"
            hrefLabel="Full history"
          />
        </Reveal>
        <Reveal delay={0.08}>
          <SpotlightCard className="p-5 sm:p-8">
            <WorkSection limit={3} />
          </SpotlightCard>
        </Reveal>
      </section>

      <ProjectsSection limit={4} />

      <Reveal>
        <PipelineStatus />
      </Reveal>

      <TechStackSection />

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
        <section id="education" className="space-y-8">
          <Reveal>
            <SectionHeading kicker="Education" title="Foundations." />
          </Reveal>
          <div className="flex flex-col gap-4">
            {DATA.education.map((education, index) => (
              <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + index * 0.05}>
                <SpotlightCard className="flex flex-col gap-4 p-6">
                  <Link
                    href={education.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-x-4"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-x-4">
                      <EducationLogo logoUrl={education.logoUrl} />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2 font-semibold leading-none">
                          {education.school}
                          <ArrowUpRight
                            className="h-3.5 w-3.5 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                            aria-hidden
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">{education.degree}</div>
                      </div>
                    </div>
                    <span className="flex-none font-mono text-xs tabular-nums text-muted-foreground">
                      {education.start} - {education.end}
                    </span>
                  </Link>
                  {"description" in education && education.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <TextWithWikiLinks text={education.description} />
                    </p>
                  ) : null}
                </SpotlightCard>
              </BlurFade>
            ))}
          </div>
        </section>
        <AchievementsSection />
      </div>

      <HobbiesSection />

      <TodaysMistakeCard />

      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}
