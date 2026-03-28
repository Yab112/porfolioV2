import { BlogIndex } from "@/components/blog/blog-index";
import { DATA } from "@/data/resume";
import { OG_ROUTES } from "@/data/seo-routes";
import { apiListItemToSummary, fetchBlogList } from "@/lib/blog-api";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const PAGE_SIZE = 12;

const site = DATA.url.replace(/\/$/, "");
const blogDescription =
  "Writing from Yabibal Eshetie Molla on fullstack engineering, AI in production, TypeScript, Next.js, and shipping reliable software.";
const blogOg = OG_ROUTES.blog;
const blogOgImage = blogOg?.image ?? DATA.ogImage;
const blogOgAlt = blogOg?.alt ?? DATA.ogImageAlt;
const blogTitle = `Blog | ${DATA.name}`;

export const metadata: Metadata = {
  title: "Blog",
  description: blogDescription,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: `${site}/blog`,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
    images: [{ url: blogOgImage, alt: blogOgAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: blogTitle,
    description: blogDescription,
    images: [blogOgImage],
  },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const requested = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  try {
    const data = await fetchBlogList(requested, PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(data.total / data.page_size) || 1);

    if (requested > totalPages && data.total > 0) {
      redirect(totalPages === 1 ? "/blog" : `/blog?page=${totalPages}`);
    }

    const posts = data.items.map(apiListItemToSummary);
    return (
      <BlogIndex
        posts={posts}
        pagination={
          totalPages > 1
            ? {
                page: data.page,
                pageSize: data.page_size,
                total: data.total,
                totalPages,
              }
            : undefined
        }
      />
    );
  } catch {
    return (
      <BlogIndex
        posts={[]}
        error="Could not load posts. The blog API may be unreachable—try again later."
      />
    );
  }
}
