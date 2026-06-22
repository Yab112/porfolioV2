import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
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
import { TracingBeam } from "@/components/ui/tracing-beam";
import { EducationLogo } from "@/components/education-logo";
import { ArrowUpRight } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

const LOGO_COLOR = "/Logo Color Version@700x.png";
const LOGO_WHITE = "/Logo white Version@700x.png";
const ICON_COLOR = "/Icon Color Version@700x.png";
const ICON_WHITE = "/Icon White Version@700x.png";

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
    <main className="min-h-dvh flex flex-col gap-16 relative ">
      <section id="hero" className="relative overflow-hidden rounded-3xl">
        {/* Brand pattern background */}
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.06] bg-repeat bg-[length:280px] bg-pattern-light dark:bg-pattern-dark"
          aria-hidden
        />
        <div className="relative mx-auto w-full py-8 md:py-12">
          {/* Full logo + text side by side (hero) */}
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <BlurFade delay={BLUR_FADE_DELAY} className="shrink-0">
              <div className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[220px] lg:max-w-[280px] aspect-[2/1] md:aspect-auto md:h-24 lg:h-28 rounded-2xl border border-border overflow-hidden bg-card/80 backdrop-blur-sm flex items-center justify-center p-4">
                <img
                  src={LOGO_COLOR}
                  alt=""
                  className="w-full h-full object-contain dark:hidden"
                  width={280}
                  height={140}
                />
                <img
                  src={LOGO_WHITE}
                  alt=""
                  className="w-full h-full object-contain hidden dark:block"
                  width={280}
                  height={140}
                />
              </div>
            </BlurFade>
            <div className="flex-1 min-w-0 space-y-2">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl text-foreground"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFade delay={BLUR_FADE_DELAY}>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
                  <TextWithWikiLinks text={DATA.description} />
                </p>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>
      <TracingBeam className="pl-12 md:pl-16">
        <AboutSection />
      <section id="work" className="mt-12 mb-4">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Work Experience</h2>
              <Link
                href="/work"
                className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                See all →
              </Link>
            </div>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection limit={3} />
          </BlurFade>
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Education</h2>
            </div>
          </BlurFade>
          <div className="flex flex-col gap-8">
            {DATA.education.map((education, index) => (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 8 + index * 0.05}
              >
                <div className="flex flex-col gap-3">
                  <Link
                    href={education.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-4 justify-between group"
                  >
                    <div className="flex items-center gap-x-4 flex-1 min-w-0">
                      <EducationLogo logoUrl={education.logoUrl} />
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="font-semibold leading-none flex items-center gap-2">
                          {education.school}
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                        </div>
                        <div className="font-sans text-sm text-muted-foreground">
                          {education.degree}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                      <span>
                        {education.start} - {education.end}
                      </span>
                    </div>
                  </Link>
                  {"description" in education && education.description ? (
                    <p className="text-sm text-muted-foreground leading-relaxed pl-[3.5rem] sm:pl-14 max-w-2xl">
                      <TextWithWikiLinks text={education.description} />
                    </p>
                  ) : null}
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <AchievementsSection />
      <TechStackSection />
      <section id="projects" className="max-w-4xl mx-auto mb-4">
        <ProjectsSection limit={4} />
      </section>
      <HobbiesSection />
      </TracingBeam>

      <TodaysMistakeCard />

      <TracingBeam className="pl-12 md:pl-16">
        <section id="contact">
          <BlurFade delay={BLUR_FADE_DELAY * 17}>
            <ContactSection />
          </BlurFade>
        </section>
      </TracingBeam>
    </main>
  );
}
