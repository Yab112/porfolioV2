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
  topic_key?: string | null;
  image_url: string | null;
  image_alt: string | null;
  og_image_url: string | null;
}

export interface BlogTopicItem {
  topic: string;
  count: number;
}

export interface BlogTopicsResponse {
  items: BlogTopicItem[];
}

export interface BlogResourceLink {
  title: string;
  url: string;
  description: string;
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
  body_md?: string | null;
  published_at: string | null;
  updated_at: string | null;
  tags: string[];
  topic_key?: string | null;
  image_url: string | null;
  image_alt: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  resource_links?: BlogResourceLink[];
  related_posts?: BlogListItem[];
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
  topicKey?: string;
  resourceLinks: BlogResourceLink[];
  relatedPosts: BlogPostSummary[];
};

export function apiDetailToPageData(detail: BlogDetailResponse): BlogPostPageData {
  const links = detail.resource_links ?? [];
  const related = (detail.related_posts ?? []).map(apiListItemToSummary);
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
    topicKey: detail.topic_key ?? undefined,
    content: detail.body_md ?? "",
    resourceLinks: links,
    relatedPosts: related,
  };
}

export async function fetchBlogList(
  page: number,
  pageSize: number,
  topic?: string | null
): Promise<BlogListResponse> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(50, Math.max(1, pageSize));
  const u = new URL(`${getAegisApiBase()}/blog`);
  u.searchParams.set("page", String(safePage));
  u.searchParams.set("page_size", String(safeSize));
  const t = topic?.trim();
  if (t) u.searchParams.set("topic", t);
  const res = await fetch(u.toString(), { next: { revalidate: REVALIDATE_LIST } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Blog list failed (${res.status})`);
  }
  return res.json() as Promise<BlogListResponse>;
}

export async function fetchBlogTopics(): Promise<BlogTopicsResponse> {
  const res = await fetch(`${getAegisApiBase()}/blog/topics`, {
    next: { revalidate: REVALIDATE_LIST },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || `Blog topics failed (${res.status})`);
  }
  return res.json() as Promise<BlogTopicsResponse>;
}

export type FetchBlogPostResult =
  | { ok: true; data: BlogDetailResponse }
  | { ok: false; reason: "not_found" | "unavailable" };

async function fetchBlogPostImpl(slug: string): Promise<FetchBlogPostResult> {
  try {
    const res = await fetch(`${getAegisApiBase()}/blog/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_POST },
    });
    const text = await res.text().catch(() => "");
    if (res.status === 404) {
      return { ok: false, reason: "not_found" };
    }
    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[blog-api] GET /blog/${slug} → ${res.status}`, text.slice(0, 400));
      }
      return { ok: false, reason: "unavailable" };
    }
    try {
      const data = JSON.parse(text) as BlogDetailResponse;
      return { ok: true, data };
    } catch {
      return { ok: false, reason: "unavailable" };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[blog-api] fetch /blog/${slug}`, e);
    }
    return { ok: false, reason: "unavailable" };
  }
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

/** Paginates the public blog list for RSS / Atom / JSON Feed (newest posts first, cap for payload size). */
export async function fetchAllBlogItemsForFeed(maxItems = 100): Promise<BlogListItem[]> {
  const pageSize = 50;
  const out: BlogListItem[] = [];
  let page = 1;
  let total = 0;

  while (page < 200 && out.length < maxItems) {
    const data = await fetchBlogList(page, pageSize);
    if (page === 1) total = data.total;
    for (const item of data.items) {
      out.push(item);
      if (out.length >= maxItems) return out;
    }
    if (data.items.length === 0) break;
    if (out.length >= total) break;
    page += 1;
  }

  return out;
}
