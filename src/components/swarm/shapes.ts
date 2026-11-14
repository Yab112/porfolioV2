import type { BaseShape } from "@/lib/swarm-bus";
import { ETHIOPIA_BITS, LAND_BITS } from "./land";

/** A formation: xyz per point plus a 0..1 "signal" flag (signal points render green). */
export interface Formation {
  pos: Float32Array;
  sig: Float32Array;
}

/** Small seeded PRNG so every visitor sees the same figure. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function make(n: number): Formation {
  return { pos: new Float32Array(n * 3), sig: new Float32Array(n) };
}

function put(f: Formation, i: number, x: number, y: number, z: number, s = 0) {
  f.pos[i * 3] = x;
  f.pos[i * 3 + 1] = y;
  f.pos[i * 3 + 2] = z;
  f.sig[i] = s;
}

/** Feed-forward network: neurons as small clusters, weights as dotted lines, one lit path. */
function network(n: number): Formation {
  const f = make(n);
  const r = rng(11);
  const layers = [4, 6, 6, 3];
  const nodes = layers.map((count, li) =>
    Array.from({ length: count }, (_, k) => ({
      x: -1.5 + (3 * li) / (layers.length - 1),
      y: (k - (count - 1) / 2) * 0.52,
      z: 0,
    }))
  );
  const lit = layers.map((count) => Math.floor(r() * count));
  const edges: { a: (typeof nodes)[0][0]; b: (typeof nodes)[0][0]; lit: boolean }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    nodes[l].forEach((a, ai) =>
      nodes[l + 1].forEach((b, bi) => edges.push({ a, b, lit: ai === lit[l] && bi === lit[l + 1] }))
    );
  }
  const litEdges = edges.filter((e) => e.lit);
  for (let i = 0; i < n; i++) {
    const u = r();
    if (u < 0.3) {
      const li = Math.floor(r() * layers.length);
      const ni = Math.floor(r() * layers[li]);
      const node = nodes[li][ni];
      const rad = 0.11 * Math.cbrt(r());
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      put(
        f,
        i,
        node.x + rad * Math.sin(ph) * Math.cos(th),
        node.y + rad * Math.sin(ph) * Math.sin(th),
        rad * Math.cos(ph),
        ni === lit[li] ? 1 : 0
      );
    } else {
      const e = u < 0.42 ? litEdges[Math.floor(r() * litEdges.length)] : edges[Math.floor(r() * edges.length)];
      const t = r();
      put(f, i, e.a.x + (e.b.x - e.a.x) * t, e.a.y + (e.b.y - e.a.y) * t, (r() - 0.5) * 0.02, e.lit ? 1 : 0);
    }
  }
  return f;
}

/** A system drawn as stacked planes (edge → app → data) with requests travelling between them. */
function layers(n: number): Formation {
  const f = make(n);
  const r = rng(23);
  const planes = [0.95, 0.32, -0.32, -0.95];
  for (let i = 0; i < n; i++) {
    if (r() < 0.86) {
      const p = Math.floor(r() * planes.length);
      const cols = 34;
      const gx = Math.floor(r() * cols) / (cols - 1) - 0.5;
      const gz = Math.floor(r() * cols) / (cols - 1) - 0.5;
      put(f, i, gx * 2.5, planes[p], gz * 2.5, 0);
    } else {
      const k = Math.floor(r() * 9);
      const cx = ((k % 3) - 1) * 0.8;
      const cz = (Math.floor(k / 3) - 1) * 0.8;
      put(f, i, cx, planes[0] - r() * (planes[0] - planes[3]), cz, 1);
    }
  }
  return f;
}

/** Double helix: two strands of a career with rungs joining them. */
function helix(n: number): Formation {
  const f = make(n);
  const r = rng(37);
  const turns = 2.6;
  for (let i = 0; i < n; i++) {
    const t = r();
    const a = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * 3;
    const u = r();
    if (u < 0.74) {
      const side = u < 0.37 ? 0 : Math.PI;
      const j = (r() - 0.5) * 0.05;
      put(f, i, Math.cos(a + side) * (0.72 + j), y, Math.sin(a + side) * (0.72 + j), 0);
    } else {
      const rung = Math.round(t * 26) / 26;
      const ra = rung * Math.PI * 2 * turns;
      const s = (r() - 0.5) * 2 * 0.72;
      put(f, i, Math.cos(ra) * s, (rung - 0.5) * 3, Math.sin(ra) * s, 1);
    }
  }
  return f;
}

