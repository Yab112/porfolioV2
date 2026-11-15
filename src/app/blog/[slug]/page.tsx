import { BlogPostBody } from "@/components/blog/blog-post-body";
import { BlogPostShare } from "@/components/blog/blog-post-share";
import { BlogToc } from "@/components/blog/blog-toc";
import { JsonLd } from "@/components/json-ld";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { resolveMediaUrl } from "@/lib/blog";
import { extractToc } from "@/lib/blog-toc";
import { apiDetailToPageData, fetchBlogPost } from "@/lib/blog-api";
import { buildBlogPostingJsonLd } from "@/lib/json-ld";
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

/** Display names for the sites posts are most often written from. */
const SOURCE_NAMES: Record<string, string> = {
  "openai.com": "OpenAI",
  "anthropic.com": "Anthropic",
  "alignment.anthropic.com": "Anthropic Alignment Science",
  "deepmind.google": "Google DeepMind",
  "research.google": "Google Research",
  "ai.meta.com": "Meta AI",
  "x.ai": "xAI",
  "mistral.ai": "Mistral AI",
  "huggingface.co": "Hugging Face",
  "developer.nvidia.com": "NVIDIA",
  "microsoft.com": "Microsoft Research",
  "aws.amazon.com": "AWS",
  "theverge.com": "The Verge",
  "techcrunch.com": "TechCrunch",
  "arstechnica.com": "Ars Technica",
  "venturebeat.com": "VentureBeat",
  "technologyreview.com": "MIT Technology Review",
  "the-decoder.com": "The Decoder",
  "arxiv.org": "arXiv",
  "github.com": "GitHub",
  "scale.com": "Scale AI",
  "snorkel.ai": "Snorkel AI",
};

