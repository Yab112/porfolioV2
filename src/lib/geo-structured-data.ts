import { DATA } from "@/data/resume";

function siteBase(): string {
  return DATA.url.replace(/\/$/, "");
}

function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = siteBase();
  const clean = path.startsWith("/") ? path : `/${path}`;
  const encoded = clean
    .split("/")
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
    .join("/");
  return `${base}${encoded}`;
}

const LOGO_PATH = "/Logo Color Version@700x.png";

/** Schema.org JSON-LD @graph for Person, WebSite, and ProfilePage (GEO / rich results). */
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
    image: [
      {
        "@type": "ImageObject",
        url: absUrl(LOGO_PATH),
        caption: `${DATA.name} — Logo`,
      },
      {
        "@type": "ImageObject",
        url: absUrl(DATA.avatarUrl),
        caption: `${DATA.name} — Photo`,
      },
    ],
    jobTitle: "Fullstack Engineer",
    description: DATA.description,
    email: DATA.contact.email,
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
    logo: {
      "@type": "ImageObject",
      url: absUrl(LOGO_PATH),
      caption: `${DATA.name} — Logo`,
    },
    publisher: { "@id": personId },
    author: { "@id": personId },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${base}/`,
    url: `${base}/`,
    name: `${DATA.name} | Fullstack Engineer`,
    description: DATA.description,
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: { "@id": personId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absUrl(DATA.ogImage),
      caption: DATA.ogImageAlt,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };
}