/** The loss function the Lab page lets you descend (Himmelblau), scaled to the figure. */
export function himmelblau(x: number, y: number): number {
  return (x * x + y - 11) ** 2 + (x + y * y - 7) ** 2;
}

function surface(n: number): Formation {
  const f = make(n);
  const r = rng(53);
  const height = (x: number, y: number) => Math.log1p(himmelblau(x, y)) / 6.6 - 0.55;
  // A gradient-descent path from a hilltop, to light up in green.
  const path: [number, number][] = [];
  let px = -0.6;
  let py = -0.4;
  for (let s = 0; s < 220; s++) {
    path.push([px, py]);
    const gx = 4 * px * (px * px + py - 11) + 2 * (px + py * py - 7);
    const gy = 2 * (px * px + py - 11) + 4 * py * (px + py * py - 7);
    px -= 0.004 * gx;
    py -= 0.004 * gy;
  }
  const side = Math.floor(Math.sqrt(n * 0.9));
  for (let i = 0; i < n; i++) {
    if (i < side * side) {
      const gx = ((i % side) / (side - 1) - 0.5) * 10;
      const gy = (Math.floor(i / side) / (side - 1) - 0.5) * 10;
      put(f, i, gx * 0.34, height(gx, gy), gy * 0.34, 0);
    } else {
      const [x, y] = path[Math.floor(r() * path.length)];
      put(f, i, x * 0.34 + (r() - 0.5) * 0.03, height(x, y) + 0.03 + r() * 0.03, y * 0.34 + (r() - 0.5) * 0.03, 1);
    }
  }
  return f;
}

/** Lines of text on a sheet: a heading, paragraphs, one highlighted sentence. */
function pages(n: number): Formation {
  const f = make(n);
  const r = rng(71);
  const lines: { y: number; from: number; to: number; sig: number }[] = [];
  let y = 1.35;
  let row = 0;
  while (y > -1.4) {
    const heading = row === 0 || row === 9;
    const gap = row === 8 || row === 15;
    if (!gap) {
      let x = -1.25;
      const end = heading ? 0.2 : 1.25 - (row % 4 === 3 ? 0.9 : r() * 0.25);
      while (x < end) {
        const w = 0.12 + r() * 0.32;
        lines.push({ y, from: x, to: Math.min(end, x + w), sig: heading || row === 5 ? 1 : 0 });
        x += w + 0.07;
      }
    }
    y -= heading ? 0.24 : 0.15;
    row++;
  }
  for (let i = 0; i < n; i++) {
    const l = lines[Math.floor(r() * lines.length)];
    const x = l.from + (l.to - l.from) * r();
    put(f, i, x, l.y + (r() - 0.5) * (l.sig && l.y > 1.2 ? 0.07 : 0.022), Math.sin(x * 1.6) * 0.18, l.sig);
  }
  return f;
}