const FORMAT_LABEL: Record<string, string> = { news: "News", analysis: "Analysis", explainer: "Explainer", course: "Course" };

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
      <div className="mt-10 rounded-none border border-border bg-card/40 px-6 py-10 text-center dark:bg-card/25">
        <h1 className="text-lg font-semibold tracking-tight">Could not load this post</h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          The blog service returned an error or timed out. Refresh the page, or try again later.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center justify-center rounded-none border border-border bg-muted/30 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted/50"
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
  const toc = extractToc(post.content);
  // Each source with its site name, for the "Based on" line, the side rail and the list at the end.
  // Reference docs attached for a post's tags are further reading, not something it was written from.
  const isReference = (description: string) => /^Official docs related to/i.test(description);
  const reading = post.resourceLinks.filter((link) => isReference(link.description));
  const sources = post.resourceLinks.filter((link) => !isReference(link.description)).map((link) => {
    let host = "";
    try {
      host = new URL(link.url).hostname.replace(/^www\./, "");
    } catch {
      host = link.url;
    }
    const brand = host.split(".").slice(-2, -1)[0] ?? host;
    return { url: link.url, title: link.title || host, host, name: SOURCE_NAMES[host] ?? brand.charAt(0).toUpperCase() + brand.slice(1) };
  });
  const siteOrigin = DATA.url.replace(/\/$/, "");
  const canonicalRaw = post.canonical?.trim();
  const shareUrl =
    canonicalRaw && /^https?:\/\//i.test(canonicalRaw) ? canonicalRaw : `${siteOrigin}/blog/${slug}`;

  const jsonLdData = buildBlogPostingJsonLd(
    {
      title: post.title,
      description: post.description,
      date: post.date,
      updated: post.updated,
      image:
        post.ogImage
          ? resolveMediaUrl(siteOrigin, post.ogImage) ?? undefined
          : post.image
            ? resolveMediaUrl(siteOrigin, post.image) ?? undefined
            : undefined,
      imageAlt: post.imageAlt,
    },
    slug
  );

  return (
    <main className="min-h-dvh pb-12">
      <JsonLd data={jsonLdData} />
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
        <article className="mx-auto mt-8 max-w-[74rem] border-x border-border bg-background px-5 py-8 sm:px-9">
          <header className="border-b border-border pb-7">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              {post.category ? <span className="border border-[var(--green)] px-2 py-1 font-semibold text-[var(--green)]">{post.category}</span> : null}
              {post.format ? <span className="border border-border px-2 py-1 text-muted-foreground">{FORMAT_LABEL[post.format] ?? post.format}</span> : null}
              <span className="inline-flex items-center gap-1.5 px-1 py-1 text-muted-foreground">
                <CalendarDays className="size-3.5 opacity-70" aria-hidden />
                <time dateTime={post.date || undefined}>{formatDate(post.date)}</time>
                <span aria-hidden>·</span>
                <Clock className="size-3.5 opacity-70" aria-hidden />
                {post.readingMinutes} min read
              </span>
            </div>
            <h1 className="poster mt-4 max-w-[58rem] text-balance text-4xl sm:text-6xl">{post.title}</h1>
            <p className="mt-4 max-w-2xl text-pretty text-[17px] leading-relaxed text-foreground/80">{post.description}</p>
            {sources.length > 0 ? (
              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Based on {sources.length} source{sources.length === 1 ? "" : "s"}:
                </span>
                {sources.slice(0, 3).map((src, i) => (
                  <span key={src.url} className="inline-flex items-center gap-2">
                    {i > 0 ? <span aria-hidden>·</span> : null}
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-primary/40 underline-offset-[3px] hover:decoration-primary">
                      {src.name}
                    </a>
                  </span>
                ))}
                {sources.length > 3 ? (
                  <a href="#sources" className="text-primary underline decoration-primary/40 underline-offset-[3px] hover:decoration-primary">
                    {sources.length - 3} more
                  </a>
                ) : null}
              </p>
            ) : null}
            {post.format && sources.length > 0 ? (
              <p className="mt-2 text-[13px] text-muted-foreground">
                Researched and drafted with AI from the sources below. Reviewed by {DATA.name.split(" ")[0]}.
              </p>
            ) : null}
          </header>

          {post.image && !post.relatedPosts.some((r) => r.image === post.image) ? (
            <div className="mt-8 overflow-hidden border border-border bg-muted/20">
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

          <div className="pt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10">
            <div className="min-w-0">
              {toc.length >= 3 ? (
                <details className="mb-6 border border-border bg-card px-4 py-3 lg:hidden">
                  <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    In this article · {toc.filter((t) => t.level === 2).length} sections
                  </summary>
                  <BlogToc items={toc} className="mt-4" />
                </details>
              ) : null}
              <div className="border border-border bg-card px-5 py-7 sm:px-9 sm:py-9">
                <BlogPostBody content={post.content} />
              </div>
              <BlogPostShare url={shareUrl} title={post.title} className="mt-10 border-t border-border pt-8" />
            </div>

            <aside className="hidden lg:block" aria-label="About this article">
              <div className="sticky top-6 flex max-h-[calc(100dvh-3rem)] flex-col gap-4 overflow-y-auto overscroll-contain pb-2">
                {toc.length >= 3 ? <BlogToc items={toc} className="border border-border bg-card p-4" /> : null}
                {sources.length > 0 ? (
                  <section className="border border-border bg-card p-4">
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Sources · {sources.length}</h2>
                    <ul className="mt-3 space-y-3">
                      {sources.slice(0, 4).map((src) => (
                        <li key={src.url}>
                          <a href={src.url} target="_blank" rel="noopener noreferrer" className="block text-[13.5px] font-medium leading-snug text-foreground hover:text-primary">
                            {src.title}
                          </a>
                          <span className="font-mono text-[11px] text-muted-foreground">{src.host}</span>
                        </li>
                      ))}
                    </ul>
                    {sources.length > 4 ? (
                      <a href="#sources" className="mt-3 inline-block text-[13px] text-primary underline underline-offset-[3px]">
                        Show all {sources.length}
                      </a>
                    ) : null}
                  </section>
                ) : null}
                {post.relatedPosts.length > 0 ? (
                  <section className="border border-border bg-card p-4">
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Read next</h2>
                    <ul className="mt-3 space-y-3">
                      {post.relatedPosts.slice(0, 3).map((r) => (
                        <li key={r.slug}>
                          <Link href={`/blog/${r.slug}`} className="block text-[13.5px] font-medium leading-snug text-foreground hover:text-primary">
                            {r.title}
                          </Link>
                          {r.date ? <span className="font-mono text-[11px] text-muted-foreground">{formatDateShort(r.date)}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </aside>
          </div>

          {sources.length > 0 ? (
            <section id="sources" className="mt-12 scroll-mt-24 border-t border-border pt-8" aria-labelledby="resources-heading">
              <h2 id="resources-heading" className="text-lg font-semibold tracking-tight">
                Sources
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">The pages this article was researched from.</p>
              <ol className="mt-5 grid gap-3 md:grid-cols-2">
                {sources.map((src, i) => (
                  <li key={src.url}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full gap-3 border border-border bg-card p-4 transition-colors hover:border-primary/50"
                    >
                      <span className="font-mono text-[12px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2 font-medium leading-snug text-foreground">
                          {src.title}
                          <ExternalLink className="mt-0.5 size-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />
                        </span>
                        <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{src.host}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {reading.length > 0 ? (
            <section className="mt-12 border-t border-border pt-8" aria-labelledby="reading-heading">
              <h2 id="reading-heading" className="text-lg font-semibold tracking-tight">
                Further reading
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Reference documentation for the topics in this article.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {reading.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50"
                    >
                      {link.title}
                      <ExternalLink className="size-3.5 opacity-60" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {post.relatedPosts.length > 0 ? (
            <section className="mt-12 border-t border-border pt-8 lg:hidden" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-lg font-semibold tracking-tight">
                Read next
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {post.relatedPosts.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="group block border border-border bg-card p-4 transition-colors hover:border-primary/50">
                      <span className="font-medium text-foreground group-hover:text-primary">{r.title}</span>
                      {r.description ? <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{r.description}</p> : null}
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Read
                        <ArrowUpRight className="size-3.5" aria-hidden />
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
