import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection({ limit }: { limit?: number }) {
  const projects = limit ? DATA.projects.slice(0, limit) : DATA.projects;

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Projects</h2>
            {limit && DATA.projects.length > limit && (
              <Link
                href="/work"
                className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                See all →
              </Link>
            )}
          </div>
        </BlurFade>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-4xl mx-auto items-start">
            {projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <ProjectCard
                  href={project.href}
                  caseStudyHref={`/work/${(project as { slug: string }).slug}`}
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
        ) : null}
      </div>
    </section>
  );
}
