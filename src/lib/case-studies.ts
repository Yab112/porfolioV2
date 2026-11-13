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

/** Without a hand-written case study, say only what is known: what it is, what was built, the stack. */
export function buildDefaultCaseStudySections(project: ProjectWithSlug): CaseStudySection[] {
  const sentences = project.description
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
  const sections: CaseStudySection[] = [{ id: "overview", heading: "What it is", content: sentences[0] ?? project.description }];
  if (sentences.length > 1) {
    sections.push({ id: "built", heading: "What I built", content: sentences.slice(1).join(" ") });
  }
  sections.push({ id: "technologies", heading: "Stack", content: project.technologies.join(", ") + "." });
  return sections;
}

export function getCaseStudySections(project: ProjectWithSlug): CaseStudySection[] {
  const override = CASE_STUDY_OVERRIDES[project.slug];
  return override && override.length > 0 ? override : buildDefaultCaseStudySections(project);
}
