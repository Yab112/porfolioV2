import { WorkCaseStudyGrid } from "@/components/work/work-case-study-grid";
import { DATA } from "@/data/resume";
import { OG_ROUTES } from "@/data/seo-routes";
import type { Metadata } from "next";

const site = DATA.url.replace(/\/$/, "");
const description =
  "Case studies and project notes: scope, stack, and how complex products were shipped—from lead-gen SaaS and AI agents to education and commerce.";
const workOg = OG_ROUTES.blog;
const ogImage = workOg?.image ?? DATA.ogImage;
const ogAlt = workOg?.alt ?? DATA.ogImageAlt;
const title = `Work | ${DATA.name}`;

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    title,
    description,
    url: `${site}/work`,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
    images: [{ url: ogImage, alt: ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function WorkPage() {
  return <WorkCaseStudyGrid projects={DATA.projects} />;
}
