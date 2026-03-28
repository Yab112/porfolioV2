import { BlogPostBody } from "@/components/blog/blog-post-body";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { resolveMediaUrl } from "@/lib/blog";
import { apiDetailToPageData, fetchBlogPost } from "@/lib/blog-api";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const detail = await fetchBlogPost(slug);
    if (!detail) return { title: "Post not found" };
    const post = apiDetailToPageData(detail);
    const site = DATA.url.replace(/\/$/, "");
    const url = `${site}/blog/${slug}`;
    const imageUrl =
      resolveMediaUrl(site, post.ogImage) ??
      resolveMediaUrl(site, post.image) ??
      resolveMediaUrl(site, DATA.ogImage);
    return {
      title: post.title,
      description: post.description,
      alternates: { canonical: post.canonical ?? `/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.description,
        url,
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const detail = await fetchBlogPost(slug);
  if (!detail) notFound();
  const post = apiDetailToPageData(detail);

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
        </article>
      </BlurFade>
    </main>
  );
}
