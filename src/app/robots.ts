import { DATA } from "@/data/resume";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = DATA.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
