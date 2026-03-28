/**
 * Optional Open Graph / Twitter images per top-level route.
 * Add 1200×630 assets under `public/` and set `image` to a path like `/og-blog.png`.
 * When omitted, pages fall back to `DATA.ogImage` / `DATA.ogImageAlt` from `resume.tsx`.
 */
export type OgRouteCard = { image: string; alt: string };

export const OG_ROUTES: { home?: OgRouteCard; blog?: OgRouteCard } = {
  home: {
    image: "/og-home.png",
    alt: "Yabibal Eshetie Molla — Fullstack engineer, portfolio",
  },
  blog: {
    image: "/og-blog.png",
    alt: "Blog — Yabibal Eshetie Molla on fullstack engineering, AI, and TypeScript",
  },
};
