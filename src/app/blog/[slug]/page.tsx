import { BlogPostBody } from "@/components/blog/blog-post-body";
import { BlogPostShare } from "@/components/blog/blog-post-share";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { resolveMediaUrl } from "@/lib/blog";
import { apiDetailToPageData, fetchBlogPost } from "@/lib/blog-api";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string) {
  if (!iso.trim()) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string) {
  if (!iso.trim()) return "";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const result = await fetchBlogPost(slug);
    if (!result.ok) {
      if (result.reason === "not_found") return { title: "Post not found" };
      return {
        title: "Blog",
        description: "This post could not be loaded. Try again in a moment.",
      };
    }
    const post = apiDetailToPageData(result.data);
    const site = DATA.url.replace(/\/$/, "");
    const pageUrl = `${site}/blog/${slug}`;
    const canonicalRaw = post.canonical?.trim();
    const canonical =
      canonicalRaw && /^https?:\/\//i.test(canonicalRaw)
        ? canonicalRaw
        : canonicalRaw ?? `/blog/${slug}`;
    const imageUrl =
      resolveMediaUrl(site, post.ogImage) ??
      resolveMediaUrl(site, post.image) ??
      resolveMediaUrl(site, DATA.ogImage);
    return {
      title: post.title,
      description: post.description,
      alternates: { canonical },
      openGraph: {
        title: post.title,
        description: post.description,
        url: pageUrl,
        type: "article",
        publishedTime: post.date || undefined,
        modifiedTime: post.updated,
        authors: [DATA.name],
        images: imageUrl ? [{ url: imageUrl, alt: post.imageAlt ?? post.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

function BlogPostUnavailable() {
  return (
    <main className="min-h-dvh pb-12">
      <BlurFade delay={0.04}>
        <nav aria-label="Breadcrumb">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All posts
          </Link>
        </nav>
      </BlurFade>
      <div className="mt-10 rounded-2xl border border-border bg-card/40 px-6 py-10 text-center dark:bg-card/25">
        <h1 className="text-lg font-semibold tracking-tight">Could not load this post</h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          The blog service returned an error or timed out. Refresh the page, or try again later.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted/50"
        >
          Back to blog
        </Link>
      </div>
    </main>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const result = await fetchBlogPost(slug);
  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    return <BlogPostUnavailable />;
  }
  const post = apiDetailToPageData(result.data);
  const siteOrigin = DATA.url.replace(/\/$/, "");
  const canonicalRaw = post.canonical?.trim();
  const shareUrl =
    canonicalRaw && /^https?:\/\//i.test(canonicalRaw) ? canonicalRaw : `${siteOrigin}/blog/${slug}`;

  return (
    <main className="min-h-dvh pb-12">
      <BlurFade delay={0.04}>
        <nav aria-label="Breadcrumb">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All posts
          </Link>
        </nav>
      </BlurFade>

      <BlurFade delay={0.08}>
        <article className="mt-8">
          <header className="border-b border-border/80 pb-8">
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
            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
              {post.description}
            </p>
            {post.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="font-mono text-[10px] font-normal uppercase tracking-wide">
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}
          </header>

          {post.image ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-muted/20 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt ?? post.title}
                className="max-h-[min(55vh,480px)] w-full object-cover object-center"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}

          <div className="pt-8">
            <BlogPostBody content={post.content} />
          </div>

          <BlogPostShare url={shareUrl} title={post.title} className="mt-12 border-t border-border/80 pt-10" />

          {post.resourceLinks.length > 0 ? (
            <section className="mt-14 border-t border-border/80 pt-10" aria-labelledby="resources-heading">
              <h2 id="resources-heading" className="text-lg font-semibold tracking-tight">
                Learn more
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Curated resources referenced in this article.</p>
              <ul className="mt-5 space-y-3">
                {post.resourceLinks.map((link) => (
                  <li key={`${link.url}-${link.title}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-primary/30 hover:bg-muted/20"
                    >
                      <span className="flex items-start justify-between gap-2 font-medium text-foreground">
                        {link.title}
                        <ExternalLink className="size-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />
                      </span>
                      {link.description ? (
                        <span className="text-sm leading-relaxed text-muted-foreground">{link.description}</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {post.relatedPosts.length > 0 ? (
            <section className="mt-12 border-t border-border/80 pt-10" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-lg font-semibold tracking-tight">
                Related
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">More posts to read next.</p>
              <ul className="mt-5 flex flex-col gap-3">
                {post.relatedPosts.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="group block rounded-xl border border-border bg-card/30 p-4 transition-colors hover:border-primary/30 hover:bg-muted/25"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-medium text-foreground group-hover:text-primary">{r.title}</span>
                        {r.date ? (
                          <time
                            dateTime={r.date}
                            className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground"
                          >
                            {formatDateShort(r.date)}
                          </time>
                        ) : null}
                      </div>
                      {r.description ? (
                        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                      ) : null}
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Read
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </BlurFade>
    </main>
  );
}
