import type { SwarmShape } from "@/lib/swarm-bus";

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

/** Earth as an even point sphere, with Addis Ababa (9.0°N, 38.7°E) lit and ringed. */
function globe(n: number): Formation {
  const f = make(n);
  const r = rng(97);
  const R = 1.25;
  const lat = (9.0 * Math.PI) / 180;
  const lon = (38.7 * Math.PI) / 180;
  const ax = Math.cos(lat) * Math.sin(lon);
  const ay = Math.sin(lat);
  const az = Math.cos(lat) * Math.cos(lon);
  const body = Math.floor(n * 0.9);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    if (i < body) {
      const yy = 1 - (i / (body - 1)) * 2;
      const rad = Math.sqrt(1 - yy * yy);
      const th = golden * i;
      const x = Math.cos(th) * rad;
      const z = Math.sin(th) * rad;
      const near = x * ax + yy * ay + z * az > 0.992 ? 1 : 0;
      put(f, i, x * R, yy * R, z * R, near);
    } else {
      // Ring around the city, lifted slightly off the surface.
      const ang = r() * Math.PI * 2;
      const spread = 0.16 + (r() < 0.5 ? 0 : 0.1);
      // Two tangent vectors at the city.
      const tx = Math.cos(lon);
      const tz = -Math.sin(lon);
      const ux = ay * tz;
      const uy = az * tx - ax * tz;
      const uz = -ay * tx;
      const k = R * 1.02;
      put(
        f,
        i,
        (ax + (tx * Math.cos(ang) + ux * Math.sin(ang)) * spread) * k,
        (ay + uy * Math.sin(ang) * spread) * k,
        (az + (tz * Math.cos(ang) + uz * Math.sin(ang)) * spread) * k,
        1
      );
    }
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

export function buildFormation(shape: Exclude<SwarmShape, "portrait">, n: number): Formation {
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