function unpack(b64: string): Uint8Array {
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Is the 1-degree cell at this latitude/longitude (radians) set in the bitmap? */
function cell(mask: Uint8Array, lat: number, lon: number): boolean {
  const row = Math.min(179, Math.max(0, Math.floor(90 - (lat * 180) / Math.PI)));
  const col = ((Math.floor((lon * 180) / Math.PI + 180) % 360) + 360) % 360;
  const bit = row * 360 + col;
  return (mask[bit >> 3] & (0x80 >> (bit & 7))) !== 0;
}

/**
 * Earth drawn in points: the continents are dense, the oceans a faint scatter
 * that keeps the sphere readable. Ethiopia is lit, with a ring on Addis Ababa
 * (9.0°N, 38.7°E).
 */
function globe(n: number): Formation {
  const f = make(n);
  const r = rng(97);
  const land = unpack(LAND_BITS);
  const ethiopia = unpack(ETHIOPIA_BITS);
  const R = 1.25;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const ringCount = Math.floor(n * 0.04);
  const oceanCount = Math.floor(n * 0.1);
  const landCount = n - ringCount - oceanCount;

  // Evenly spaced candidates over the sphere; keep the ones that fall on land.
  let i = 0;
  const candidates = Math.ceil(landCount * 3.6);
  for (let pass = 0; i < landCount && pass < 4; pass++) {
    for (let k = 0; k < candidates && i < landCount; k++) {
      const y = 1 - ((k + 0.5 + pass * 0.37) / candidates) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * k + pass * 1.3;
      const x = Math.sin(th) * rad;
      const z = Math.cos(th) * rad;
      const lat = Math.asin(y);
      const lon = Math.atan2(x, z);
      if (!cell(land, lat, lon)) continue;
      put(f, i++, x * R, y * R, z * R, cell(ethiopia, lat, lon) ? 1 : 0);
    }
  }

  // Oceans: a sparse scatter, slightly inside the surface so land stands proud.
  for (let k = 0; i < landCount + oceanCount; k++) {
    const y = 1 - ((k + 0.5) / oceanCount) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * k * 1.7;
    put(f, i++, Math.sin(th) * rad * R * 0.985, y * R * 0.985, Math.cos(th) * rad * R * 0.985, 0);
  }

  // A ring around Addis Ababa, lifted just off the surface.
  const lat = (9.0 * Math.PI) / 180;
  const lon = (38.7 * Math.PI) / 180;
  const c = [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  const east = [Math.cos(lon), 0, -Math.sin(lon)];
  const north = [-Math.sin(lat) * Math.sin(lon), Math.cos(lat), -Math.sin(lat) * Math.cos(lon)];
  for (; i < n; i++) {
    const ang = r() * Math.PI * 2;
    const spread = r() < 0.75 ? 0.17 : 0.03 * Math.sqrt(r());
    const k = R * 1.03;
    put(
      f,
      i,
      (c[0] + (east[0] * Math.cos(ang) + north[0] * Math.sin(ang)) * spread) * k,
      (c[1] + (east[1] * Math.cos(ang) + north[1] * Math.sin(ang)) * spread) * k,
      (c[2] + (east[2] * Math.cos(ang) + north[2] * Math.sin(ang)) * spread) * k,
      1
    );
  }
  return f;
}

/**
 * Points sampled from an image. A cut-out (transparent background) is traced by
 * its alpha; a photo is traced by tone, so the face emerges from dot density.
 */
export function fromImage(n: number, img: CanvasImageSource, w: number, h: number, dark: boolean): Formation {
  const f = make(n);
  const r = rng(5);
  const S = 220;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return f;
  const scale = Math.max(S / w, S / h);
  const cut = Math.min(S / w, S / h);
  ctx.drawImage(img, 0, 0, w, h, (S - w * scale) / 2, (S - h * scale) / 2, w * scale, h * scale);
  let data = ctx.getImageData(0, 0, S, S).data;
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 250) opaque++;
  const isPhoto = opaque / (S * S) > 0.97;
  if (!isPhoto) {
    // Cut-outs are fitted inside the square instead of cropped.
    ctx.clearRect(0, 0, S, S);
    ctx.drawImage(img, 0, 0, w, h, (S - w * cut) / 2, (S - h * cut) / 2, w * cut, h * cut);
    data = ctx.getImageData(0, 0, S, S).data;
  }
  const weight = new Float32Array(S * S);
  const tone = new Float32Array(S * S);
  let total = 0;
  for (let i = 0; i < S * S; i++) {
    const lum = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
    tone[i] = lum;
    const wgt = isPhoto ? Math.pow(dark ? lum : 1 - lum, 1.7) : data[i * 4 + 3] > 120 ? 1 : 0;
    weight[i] = wgt;
    total += wgt;
  }
  if (total === 0) return f;
  // Cumulative distribution → draw n pixels proportionally to weight.
  const cdf = new Float32Array(S * S);
  let acc = 0;
  for (let i = 0; i < S * S; i++) {
    acc += weight[i] / total;
    cdf[i] = acc;
  }
  for (let i = 0; i < n; i++) {
    const u = r();
    let lo = 0;
    let hi = S * S - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < u) lo = mid + 1;
      else hi = mid;
    }
    const px = (lo % S) + r();
    const py = Math.floor(lo / S) + r();
    const depth = isPhoto ? (tone[lo] - 0.5) * (dark ? 0.5 : -0.5) : (r() - 0.5) * 0.12;
    put(f, i, (px / S - 0.5) * 3, (0.5 - py / S) * 3, depth, r() < 0.07 ? 1 : 0);
  }
  return f;
}

// ── plots ────────────────────────────────────────────────────────────────────

/** Standard normal sample. */
function gauss(r: () => number): number {
  return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
}

const AX = { left: -1.5, right: 1.5, bottom: -1.15, top: 1.25 };

