"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import type { BlogTopicItem } from "@/lib/blog-api";
import type { BlogPostSummary } from "@/lib/blog";
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock, Rss } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DELAY = 0.04;

export type BlogPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function buildBlogListHref(page: number, activeTopic: string | null | undefined): string {
  const p = new URLSearchParams();
  if (page > 1) p.set("page", String(page));
  if (activeTopic?.trim()) p.set("topic", activeTopic.trim());
  const q = p.toString();
  return q ? `/blog?${q}` : "/blog";
}

function formatDate(iso: string) {
  if (!iso.trim()) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function topicHref(topic: string): string {
  const p = new URLSearchParams();
  p.set("topic", topic);
  return `/blog?${p.toString()}`;
}

/** Map post count to tag-cloud weighting (reference: prominent topics scale up). */
function topicCloudClasses(count: number, minC: number, maxC: number, isActive: boolean) {
  if (isActive) {
    return "font-semibold text-primary drop-shadow-[0_0_12px_rgba(142,98,169,0.35)] dark:drop-shadow-[0_0_14px_rgba(142,98,169,0.25)]";
  }
  const r = maxC <= minC ? 0.5 : (count - minC) / (maxC - minC);
  if (r > 0.72) {
    return "font-semibold text-foreground";
  }
  if (r > 0.4) {
    return "font-medium text-foreground/85";
  }
  if (r > 0.18) {
    return "font-normal text-muted-foreground";
  }
  return "font-normal text-muted-foreground/75";
}

function topicCloudFontRem(count: number, minC: number, maxC: number): number {
  const r = maxC <= minC ? 0.5 : (count - minC) / (maxC - minC);
  return 0.68 + r * 0.78;
}

export function BlogIndex({
  posts,
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
  const topicNorm = (t: string) => t.trim().toLowerCase();
  const activeNorm = activeTopic ? topicNorm(activeTopic) : null;

  const topicCounts = topics.map((t) => t.count);
  const minTopicCount = topicCounts.length ? Math.min(...topicCounts) : 0;
  const maxTopicCount = topicCounts.length ? Math.max(...topicCounts) : 1;
  /** Stable order for SSR; visual weight still comes from count. */
  const topicsCloud = [...topics].sort((a, b) => a.topic.localeCompare(b.topic, undefined, { sensitivity: "base" }));

  return (
    <main className="min-h-dvh w-full pb-8">
      <div className="flex w-full min-w-0 flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,36%)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,38%)] xl:gap-12 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 text-left">
          <BlurFade delay={DELAY}>
            <header className="relative overflow-hidden rounded-3xl border border-border">
              <div
                className="absolute inset-0 opacity-[0.07] dark:opacity-[0.06] bg-repeat bg-[length:280px] bg-pattern-light dark:bg-pattern-dark"
                aria-hidden
              />
              <div className="relative space-y-4 px-6 py-10 sm:px-10 sm:py-12">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Writing</p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Articles</h1>
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                  Notes on fullstack engineering, AI in production, and shipping reliable software—newest first.
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-1">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Subscribe
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/blog/rss.xml"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Rss className="size-3.5 text-primary" aria-hidden />
                      RSS
                    </a>
                    <a
                      href="/blog/atom.xml"
                      className="inline-flex items-center rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Atom
                    </a>
                    <a
                      href="/blog/feed.json"
                      className="inline-flex items-center rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="JSON Feed for modern readers"
                    >
                      JSON
                    </a>
                  </div>
                </div>
                {pagination ? (
                  <p className="font-mono text-xs text-muted-foreground tabular-nums">
                    {pagination.total} article{pagination.total === 1 ? "" : "s"}
                    {topics.length > 0 ? (
                      <>
                        <span className="text-border"> · </span>
                        {topics.length} topic{topics.length === 1 ? "" : "s"}
                      </>
                    ) : null}
                    {pagination.totalPages > 1 ? (
                      <>
                        <span className="text-border"> · </span>
                        Page {pagination.page} of {pagination.totalPages}
                      </>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </header>
          </BlurFade>

          {error ? (
            <p
              className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-10 min-w-0">
          {activeTopic ? (
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-muted/20 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Filtered by</span>
              <Badge variant="secondary" className="font-mono text-xs font-normal">
                {activeTopic}
              </Badge>
              <Link href="/blog" className="ml-auto text-sm font-medium text-primary hover:underline" scroll={false}>
                Clear
              </Link>
            </div>
          ) : null}

          {!error && posts.length === 0 ? (
            <p className="rounded-xl border border-border bg-card/30 px-4 py-8 text-center text-sm text-muted-foreground">
              {activeTopic
                ? "No published posts match this topic yet."
                : "No published posts yet. When posts are live in the API, they appear here."}
            </p>
          ) : null}

          {posts.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <BlurFade delay={DELAY * 3 + i * 0.05}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-5 transition-[box-shadow,background-color] hover:bg-muted/30 hover:shadow-sm dark:bg-card/30 sm:flex-row sm:items-stretch sm:justify-between sm:gap-6"
                    >
                      {post.image ? (
                        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/30 sm:aspect-auto sm:h-auto sm:w-40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.image}
                            alt={post.imageAlt ?? ""}
                            className="h-full max-h-40 w-full object-cover sm:max-h-none sm:min-h-[7rem]"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5 shrink-0 opacity-70" aria-hidden />
                            <time dateTime={post.date || undefined}>{formatDate(post.date)}</time>
                          </span>
                          <span className="text-border">·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3.5 shrink-0 opacity-70" aria-hidden />
                            {post.readingMinutes} min read
                          </span>
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {post.title}
                        </h2>
                        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                        {post.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {post.tags.map((t) => (
                              <Badge
                                key={t}
                                variant="secondary"
                                className="font-mono text-[10px] font-normal uppercase tracking-wide"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 self-start text-sm font-medium text-primary sm:self-center">
                        Read
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </BlurFade>
                </li>
              ))}
            </ul>
          ) : null}

          {pagination && pagination.totalPages > 1 ? (
            <nav
              className="mt-12 flex flex-wrap items-center justify-start gap-4 border-t border-border/70 pt-8"
              aria-label="Blog pagination"
            >
              <Link
                href={buildBlogListHref(Math.max(1, pagination.page - 1), activeTopic)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors",
                  pagination.page <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:border-primary/40 hover:bg-muted/50"
                )}
                aria-disabled={pagination.page <= 1}
                scroll={false}
              >
                <ChevronLeft className="size-4" aria-hidden />
                Newer
              </Link>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                Page {pagination.page} / {pagination.totalPages}
                <span className="mx-2 text-border">·</span>
                {pagination.total} posts
              </span>
              <Link
                href={buildBlogListHref(Math.min(pagination.totalPages, pagination.page + 1), activeTopic)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors",
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:border-primary/40 hover:bg-muted/50"
                )}
                aria-disabled={pagination.page >= pagination.totalPages}
                scroll={false}
              >
                Older
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </nav>
          ) : null}
          </div>
        </div>

        <aside
          className="w-full shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pr-0.5 [scrollbar-gutter:stable]"
          aria-label="Topics"
        >
          <div className="rounded-2xl border border-border bg-card/40 p-5 sm:p-6 dark:bg-card/25">
            {topics.length === 0 ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Topic tags load from the blog API. If none appear, check that{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">GET /blog/topics</code> is reachable.
              </p>
            ) : (
              <nav aria-label="Filter by topic">
                <p
                  id="blog-topics-heading"
                  className="mb-4 flex items-baseline justify-start gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                >
                  <span className="text-border" aria-hidden>
                    |
                  </span>
                  <span>Topics</span>
                </p>

                <div className="flex flex-wrap items-baseline justify-start gap-x-2.5 gap-y-3 text-left leading-snug">
                  <Link
                    href="/blog"
                    scroll={false}
                    className={cn(
                      "mr-0.5 shrink-0 font-mono text-[10px] uppercase tracking-wider transition-colors",
                      !activeNorm ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All
                  </Link>
                  {topicsCloud.map(({ topic, count }) => {
                    const isActive = activeNorm === topicNorm(topic);
                    const fontRem = topicCloudFontRem(count, minTopicCount, maxTopicCount);
                    return (
                      <Link
                        key={topic}
                        href={topicHref(topic)}
                        scroll={false}
                        title={`${topic} — ${count} post${count === 1 ? "" : "s"}`}
                        className={cn(
                          "inline transition-colors duration-150 hover:text-primary",
                          topicCloudClasses(count, minTopicCount, maxTopicCount, isActive)
                        )}
                        style={{ fontSize: `${fontRem}rem` }}
                      >
                        {topic}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
