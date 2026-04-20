import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

/** Turn site-relative paths into absolute URLs for Open Graph / metadata. */
export function resolveMediaUrl(siteOrigin: string, src: string | undefined): string | undefined {
  if (!src?.trim()) return undefined;
  const s = src.trim();
  if (/^https?:\/\//i.test(s)) return s;
  const base = siteOrigin.replace(/\/$/, "");
  return s.startsWith("/") ? `${base}${s}` : `${base}/${s}`;
}

function pickOptionalMeta(meta: Record<string, string>) {
  return {
    image: meta.image?.trim() || undefined,
    ogImage: meta.ogImage?.trim() || undefined,
    canonical: meta.canonical?.trim() || undefined,
    updated: meta.updated?.trim() || undefined,
    imageAlt: meta.imageAlt?.trim() || undefined,
  };
}

/** CRLF / CR breaks frontmatter detection (`---\n` vs `---\r\n`) on Windows. */
function normalizeMarkdownEol(raw: string): string {
  return raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export type BlogPostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingMinutes: number;
  /** Site-relative (`/shots/x.png`) or `https://…` — hero + list thumb + default social image */
  image?: string;
  /** Absolute `https://…` when social card should differ from `image` */
  ogImage?: string;
  /** Full URL if canonical lives off this site */
  canonical?: string;
  /** ISO date (`2026-03-30`) for `article:modified_time` */
  updated?: string;
  /** Alt text for `image` hero + list thumb (defaults to title on the post page if omitted) */
  imageAlt?: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const text = normalizeMarkdownEol(raw);
  if (!text.startsWith("---\n")) {
    return { meta: {}, body: text.trim() };
  }
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    return { meta: {}, body: text.trim() };
  }
  const front = text.slice(4, end);
  const body = text.slice(end + 5).trim();
  const meta: Record<string, string> = {};
  for (const line of front.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (k) meta[k] = v;
  }
  return { meta, body };
}

export function readingMinutesFromMarkdown(md: string | undefined | null): number {
  const raw = typeof md === "string" ? md : "";
  const text = raw.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_[\]`]/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter(
      (f) =>
        f.endsWith(".md") &&
        !f.startsWith("_") &&
        !f.startsWith(".")
    )
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPostSummaries(): BlogPostSummary[] {
  const slugs = getPostSlugs();
  const posts: BlogPostSummary[] = [];
  for (const slug of slugs) {
    const fullPath = path.join(BLOG_DIR, `${slug}.md`);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { meta, body } = parseFrontmatter(raw);
    const title = meta.title?.trim();
    const date = meta.date?.trim();
    const description = meta.description?.trim();
    if (!title || !date || !description) continue;
    const extra = pickOptionalMeta(meta);
    posts.push({
      slug,
      title,
      date,
      description,
      tags: parseTags(meta.tags),
      readingMinutes: readingMinutesFromMarkdown(body),
      ...extra,
    });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const safe = slug.replace(/[^a-z0-9-]/gi, "");
  if (safe !== slug) return null;
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const title = meta.title?.trim();
  const date = meta.date?.trim();
  const description = meta.description?.trim();
  if (!title || !date || !description) return null;
  const extra = pickOptionalMeta(meta);
  return {
    slug,
    title,
    date,
    description,
    tags: parseTags(meta.tags),
    content: body,
    readingMinutes: readingMinutesFromMarkdown(body),
    ...extra,
  };
}
