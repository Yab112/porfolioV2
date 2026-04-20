import type { BlogListItem } from "@/lib/blog-api";

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string | null | undefined): string {
  if (!iso?.trim()) return new Date().toUTCString();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function toIso8601(iso: string | null | undefined): string {
  if (!iso?.trim()) return new Date().toISOString();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export type BlogFeedMeta = {
  siteOrigin: string;
  title: string;
  description: string;
  authorName: string;
  /** Absolute URL of the blog index, no trailing slash */
  blogUrl: string;
};

export function buildRssFeed(items: BlogListItem[], meta: BlogFeedMeta): string {
  const lastBuild = new Date().toUTCString();
  const rssUrl = `${meta.siteOrigin}/blog/rss.xml`;
  const channelItems = items
    .map((item) => {
      const url = `${meta.siteOrigin}/blog/${encodeURIComponent(item.slug)}`;
      const pub = toRfc822(item.published_at);
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${escapeXml(meta.blogUrl)}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(rssUrl)}" rel="self" type="application/rss+xml" />
${channelItems}
  </channel>
</rss>`;
}

function maxPublishedIso(items: BlogListItem[]): string {
  let max = 0;
  for (const i of items) {
    if (i.published_at) {
      const t = new Date(i.published_at).getTime();
      if (!Number.isNaN(t)) max = Math.max(max, t);
    }
  }
  return max > 0 ? new Date(max).toISOString() : new Date().toISOString();
}

export function buildAtomFeed(items: BlogListItem[], meta: BlogFeedMeta): string {
  const atomUrl = `${meta.siteOrigin}/blog/atom.xml`;
  const updated = items.length > 0 ? maxPublishedIso(items) : new Date().toISOString();

  const entries = items
    .map((item) => {
      const url = `${meta.siteOrigin}/blog/${encodeURIComponent(item.slug)}`;
      const published = toIso8601(item.published_at);
      const id = url;
      return `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${escapeXml(url)}" rel="alternate" type="text/html" />
    <id>${escapeXml(id)}</id>
    <published>${published}</published>
    <updated>${published}</updated>
    <author><name>${escapeXml(meta.authorName)}</name></author>
    <summary type="text">${escapeXml(item.description)}</summary>
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(meta.title)}</title>
  <subtitle>${escapeXml(meta.description)}</subtitle>
  <link href="${escapeXml(meta.blogUrl)}" rel="alternate" type="text/html" />
  <link href="${escapeXml(atomUrl)}" rel="self" type="application/atom+xml" />
  <id>${escapeXml(meta.blogUrl + "#atom")}</id>
  <updated>${updated}</updated>
  <author><name>${escapeXml(meta.authorName)}</name></author>
${entries}
</feed>`;
}

export function buildJsonFeed(items: BlogListItem[], meta: BlogFeedMeta): string {
  const feedUrl = `${meta.siteOrigin}/blog/feed.json`;
  const payload = {
    version: "https://jsonfeed.org/version/1.1",
    title: meta.title,
    description: meta.description,
    home_page_url: meta.blogUrl,
    feed_url: feedUrl,
    authors: [{ name: meta.authorName }],
    items: items.map((item) => {
      const url = `${meta.siteOrigin}/blog/${encodeURIComponent(item.slug)}`;
      return {
        id: url,
        url,
        title: item.title,
        summary: item.description,
        date_published: item.published_at || undefined,
      };
    }),
  };
  return JSON.stringify(payload, null, 0);
}
