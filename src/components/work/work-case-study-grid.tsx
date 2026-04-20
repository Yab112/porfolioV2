"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const DELAY = 0.04;

type Project = (typeof import("@/data/resume").DATA.projects)[number] & { slug: string };

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  if (!src?.trim()) {
    return <div className="aspect-[16/10] w-full bg-muted sm:aspect-auto sm:h-32 sm:w-44 shrink-0 rounded-lg border border-border/60" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="aspect-[16/10] w-full max-h-40 shrink-0 rounded-lg border border-border/60 object-cover sm:aspect-auto sm:h-32 sm:w-44 sm:max-h-none"
      loading="lazy"
    />
  );
}

export function WorkCaseStudyGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <main className="min-h-dvh w-full pb-8">
      <BlurFade delay={DELAY}>
        <header className="relative overflow-hidden rounded-3xl border border-border">
          <div
            className="absolute inset-0 opacity-[0.07] dark:opacity-[0.06] bg-repeat bg-[length:280px] bg-pattern-light dark:bg-pattern-dark"
            aria-hidden
          />
          <div className="relative space-y-4 px-6 py-10 sm:px-10 sm:py-12">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Portfolio</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Work & case studies</h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              Problem → approach → stack. Open a project for the full write-up; external links open the live site or repo.
            </p>
          </div>
        </header>
      </BlurFade>

      <ul className="mt-12 flex flex-col gap-5">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <BlurFade delay={DELAY * 2 + i * 0.04}>
              <article className="group rounded-2xl border border-border bg-card/40 transition-[box-shadow,background-color] hover:bg-muted/25 hover:shadow-sm dark:bg-card/25">
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-stretch sm:gap-8 sm:p-6">
                  <ProjectImage src={project.image} alt="" />
                  <div className="min-w-0 flex flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-lg font-semibold tracking-tight text-foreground">{project.title}</h2>
                      <time className="font-mono text-[11px] tabular-nums text-muted-foreground">{project.dates}</time>
                    </div>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-4 sm:line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 8).map((t) => (
                        <Badge key={t} variant="secondary" className="font-mono text-[10px] font-normal uppercase tracking-wide">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-3 pt-1">
                      <Link
                        href={`/work/${project.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        Read case study
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                      {project.href ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                          Live / repo
                          <ArrowUpRight className="size-3.5 opacity-70" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            </BlurFade>
          </li>
        ))}
      </ul>
    </main>
  );
}
