"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { cn } from "@/lib/utils";
import { useState } from "react";

const DELAY = 0.04;

type Project = (typeof import("@/data/resume").DATA.projects)[number] & { slug: string };
type WorkEntry = (typeof import("@/data/resume").DATA.work)[number];

function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  if (!projects.length) {
    return (
      <p className="py-16 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
        nothing here yet
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <BlurFade key={project.slug} delay={DELAY * 2 + i * 0.04}>
          <ProjectCard
            href={project.href}
            caseStudyHref={`/work/${project.slug}`}
            title={project.title}
            description={project.description}
            dates={project.dates}
            tags={project.technologies}
            image={project.image}
            video={project.video}
            links={project.links}
          />
        </BlurFade>
      ))}
    </div>
  );
}

const TABS = ["Client Work", "Projects"] as const;
type Tab = (typeof TABS)[number];

export function WorkCaseStudyGrid({
  projects,
  work: _work,
}: {
  projects: readonly Project[];
  work: readonly WorkEntry[];
}) {
  const [tab, setTab] = useState<Tab>("Client Work");

  const clientProjects = projects.filter(
    (p) => (p as Project & { client?: boolean }).client === true
  );
  const personalProjects = projects.filter(
    (p) => (p as Project & { client?: boolean }).client !== true
  );

  return (
    <main className="min-h-dvh w-full pb-12">
      {/* Header */}
      <BlurFade delay={DELAY}>
        <div className="mb-10 space-y-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            Portfolio
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Work</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            Client engagements, side projects, and everything shipped in between.
          </p>
        </div>
      </BlurFade>

      {/* Tabs */}
      <BlurFade delay={DELAY * 2}>
        <div className="mb-8 flex gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "relative px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                tab === t
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
              <span className="ml-1.5 font-mono text-[10px] text-muted-foreground/50">
                {t === "Client Work" ? clientProjects.length : personalProjects.length}
              </span>
              {tab === t && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </BlurFade>

      {tab === "Client Work" && <ProjectGrid projects={clientProjects} />}
      {tab === "Projects" && <ProjectGrid projects={personalProjects} />}
    </main>
  );
}
