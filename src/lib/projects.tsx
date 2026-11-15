import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import { getAegisApiBase } from "@/lib/upstream-aegis";
import type { ReactNode } from "react";

/** A project as the site renders it: built into `DATA.projects`, edited in the admin, or both. */
export type SiteProject = {
  title: string;
  slug: string;
  href: string;
  dates: string;
  active: boolean;
  client?: boolean;
  featured?: boolean;
  description: string;
  technologies: readonly string[];
  links: readonly { type: string; href: string; icon: ReactNode }[];
  image: string;
  video: string;
};

type AdminProjectRow = {
  slug: string;
  visible?: boolean;
  title?: string;
  description?: string;
  dates?: string;
  href?: string | null;
  image?: string | null;
  technologies?: string[];
  links?: { type: string; href: string }[];
  featured?: boolean;
  active?: boolean;
  client?: boolean;
  sort_order?: number;
};

function linkIcon(type: string): ReactNode {
  return /git/i.test(type) ? <Icons.github className="size-3" /> : <Icons.globe className="size-3" />;
}

export const STATIC_PROJECTS: SiteProject[] = DATA.projects.map((p) => ({ ...p })) as SiteProject[];

/** Apply admin rows to the built-in list: edit, hide, feature, reorder and add. */
export function mergeProjects(base: SiteProject[], rows: AdminProjectRow[]): SiteProject[] {
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const order = new Map<string, number>();
  const out: SiteProject[] = [];

  base.forEach((p, i) => {
    const row = bySlug.get(p.slug);
    if (row?.visible === false) return;
    order.set(p.slug, row?.sort_order ?? 100 + i);
    if (!row) {
      out.push(p);
      return;
    }
    out.push({
      ...p,
      title: row.title?.trim() || p.title,
      description: row.description?.trim() || p.description,
      dates: row.dates?.trim() || p.dates,
      href: row.href?.trim() || p.href,
      image: row.image?.trim() || p.image,
      technologies: row.technologies?.length ? row.technologies : p.technologies,
      links: row.links?.length ? row.links.map((l) => ({ ...l, icon: linkIcon(l.type) })) : p.links,
      active: row.active ?? p.active,
      client: row.client ?? p.client,
      featured: row.featured ?? false,
    });
  });

  const known = new Set(base.map((p) => p.slug));
  rows.forEach((row, i) => {
    if (known.has(row.slug) || row.visible === false || !row.title) return;
    order.set(row.slug, row.sort_order ?? 200 + i);
    out.push({
      title: row.title,
      slug: row.slug,
      href: row.href?.trim() || `/work/${row.slug}`,
      dates: row.dates ?? "",
      active: row.active ?? true,
      client: row.client ?? false,
      featured: row.featured ?? false,
      description: row.description ?? "",
      technologies: row.technologies ?? [],
      links: (row.links ?? []).map((l) => ({ ...l, icon: linkIcon(l.type) })),
      image: row.image?.trim() || `https://picsum.photos/seed/${row.slug}/800/400`,
      video: "",
    });
  });

  return out.sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0)
  );
}

/** Projects for the public site. If the API is down, the built-in list is shown unchanged. */
export async function getProjects(): Promise<SiteProject[]> {
  try {
    const res = await fetch(`${getAegisApiBase()}/projects`, { next: { revalidate: 60 } });
    if (!res.ok) return STATIC_PROJECTS;
    const data = (await res.json()) as { items?: AdminProjectRow[] };
    return mergeProjects(STATIC_PROJECTS, Array.isArray(data.items) ? data.items : []);
  } catch {
    return STATIC_PROJECTS;
  }
}

export async function getProject(slug: string): Promise<SiteProject | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}
