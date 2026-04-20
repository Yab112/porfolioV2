import { DATA } from "@/data/resume";
import { buildJsonFeed } from "@/lib/blog-feed";
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
    const json = buildJsonFeed(items, meta);
    return new Response(json, {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    const json = buildJsonFeed([], meta);
    return new Response(json, {
      headers: { "Content-Type": "application/feed+json; charset=utf-8" },
    });
  }
}
