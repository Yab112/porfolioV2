/** The dot swarm is one persistent figure; pages and nav ask it to take a shape. */

export const SHAPES = ["portrait", "network", "layers", "helix", "surface", "pages", "globe"] as const;
export type SwarmShape = (typeof SHAPES)[number];

export interface Station {
  key: string;
  href: string;
  label: string;
  /** What the swarm becomes at this station. */
  shape: SwarmShape;
  /** One-line caption shown under the figure. */
  figure: string;
}

export const STATIONS: Station[] = [
  { key: "0", href: "/", label: "Home", shape: "portrait", figure: "arranged as Yabibal" },
  { key: "1", href: "/work", label: "Work", shape: "layers", figure: "arranged as a system: edge, app, data" },
  { key: "2", href: "/about", label: "About", shape: "helix", figure: "arranged as a career, strand by strand" },
  { key: "3", href: "/learning", label: "Lab", shape: "surface", figure: "arranged as a loss surface, descending" },
  { key: "4", href: "/blog", label: "Writing", shape: "pages", figure: "arranged as paragraphs" },
  { key: "5", href: "/contact", label: "Contact", shape: "globe", figure: "arranged as Earth, Addis Ababa lit" },
];

export function stationForPath(pathname: string): Station {
  if (pathname === "/") return STATIONS[0];
  return STATIONS.slice(1).find((s) => pathname === s.href || pathname.startsWith(`${s.href}/`)) ?? STATIONS[0];
}

const SHAPE_EVENT = "swarm:shape";

/** Ask the swarm to take a shape. `null` returns it to the current page's own shape. */
export function requestShape(shape: SwarmShape | null): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SwarmShape | null>(SHAPE_EVENT, { detail: shape }));
}

export function onShapeRequest(fn: (shape: SwarmShape | null) => void): () => void {
  const handler = (e: Event) => fn((e as CustomEvent<SwarmShape | null>).detail);
  window.addEventListener(SHAPE_EVENT, handler);
  return () => window.removeEventListener(SHAPE_EVENT, handler);
}
