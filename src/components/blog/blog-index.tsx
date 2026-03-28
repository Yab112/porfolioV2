"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import type { BlogPostSummary } from "@/lib/blog";
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DELAY = 0.04;

export type BlogPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

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

export function BlogIndex({
  posts,
  pagination,
  error,
}: {
  posts: BlogPostSummary[];
  pagination?: BlogPaginationProps;
  error?: string | null;
}) {
  return (
    <main className="min-h-dvh pb-8">
      <BlurFade delay={DELAY}>
        <header className="relative overflow-hidden rounded-3xl border border-border">
          <div
            className="absolute inset-0 opacity-[0.07] dark:opacity-[0.06] bg-repeat bg-[length:280px] bg-pattern-light dark:bg-pattern-dark"
            aria-hidden
          />
          <div className="relative space-y-3 px-6 py-10 sm:px-10 sm:py-12">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Writing</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Blog</h1>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
              Published writing from the Aegis API (Supabase). Newest first—Markdown is rendered on each post page.
            </p>
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

      {!error && posts.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No published posts yet. When posts are live in the API with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">status = published</code>, they appear
          here.
        </p>
      ) : null}

      {posts.length > 0 ? (
        <ul className="mt-10 flex flex-col gap-4">
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
                      <h2 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                      {post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.map((t) => (
                            <Badge key={t} variant="secondary" className="font-mono text-[10px] font-normal uppercase tracking-wide">
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
          className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-border/70 pt-8"
          aria-label="Blog pagination"
        >
          <Link
            href={pagination.page <= 2 ? "/blog" : `/blog?page=${pagination.page - 1}`}
            prefetch={false}
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
            href={`/blog?page=${pagination.page + 1}`}
            prefetch={false}
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
    </main>
  );
}
