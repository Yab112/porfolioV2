import { DATA } from "@/data/resume";

const BASE = DATA.url.replace(/\/$/, "");

export const PERSON_ID = `${BASE}/#person`;
export const WEBSITE_ID = `${BASE}/#website`;

export function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  // URL-encode each path segment (handles spaces, @, etc.)
  const encoded = clean
    .split("/")
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
    .join("/");
  return `${BASE}${encoded}`;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function buildBreadcrumbJsonLd(
  crumbs: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

export function buildBlogPostingJsonLd(
  post: {
    title: string;
    description: string;
    date: string;
    updated?: string;
    image?: string;
    imageAlt?: string;
  },
  slug: string
): Record<string, unknown> {
  const postUrl = `${BASE}/blog/${slug}`;
  const imageUrl = post.image
    ? (post.image.startsWith("http") ? post.image : absUrl(post.image))
    : absUrl(DATA.ogImage);

  const graph: unknown[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${postUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
      ],
    },
    {
      "@type": "BlogPosting",
      "@id": `${postUrl}#post`,
      headline: post.title,
      description: post.description,
      url: postUrl,
      ...(post.date ? { datePublished: post.date } : {}),
      ...(post.updated || post.date
        ? { dateModified: post.updated || post.date }
        : {}),
      author: { "@id": PERSON_ID },
      publisher: { "@id": WEBSITE_ID },
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      image: {
        "@type": "ImageObject",
        url: imageUrl,
        caption: post.imageAlt ?? post.title,
      },
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildCollectionPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  breadcrumbs: BreadcrumbItem[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${opts.url}#breadcrumb`,
        itemListElement: opts.breadcrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
      {
        "@type": "CollectionPage",
        "@id": `${opts.url}#page`,
        url: opts.url,
        name: opts.name,
        description: opts.description,
        isPartOf: { "@id": WEBSITE_ID },
        author: { "@id": PERSON_ID },
        inLanguage: "en",
      },
    ],
  };
}
