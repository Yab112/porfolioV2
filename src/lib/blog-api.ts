import type { BlogPostSummary } from "@/lib/blog";
import { readingMinutesFromMarkdown } from "@/lib/blog";
import { getAegisApiBase } from "@/lib/upstream-aegis";
import { cache } from "react";

const REVALIDATE_LIST = 60;
const REVALIDATE_POST = 60;
const REVALIDATE_SITEMAP = 3600;

export interface BlogListItem {
  slug: string;
  title: string;
  description: string;
  published_at: string | null;
  tags: string[];
  image_url: string | null;
  image_alt: string | null;
  og_image_url: string | null;
}

export interface BlogListResponse {
  items: BlogListItem[];
  page: number;
  page_size: number;
  total: number;
}

export interface BlogDetailResponse {
  slug: string;
  title: string;
  description: string;
  body_md: string;
  published_at: string | null;
  updated_at: string | null;
  tags: string[];
  image_url: string | null;
  image_alt: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
}

function readingMinutesFromDescription(description: string): number {
  const words = description.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function apiListItemToSummary(item: BlogListItem): BlogPostSummary {
  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.published_at ?? "",
    tags: item.tags ?? [],
    readingMinutes: readingMinutesFromDescription(item.description),
    image: item.image_url ?? undefined,
    imageAlt: item.image_alt ?? undefined,
    ogImage: item.og_image_url ?? undefined,
  };
}

export type BlogPostPageData = BlogPostSummary & {
  content: string;
  updated?: string;
};

export function apiDetailToPageData(detail: BlogDetailResponse): BlogPostPageData {
  return {
    slug: detail.slug,
    title: detail.title,
    description: detail.description,
    date: detail.published_at ?? "",
    tags: detail.tags ?? [],
    readingMinutes: readingMinutesFromMarkdown(detail.body_md),
    image: detail.image_url ?? undefined,
    imageAlt: detail.image_alt ?? undefined,
    ogImage: detail.og_image_url ?? undefined,
    canonical: detail.canonical_url ?? undefined,
    updated: detail.updated_at ?? undefined,
    content: detail.body_md,
  };
}

export async function fetchBlogList(page: number, pageSize: number): Promise<BlogListResponse> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(50, Math.max(1, pageSize));
  const u = new URL(`${getAegisApiBase()}/blog`);
  u.searchParams.set("page", String(safePage));
  u.searchParams.set("page_size", String(safeSize));
  const res = await fetch(u.toString(), { next: { revalidate: REVALIDATE_LIST } });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || `Blog list failed (${res.status})`);
  }
  return res.json() as Promise<BlogListResponse>;
}

async function fetchBlogPostImpl(slug: string): Promise<BlogDetailResponse | null> {
  const res = await fetch(`${getAegisApiBase()}/blog/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE_POST },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || `Blog post failed (${res.status})`);
  }
  return res.json() as Promise<BlogDetailResponse>;
}

/** Dedupes within the same request (e.g. `generateMetadata` + page). */
export const fetchBlogPost = cache(fetchBlogPostImpl);

/** All published slugs + lastModified for sitemap (paginates `page_size` 50). */
export async function fetchAllBlogSlugsForSitemap(): Promise<
  { slug: string; lastModified: Date | undefined }[]
> {
  const pageSize = 50;
  const out: { slug: string; lastModified: Date | undefined }[] = [];
  let page = 1;
  let total = 0;

  while (page < 200) {
    const data = await fetchBlogList(page, pageSize);
    if (page === 1) total = data.total;
    for (const item of data.items) {
      out.push({
        slug: item.slug,
        lastModified: item.published_at ? new Date(item.published_at) : undefined,
      });
    }
    if (data.items.length === 0) break;
    if (out.length >= total) break;
    page += 1;
  }

  return out;
}
