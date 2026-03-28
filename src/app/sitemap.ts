import { DATA } from "@/data/resume";
import { fetchAllBlogSlugsForSitemap } from "@/lib/blog-api";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = DATA.url.replace(/\/$/, "");

  let blogPostEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchAllBlogSlugsForSitemap();
    blogPostEntries = slugs.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.lastModified ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* API down at build time — omit post URLs */
  }

  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPostEntries,
  ];

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...blogEntries,
  ];
}
