import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import { DATA } from "@/data/resume";
import { getCaseStudySections, getProjectBySlug } from "@/lib/case-studies";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DATA.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Work" };
  const site = DATA.url.replace(/\/$/, "");
  const title = `${project.title} — Case study | ${DATA.name}`;
  return {
    title: project.title,
    description: project.description.slice(0, 160),
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title,
      description: project.description.slice(0, 200),
      url: `${site}/work/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description.slice(0, 200),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const sections = getCaseStudySections(project);
  const hasLinks = (project.links?.length ?? 0) > 0;

  return (
    <main className="min-h-dvh pb-16">
      <BlurFade delay={0.04}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Link href="/work" className="inline-flex items-center gap-1.5 font-medium hover:text-primary">
            <ArrowLeft className="size-4" aria-hidden />
            All work
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground/90">{project.title}</span>
        </nav>
      </BlurFade>

      <BlurFade delay={0.06}>
        <header className="mt-8 border-b border-border/80 pb-8">
          <p className="font-mono text-[11px] text-muted-foreground">{project.dates}</p>
          <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {project.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <Badge key={t} variant="secondary" className="font-mono text-[10px] font-normal uppercase tracking-wide">
                {t}
              </Badge>
            ))}
          </div>
          {project.image ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt=""
                className="max-h-[min(50vh,420px)] w-full object-cover object-center"
                loading="eager"
              />
            </div>
          ) : null}
        </header>
      </BlurFade>

      <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 hidden font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:block">
            On this page
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 lg:space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 rounded-full border border-border bg-card/50 px-3 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 hover:text-foreground lg:rounded-lg lg:border-transparent lg:bg-transparent lg:px-2 lg:py-1.5 lg:text-sm"
              >
                {s.heading}
              </a>
            ))}
            {hasLinks ? (
              <a
                href="#links"
                className="shrink-0 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 hover:text-foreground lg:rounded-lg lg:border-transparent lg:bg-transparent lg:px-2 lg:py-1.5 lg:text-sm"
              >
                Links
              </a>
            ) : null}
          </div>
        </div>

        <div className="min-w-0">
          {sections.map((s, idx) => (
            <section
              key={s.id}
              id={s.id}
              className={`scroll-mt-28 border-border/70 ${idx > 0 ? "mt-12 border-t pt-12" : ""}`}
            >
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{s.heading}</h2>
              <div className="mt-4 space-y-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                <TextWithWikiLinks text={s.content} />
              </div>
            </section>
          ))}

          {hasLinks ? (
            <section id="links" className="mt-12 scroll-mt-28 border-t border-border/70 pt-12">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Links</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {project.links!.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted/30"
                    >
                      <span className="text-muted-foreground">{link.icon}</span>
                      {link.type}
                      <ArrowUpRight className="size-4 shrink-0 opacity-60" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
