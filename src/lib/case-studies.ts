import { DATA } from "@/data/resume";
import { CASE_STUDY_OVERRIDES } from "@/data/case-study-overrides";
import type { CaseStudySection } from "@/types/work";

type ProjectWithSlug = (typeof DATA.projects)[number] & { slug: string };

export function getAllProjectSlugs(): string[] {
  return DATA.projects.map((p) => (p as ProjectWithSlug).slug);
}

export function getProjectBySlug(slug: string): ProjectWithSlug | null {
  const found = DATA.projects.find((p) => (p as ProjectWithSlug).slug === slug);
  return found ? (found as ProjectWithSlug) : null;
}

export function buildDefaultCaseStudySections(project: ProjectWithSlug): CaseStudySection[] {
  return [
    {
      id: "overview",
      heading: "Overview",
      content: project.description,
    },
    {
      id: "scope",
      heading: "Scope",
      content:
        "End-to-end product work: shipping user-facing surfaces, integrating services, and keeping releases maintainable—with attention to performance, clarity, and ops-friendly boundaries.",
    },
    {
      id: "technologies",
      heading: "Technologies",
      content: `Primary tools and stack: ${project.technologies.join(", ")}.`,
    },
  ];
}

export function getCaseStudySections(project: ProjectWithSlug): CaseStudySection[] {
  const override = CASE_STUDY_OVERRIDES[project.slug];
  return override && override.length > 0 ? override : buildDefaultCaseStudySections(project);
}
