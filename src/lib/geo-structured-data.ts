import { DATA } from "@/data/resume";

function siteBase(): string {
  return DATA.url.replace(/\/$/, "");
}

function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = siteBase();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Schema.org JSON-LD @graph for Person, WebSite, and WebPage (GEO / rich results). */
export function buildGeoJsonLd(): Record<string, unknown> {
  const base = siteBase();
  const personId = `${base}/#person`;
  const websiteId = `${base}/#website`;

  const sameAs = [
    DATA.contact.social.GitHub.url,
    DATA.contact.social.LinkedIn.url,
    DATA.contact.social.X.url,
    DATA.contact.upworkUrl,
  ];

  const person = {
    "@type": "Person",
    "@id": personId,
    name: DATA.name,
    url: base,
    image: absUrl(DATA.avatarUrl),
    jobTitle: "Fullstack Engineer",
    description: DATA.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Addis Ababa",
      addressRegion: "Addis Ababa",
      addressCountry: "ET",
    },
    sameAs,
    knowsAbout: [...DATA.skills],
    hasOccupation: {
      "@type": "Occupation",
      name: "Software Developer",
      description: DATA.description,
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: base,
    name: `${DATA.name} — Portfolio`,
    description: DATA.description,
    inLanguage: "en",
    publisher: { "@id": personId },
    author: { "@id": personId },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${base}/`,
    url: `${base}/`,
    name: `${DATA.name} | Fullstack Engineer`,
    description: DATA.description,
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absUrl(DATA.ogImage),
      caption: DATA.ogImageAlt,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, webpage],
  };
}
