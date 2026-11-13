import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";
import { SectionHeading } from "@/components/fx/section-heading";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection({ limit }: { limit?: number }) {
  const projects = limit ? DATA.projects.slice(0, limit) : DATA.projects;

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-10">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <SectionHeading
            kicker="Selected work"
            title="Products that are live, used and paid for."
            href={limit && DATA.projects.length > limit ? "/work" : undefined}
            hrefLabel="All case studies"
          />
        </BlurFade>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {projects.map((project, id) => (
              <BlurFade
                className="h-full"
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
