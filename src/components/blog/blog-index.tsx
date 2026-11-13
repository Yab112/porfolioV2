"use client";

import BlurFade from "@/components/magicui/blur-fade";
import type { BlogTopicItem } from "@/lib/blog-api";
import type { BlogPostSummary } from "@/lib/blog";
import { GenerativeCover } from "@/components/fx/generative-cover";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 12;
const TOPIC_LIMIT = 7;
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
    <div className="rounded-none border border-border overflow-hidden animate-pulse">
      <div className="aspect-[3/2] bg-muted" />
      <div className="p-5 space-y-2.5">
        <div className="h-2.5 w-20 rounded-none bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="h-2.5 w-24 rounded-none bg-muted mt-2" />
      </div>
    </div>
  );
}

/** The newest post, set large: words on the left, a dot field drawn from its title on the right. */
function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="spotlight-card group grid overflow-hidden bg-card transition-colors hover:border-foreground md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
    >
      <div className="flex flex-col gap-5 p-7 sm:p-10">
        <p className="note flex items-center gap-2">
          <span className="size-2 bg-signal" aria-hidden />
          Latest
          <span aria-hidden>·</span>
          {fmtDate(post.date)}
          {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
        </p>
        <h2 className="poster text-balance text-4xl sm:text-5xl lg:text-6xl">{post.title}</h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{post.description}</p>
        <p className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {post.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          <span className="ml-auto font-mono text-xs uppercase tracking-wider text-signal transition-transform group-hover:translate-x-1">
            Read →
          </span>
        </p>
      </div>
      <GenerativeCover seed={post.slug} label={post.tags[0] ?? post.title} className="min-h-[12rem] border-t border-border md:border-l md:border-t-0" />
    </Link>
  );
}

/** Text only: every post is judged by its headline, not a stock image. */
function PostCard({ post, index }: { post: BlogPostSummary; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col gap-4 border border-border bg-card p-6 transition-colors hover:border-foreground"
    >
      <p className="note flex items-center justify-between gap-3">
        <span className="text-signal">{post.tags[0] ?? "note"}</span>
        <span className="tabular-nums">{String(index + 2).padStart(2, "0")}</span>
      </p>
      <h3 className="poster flex-1 text-balance text-2xl transition-colors group-hover:text-[var(--purple)] sm:text-3xl">
        {post.title}
      </h3>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
      <p className="note border-t border-border pt-3 tabular-nums">
        {fmtDate(post.date)}
        {post.readingMinutes ? ` · ${post.readingMinutes} min` : ""}
      </p>
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
  const [showAllTopics, setShowAllTopics] = useState(false);
  // Keep the row short; always keep the active topic visible.
  const visibleTopics = showAllTopics
    ? sortedTopics
    : sortedTopics.filter((t, i) => i < TOPIC_LIMIT || activeNorm === topicNorm(t.topic));
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-dvh w-full pb-16">
      {/* Header */}
      <BlurFade delay={DELAY}>
        <div className="mb-12 space-y-5 pt-8 lg:pt-10">
          <p className="section-kicker">Station 04</p>
          <h1 className="poster text-[clamp(3.5rem,11vw,9rem)]">Articles<span className="text-ink-purple">.</span></h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Notes on fullstack engineering, AI in production, and shipping reliable software.
          </p>
        </div>
      </BlurFade>

      {/* Topic filter pills */}
      {sortedTopics.length > 0 && (
        <BlurFade delay={DELAY * 2}>
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <span className="note mr-1">Topics</span>
            <Link
              href="/blog"
              scroll={false}
              className={cn(
                "border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                !activeNorm ? "border-transparent bg-signal" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              All
            </Link>
            {visibleTopics.map(({ topic, count }) => {
              const isActive = activeNorm === topicNorm(topic);
              return (
                <Link
                  key={topic}
                  href={isActive ? "/blog" : `/blog?topic=${encodeURIComponent(topic)}`}
                  scroll={false}
                  className={cn(
                    "border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                    isActive ? "border-transparent bg-signal" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  )}
                >
                  {topic} <span className="opacity-60">{count}</span>
                </Link>
              );
            })}
            {sortedTopics.length > TOPIC_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllTopics((v) => !v)}
                aria-expanded={showAllTopics}
                className="px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider text-signal underline-offset-4 hover:underline"
              >
                {showAllTopics ? "Fewer" : `+${sortedTopics.length - TOPIC_LIMIT} more`}
              </button>
            )}
          </div>
        </BlurFade>
      )}

      {error && (
        <p className="mb-8 rounded-none border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!error && posts.length === 0 && (
        <div className="rounded-none border border-border bg-card/30 px-4 py-20 text-center">
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
              <PostCard post={post} index={i} />
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
            className="rounded-none border border-border px-8 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:text-foreground"
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
            className="rounded-none border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
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