/** Put point i on the plot's axes (with tick marks). */
function axis(f: Formation, i: number, r: () => number) {
  const u = r();
  if (u < 0.42) put(f, i, AX.left + (AX.right - AX.left) * r(), AX.bottom, 0);
  else if (u < 0.78) put(f, i, AX.left, AX.bottom + (AX.top - AX.bottom) * r(), 0);
  else if (u < 0.9) put(f, i, AX.left + (Math.floor(r() * 7) / 6) * (AX.right - AX.left), AX.bottom - r() * 0.07, 0);
  else put(f, i, AX.left - r() * 0.07, AX.bottom + (Math.floor(r() * 6) / 5) * (AX.top - AX.bottom), 0);
}

/** Two classes of points and the line that separates them. */
function scatter(n: number): Formation {
  const f = make(n);
  const r = rng(131);
  for (let i = 0; i < n; i++) {
    const u = r();
    if (u < 0.1) axis(f, i, r);
    else if (u < 0.22) {
      const t = r() * 2 - 1;
      put(f, i, t * 1.25 + 0.05, -t * 1.05 + 0.08 + (r() - 0.5) * 0.02, 0.02, 1);
    } else {
      const a = u < 0.61;
      const cx = a ? -0.62 : 0.72;
      const cy = a ? -0.45 : 0.62;
      put(f, i, cx + gauss(r) * 0.3, cy + gauss(r) * 0.27, gauss(r) * 0.05, 0);
    }
  }
  return f;
}

/** Noisy observations and the line fitted through them. */
function regression(n: number): Formation {
  const f = make(n);
  const r = rng(137);
  const fit = (x: number) => 0.62 * x + 0.05 + 0.16 * Math.sin(x * 1.7);
  for (let i = 0; i < n; i++) {
    const u = r();
    const x = AX.left + 0.15 + r() * (AX.right - AX.left - 0.3);
    if (u < 0.1) axis(f, i, r);
    else if (u < 0.3) put(f, i, x, fit(x) + (r() - 0.5) * 0.025, 0.02, 1);
    else put(f, i, x, fit(x) + gauss(r) * 0.24, gauss(r) * 0.04, 0);
  }
  return f;
}

/** Training loss falling; validation loss falling, then turning back up. */
function curve(n: number): Formation {
  const f = make(n);
  const r = rng(139);
  const W = AX.right - AX.left;
  for (let i = 0; i < n; i++) {
    const u = r();
    const t = r();
    const x = AX.left + 0.08 + t * (W - 0.16);
    if (u < 0.12) axis(f, i, r);
    else if (u < 0.56) put(f, i, x, AX.bottom + 0.12 + 2.0 * Math.exp(-3.4 * t) + gauss(r) * 0.018, 0, 1);
    else put(f, i, x, AX.bottom + 0.42 + 1.75 * Math.exp(-3.1 * t) + 0.55 * t * t + gauss(r) * 0.03, 0, 0);
  }
  return f;
}

/** A histogram of a bell-shaped distribution, the modal bin lit. */
function bars(n: number): Formation {
  const f = make(n);
  const r = rng(149);
  const bins = 13;
  const heights = Array.from({ length: bins }, (_, k) => Math.exp(-((k - 6) ** 2) / 9));
  const total = heights.reduce((a, b) => a + b, 0);
  const bw = (AX.right - AX.left - 0.2) / bins;
  for (let i = 0; i < n; i++) {
    if (r() < 0.08) {
      put(f, i, AX.left + (AX.right - AX.left) * r(), AX.bottom, 0);
      continue;
    }
    let pick = r() * total;
    let k = 0;
    while (k < bins - 1 && pick > heights[k]) pick -= heights[k++];
    const x0 = AX.left + 0.1 + k * bw;
    put(f, i, x0 + 0.03 + r() * (bw - 0.06), AX.bottom + r() * heights[k] * 2.2, (r() - 0.5) * 0.12, k === 6 ? 1 : 0);
  }
  return f;
}

/** A confusion matrix: dense on the diagonal (right answers), sparse elsewhere. */
function matrix(n: number): Formation {
  const f = make(n);
  const r = rng(151);
  const k = 5;
  const size = 2.6;
  const cell = size / k;
  const weights: number[] = [];
  for (let row = 0; row < k; row++) {
    for (let col = 0; col < k; col++) weights.push(row === col ? 1 : 0.06 + ((row * 7 + col * 3) % 5) * 0.035);
  }
  const total = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    let pick = r() * total;
    let c = 0;
    while (c < weights.length - 1 && pick > weights[c]) pick -= weights[c++];
    const row = Math.floor(c / k);
    const col = c % k;
    put(
      f,
      i,
      -size / 2 + col * cell + 0.04 + r() * (cell - 0.08),
      size / 2 - row * cell - 0.04 - r() * (cell - 0.08),
      (r() - 0.5) * 0.06,
      row === col ? 1 : 0
    );
  }
  return f;
}

