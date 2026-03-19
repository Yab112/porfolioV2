import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Projects</h2>
            <p className="text-sm text-muted-foreground max-w-xl text-pretty">
              {DATA.projects.length > 0
                ? "I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites."
                : "Project highlights coming soon. Check back shortly."}
            </p>
          </div>
        </BlurFade>
        {DATA.projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-4xl mx-auto items-start">
            {DATA.projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <ProjectCard
                  href={project.href}
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
