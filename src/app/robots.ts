import { DATA } from "@/data/resume";
import type { MetadataRoute } from "next";

const disallowApi = ["/api/"] as const;

export default function robots(): MetadataRoute.Robots {
  const base = DATA.url.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: [...disallowApi] },
      { userAgent: "GPTBot", allow: "/", disallow: [...disallowApi] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: [...disallowApi] },
      { userAgent: "ClaudeBot", allow: "/", disallow: [...disallowApi] },
      { userAgent: "anthropic-ai", allow: "/", disallow: [...disallowApi] },
      { userAgent: "Google-Extended", allow: "/", disallow: [...disallowApi] },
      { userAgent: "PerplexityBot", allow: "/", disallow: [...disallowApi] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: [...disallowApi] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: [...disallowApi] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ""),
  };
}
