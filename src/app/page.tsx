import { AddisClock } from "@/components/addis-clock";
import { SectionHeading } from "@/components/fx/section-heading";
import { PipelineStatus } from "@/components/pipeline-status";
import AboutSection from "@/components/section/about-section";
import { SwarmSection } from "@/components/swarm/swarm-section";
import { LEARNING } from "@/data/learning";
import { DATA } from "@/data/resume";
import { OG_ROUTES } from "@/data/seo-routes";
import type { Metadata } from "next";
import Link from "next/link";

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

const STATUS_LABEL = { done: "done", "in-progress": "in progress", next: "next" } as const;

export default function Page() {
  const [first, second] = DATA.name.split(" ");
  const featured = DATA.projects.slice(0, 5);

  return (
    <main className="relative">
      {/* 00 — the poster: the name, and the figure it annotates */}
      <SwarmSection
        shape="portrait"
        id="hero"
        className="flex min-h-[calc(100dvh-3.5rem)] flex-col justify-between gap-10 pb-10 pt-8 lg:min-h-dvh lg:pb-12 lg:pt-10"
      >
        <div className="note flex flex-wrap items-start justify-between gap-x-10 gap-y-3">
          <p>
            {DATA.headline}
            <br />
            LLM apps · agents · ML evaluation · multi-tenant SaaS
          </p>
          <p className="text-right max-lg:hidden">
            {DATA.location}
            <br />
            <AddisClock />
          </p>
          <p className="flex items-center gap-2 text-foreground">
            <span className="relative flex size-2">
              <span className="pulse-ring absolute inset-0 bg-signal [animation:pulse-ring_1.8s_ease-out_infinite]" />
              <span className="relative size-2 bg-signal" />
            </span>
            {DATA.availability}
          </p>
        </div>

        <div className="space-y-8">
          <h1 className="poster text-[clamp(4.25rem,17vw,15.5rem)]">
            {first}
            <br />
            <span className="text-ink-purple">{second}</span>
          </h1>

          <div className="grid gap-8 border-t border-border pt-7 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end">
            <p className="text-pretty text-lg leading-relaxed sm:text-xl">
              {DATA.statement} Three years shipping LLM applications, multi-agent automation and multi-tenant SaaS
              for international clients.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:justify-end">
              <Link href="/contact" className="act act-solid">
                Start a project <span aria-hidden>→</span>
              </Link>
              <Link href="/work" className="act">
                See the work
              </Link>
            </div>
          </div>
        </div>
      </SwarmSection>

      <div className="space-y-36 pb-10 pt-28 lg:max-w-[58%]">
        {/* 01 — disciplines */}
        <SwarmSection shape="network" id="about" className="space-y-10">
          <SectionHeading
            kicker="01 · What I build"
            title="Four disciplines, one owner."
            href="/about"
            hrefLabel="Full background"
          />
          <AboutSection />
        </SwarmSection>

        {/* 02 — work index */}
        <SwarmSection shape="layers" id="work" className="space-y-10">
          <SectionHeading kicker="02 · Selected work" title="Live, used, paid for." href="/work" hrefLabel="All case studies" />
          <div>
            {featured.map((p, i) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="row group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 px-2 py-6"
              >
                <span className="font-mono text-xs tabular-nums text-muted-foreground">0{i + 1}</span>
                <span className="poster text-3xl transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl">
                  {p.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-signal" aria-hidden>
                  →
                </span>
                <span className="col-start-2 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </SwarmSection>

        {/* 03 — currently training */}
        <SwarmSection shape="surface" id="lab" className="space-y-10">
          <SectionHeading
            kicker="03 · Currently training"
            title="Back under the hood."
            description={LEARNING.intro}
            href="/learning"
            hrefLabel="Open the lab"
          />
          <ul>
            {LEARNING.tracks.map((t) => (
              <li key={t.title} className="row flex items-baseline justify-between gap-6 py-4">
                <span className="font-medium">{t.title}</span>
                <span
                  className={`font-mono text-[11px] uppercase tracking-wider ${
                    t.status === "next" ? "text-muted-foreground" : "text-signal"
                  }`}
                >
                  {STATUS_LABEL[t.status]}
                </span>
              </li>
            ))}
          </ul>
        </SwarmSection>

        {/* 04 — the blog that writes itself */}
        <SwarmSection shape="pages" id="writing" className="space-y-10">
          <SectionHeading kicker="04 · Writing" title="Notes from production." href="/blog" hrefLabel="Read the blog" />
          <PipelineStatus />
        </SwarmSection>

        {/* 05 — contact */}
        <SwarmSection shape="globe" id="contact" className="space-y-8">
          <SectionHeading
            kicker="05 · Contact"
            title="Addis Ababa. Working worldwide."
            description={DATA.contact.contactFormIntro}
          />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/contact" className="act act-solid">
              Write to me <span aria-hidden>→</span>
            </Link>
            <a href={DATA.contact.resumePdfUrl} className="act" target="_blank" rel="noopener noreferrer">
              Download CV
            </a>
          </div>
        </SwarmSection>
      </div>
    </main>
  );
}
