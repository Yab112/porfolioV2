import { DATA } from "@/data/resume";
import { buildRssFeed } from "@/lib/blog-feed";
import { fetchAllBlogItemsForFeed } from "@/lib/blog-api";

const DESCRIPTION =
  "Writing from Yabibal Eshetie Molla on fullstack engineering, AI in production, TypeScript, Next.js, and shipping reliable software.";

export const revalidate = 300;

export async function GET() {
  const siteOrigin = DATA.url.replace(/\/$/, "");
  const blogUrl = `${siteOrigin}/blog`;
  const meta = {
    siteOrigin,
    blogUrl,
    title: `Blog — ${DATA.name}`,
    description: DESCRIPTION,
    authorName: DATA.name,
  };

  try {
    const items = await fetchAllBlogItemsForFeed(100);
    const xml = buildRssFeed(items, meta);
    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    const xml = buildRssFeed([], meta);
    return new Response(xml, {
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  }
}
