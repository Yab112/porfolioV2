"use client";

import BlurFade from "@/components/magicui/blur-fade";
import type { BlogTopicItem } from "@/lib/blog-api";
import type { BlogPostSummary } from "@/lib/blog";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 12;
const DELAY = 0.04;

export type BlogPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type RawBlogItem = {
  slug: string;
  title: string;
  description: string;
  published_at: string | null;
  tags: string[];
  image_url: string | null;
  image_alt: string | null;
  og_image_url: string | null;
};

function rawToSummary(item: RawBlogItem): BlogPostSummary {
  const words = item.description.trim().split(/\s+/).filter(Boolean).length;
  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.published_at ?? "",
    tags: item.tags ?? [],
    readingMinutes: Math.max(1, Math.round(words / 200)),
    image: item.image_url ?? undefined,
    imageAlt: item.image_alt ?? undefined,
    ogImage: item.og_image_url ?? undefined,
  };
}

function fmtDate(iso: string) {
  if (!iso.trim()) return "";
  try {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-[3/2] bg-muted" />
      <div className="p-5 space-y-2.5">
        <div className="h-2.5 w-20 rounded-full bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="h-2.5 w-24 rounded-full bg-muted mt-2" />
      </div>
    </div>
  );
}

function FeaturedPost({ post }: { post: BlogPostSummary }) {
  if (post.image) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block rounded-2xl overflow-hidden border border-border"
      >
        <div className="relative w-full aspect-[21/9] overflow-hidden">
          <img
            src={post.image}
            alt={post.imageAlt ?? ""}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 space-y-3">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/50 bg-background/50 backdrop-blur-sm px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground/70"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
            {post.description}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">
            {fmtDate(post.date)}
            {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-border bg-muted/20 hover:bg-muted/30 transition-colors"
    >
      <div className="p-8 sm:p-10 lg:p-12 space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Featured</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground/50">
                {t}
              </span>
            ))}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          {post.description}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/40 tabular-nums">
          {fmtDate(post.date)}
          {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
        </p>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-card/30 hover:bg-muted/20 transition-colors"
    >
      {post.image && (
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted/20 shrink-0">
          <img
            src={post.image}
            alt={post.imageAlt ?? ""}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-5 space-y-2.5">
        {post.tags.length > 0 && (
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
            {post.tags.slice(0, 2).join(" · ")}
          </p>
        )}
        <h3 className="font-bold text-sm sm:text-base leading-snug text-foreground group-hover:text-primary transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {post.description}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/40 tabular-nums pt-1">
          {fmtDate(post.date)}
          {post.readingMinutes ? ` · ${post.readingMinutes} min` : ""}
        </p>
      </div>
    </Link>
  );
}

export function BlogIndex({
  posts: initialPosts,
  topics = [],
  activeTopic = null,
  pagination,
  error,
}: {
  posts: BlogPostSummary[];
  topics?: BlogTopicItem[];
  activeTopic?: string | null;
  pagination?: BlogPaginationProps;
  error?: string | null;
}) {
  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(pagination?.page ?? 1);
  const [hasMore, setHasMore] = useState(
    pagination ? pagination.page < pagination.totalPages : false
  );
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Stable refs so the IntersectionObserver never needs to reconnect
  const currentPageRef = useRef(currentPage);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const activeTopicRef = useRef(activeTopic);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { activeTopicRef.current = activeTopic; }, [activeTopic]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    setLoading(true);
    loadingRef.current = true;
    setLoadError(false);
    const nextPage = currentPageRef.current + 1;
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        page_size: String(PAGE_SIZE),
      });
      if (activeTopicRef.current) params.set("topic", activeTopicRef.current);
      const res = await fetch(`/api/blog-list?${params.toString()}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json() as { items: RawBlogItem[]; total: number; page_size: number };
      setPosts((prev) => [...prev, ...data.items.map(rawToSummary)]);
      setCurrentPage(nextPage);
      currentPageRef.current = nextPage;
      const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));
      const more = nextPage < totalPages;
      setHasMore(more);
      hasMoreRef.current = more;
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []); // stable — reads state via refs

  // Create observer once; it stays connected the whole time
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "500px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]); // loadMore is stable (empty deps), so this runs once

  const topicNorm = (t: string) => t.trim().toLowerCase();
  const activeNorm = activeTopic ? topicNorm(activeTopic) : null;
  const sortedTopics = [...topics].sort((a, b) => b.count - a.count);
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-dvh w-full pb-16">
      {/* Header */}
      <BlurFade delay={DELAY}>
        <div className="mb-10 space-y-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            Writing
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            Notes on fullstack engineering, AI in production, and shipping reliable software.
          </p>
        </div>
      </BlurFade>

      {/* Topic filter pills */}
      {sortedTopics.length > 0 && (
        <BlurFade delay={DELAY * 2}>
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/blog"
              scroll={false}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
                !activeNorm
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              All
            </Link>
            {sortedTopics.map(({ topic, count }) => {
              const isActive = activeNorm === topicNorm(topic);
              return (
                <Link
                  key={topic}
                  href={isActive ? "/blog" : `/blog?topic=${encodeURIComponent(topic)}`}
                  scroll={false}
                  title={`${count} post${count === 1 ? "" : "s"}`}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {topic}
                </Link>
              );
            })}
          </div>
        </BlurFade>
      )}

      {error && (
        <p className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!error && posts.length === 0 && (
        <div className="rounded-2xl border border-border bg-card/30 px-4 py-20 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 mb-2">
            {activeTopic ? "no results" : "coming soon"}
          </p>
          <p className="text-sm text-muted-foreground">
            {activeTopic ? "No published posts match this topic yet." : "No published posts yet. Check back soon."}
          </p>
        </div>
      )}

      {/* Featured post */}
      {featured && (
        <BlurFade delay={DELAY * 3}>
          <div className="mb-6">
            <FeaturedPost post={featured} />
          </div>
        </BlurFade>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((post, i) => (
            <BlurFade key={post.slug} delay={DELAY * 4 + i * 0.03}>
              <PostCard post={post} />
            </BlurFade>
          ))}
        </div>
      )}

      {/* Sentinel — IO fires before user reaches the button */}
      <div ref={sentinelRef} className="mt-8 h-1" aria-hidden />

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Explicit load more button — visible fallback when IO doesn't trigger */}
      {hasMore && !loading && !loadError && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="rounded-full border border-border px-8 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:text-foreground"
          >
            Load more articles
          </button>
        </div>
      )}

      {/* Error + retry */}
      {loadError && !loading && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="font-mono text-xs text-muted-foreground/60">
            Failed to load — the server may be waking up
          </p>
          <button
            type="button"
            onClick={() => { setLoadError(false); loadMore(); }}
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            Try again
          </button>
        </div>
      )}

      {/* End marker */}
      {!hasMore && !loading && posts.length > 0 && (
        <p className="mt-10 text-center font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground/30">
          · end ·
        </p>
      )}
    </main>
  );
}