/** Points in an embedding space, grouped by meaning; one neighbourhood selected. */
function embedding(n: number): Formation {
  const f = make(n);
  const r = rng(157);
  const centres = [
    [0.9, 0.5, 0.2], [-0.8, 0.7, -0.4], [-0.5, -0.8, 0.6], [0.6, -0.7, -0.6], [0.0, 0.1, 0.9], [0.1, 0.9, -0.9],
  ];
  for (let i = 0; i < n; i++) {
    const c = Math.floor(r() * centres.length);
    const s = 0.2 + (c % 3) * 0.05;
    put(f, i, centres[c][0] + gauss(r) * s, centres[c][1] + gauss(r) * s, centres[c][2] + gauss(r) * s, c === 0 ? 1 : 0);
  }
  return f;
}

/** A decision tree, with the path one example takes from root to leaf. */
function tree(n: number): Formation {
  const f = make(n);
  const r = rng(163);
  const depth = 5;
  const nodes: { x: number; y: number; lit: boolean }[][] = [];
  let litIndex = 0;
  for (let d = 0; d < depth; d++) {
    const count = 2 ** d;
    if (d > 0) litIndex = litIndex * 2 + (r() < 0.5 ? 0 : 1);
    nodes.push(
      Array.from({ length: count }, (_, k) => ({
        x: ((k + 0.5) / count - 0.5) * 3.1,
        y: 1.25 - d * 0.62,
        lit: k === litIndex,
      }))
    );
  }
  for (let i = 0; i < n; i++) {
    const d = Math.floor(r() * depth);
    const k = Math.floor(r() * nodes[d].length);
    const node = nodes[d][k];
    if (r() < 0.38 || d === 0) {
      const rad = 0.075 * Math.sqrt(r());
      const th = r() * Math.PI * 2;
      put(f, i, node.x + rad * Math.cos(th), node.y + rad * Math.sin(th), 0, node.lit ? 1 : 0);
    } else {
      const parent = nodes[d - 1][Math.floor(k / 2)];
      const t = r();
      put(f, i, parent.x + (node.x - parent.x) * t, parent.y + (node.y - parent.y) * t, 0, node.lit && parent.lit ? 1 : 0);
    }
  }
  return f;
}

/** A short word set in heavy type and traced in points. */
export function fromText(n: number, text: string): Formation {
  const word = text.toUpperCase().slice(0, 14);
  const c = document.createElement("canvas");
  const font = "900 200px Impact, 'Arial Black', 'Helvetica Neue', sans-serif";
  const probe = c.getContext("2d");
  if (!probe) return make(n);
  probe.font = font;
  const w = Math.max(200, Math.ceil(probe.measureText(word).width) + 20);
  c.width = w;
  c.height = 220;
  const ctx = c.getContext("2d");
  if (!ctx) return make(n);
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(word, 10, 118);
  return fromImage(n, c, c.width, c.height, true);
}

export function buildFormation(shape: Exclude<BaseShape, "portrait">, n: number): Formation {
  switch (shape) {
    case "network":
      return network(n);
    case "layers":
      return layers(n);
    case "helix":
      return helix(n);
    case "surface":
      return surface(n);
    case "pages":
      return pages(n);
    case "globe":
      return globe(n);
    case "scatter":
      return scatter(n);
    case "regression":
      return regression(n);
    case "curve":
      return curve(n);
    case "bars":
      return bars(n);
    case "matrix":
      return matrix(n);
    case "embedding":
      return embedding(n);
    case "tree":
      return tree(n);
  }
}

/** Where points wait before the first formation: a loose cloud. */
export function cloud(n: number): Formation {
  const f = make(n);
  const r = rng(1);
  for (let i = 0; i < n; i++) {
    const rad = 1.2 + r() * 2.6;
    const th = r() * Math.PI * 2;
    const ph = Math.acos(2 * r() - 1);
    put(f, i, rad * Math.sin(ph) * Math.cos(th), rad * Math.sin(ph) * Math.sin(th), rad * Math.cos(ph), 0);
  }
  return f;
}
