/** The dot swarm is one persistent figure; pages and nav ask it to take a shape. */

export const SHAPES = [
  "portrait", "network", "layers", "helix", "surface", "pages", "globe",
  // plots and structures from machine learning
  "scatter", "regression", "curve", "bars", "matrix", "embedding", "tree",
] as const;
export type BaseShape = (typeof SHAPES)[number];
/** A named figure, or any short word spelled out in points (`word:AEGIS`). */
export type SwarmShape = BaseShape | `word:${string}`;

export interface Station {
  key: string;
  href: string;
  label: string;
  /** What the swarm becomes at this station. */
  shape: BaseShape;
  /** One-line caption shown under the figure. */
  figure: string;
  /** Figures the swarm moves through as this page is scrolled. */
  scroll: BaseShape[];
}

/** Captions for figures that are not a station's own. */
export const FIGURE_CAPTION: Partial<Record<BaseShape, string>> = {
  network: "arranged as a neural network, one path lit",
  scatter: "arranged as a scatter plot, two classes and a decision boundary",
  regression: "arranged as a regression, the fitted line in green",
  curve: "arranged as loss curves: training in green, validation in purple",
  bars: "arranged as a histogram",
  matrix: "arranged as a confusion matrix, the diagonal is correct",
  embedding: "arranged as an embedding space, one cluster selected",
  tree: "arranged as a decision tree, one path taken",
};

export const STATIONS: Station[] = [
  { key: "0", href: "/", label: "Home", shape: "portrait", figure: "arranged as Yabibal", scroll: [] },
  { key: "1", href: "/work", label: "Work", shape: "layers", figure: "arranged as a system: edge, app, data", scroll: ["tree", "matrix", "scatter", "network"] },
  { key: "2", href: "/about", label: "About", shape: "helix", figure: "arranged as a career, strand by strand", scroll: ["curve", "bars", "embedding", "tree"] },
  { key: "3", href: "/learning", label: "Lab", shape: "surface", figure: "arranged as a loss surface, descending", scroll: ["regression", "scatter", "curve", "network"] },
  { key: "4", href: "/blog", label: "Writing", shape: "pages", figure: "arranged as paragraphs", scroll: ["embedding", "bars", "tree", "scatter"] },
  { key: "5", href: "/contact", label: "Contact", shape: "globe", figure: "arranged as Earth, Addis Ababa lit", scroll: ["network", "embedding"] },
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

/** True when the path belongs to one of the stations (the figure is hidden elsewhere, e.g. legal pages). */
export function isStationPath(pathname: string): boolean {
  return pathname === "/" || STATIONS.slice(1).some((s) => pathname === s.href || pathname.startsWith(`${s.href}/`));
}
