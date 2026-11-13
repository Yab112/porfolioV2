import { cn } from "@/lib/utils";

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Cover for a project or post with no real image: a flat sheet with a halftone
 * dot field in the site's two colours. Deterministic per seed, so it is stable
 * across renders and safe for SSR.
 */
export function GenerativeCover({
  seed,
  label,
  className,
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  const h = hash(seed);
  const cx = 25 + (h % 50);
  const cy = 20 + ((h >> 6) % 35);
  const freq = 0.25 + ((h >> 12) % 5) * 0.07;
  const cols = 32;
  const rows = 20;
  const initials = (label ?? seed)
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const dots: { x: number; y: number; r: number; signal: boolean }[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = (i + 0.5) * (100 / cols);
      const y = (j + 0.5) * (62.5 / rows);
      const d = Math.hypot(x - cx, y - cy);
      const wave = 0.5 + 0.5 * Math.sin(d * freq);
      const r = 0.15 + wave * 1.05;
      dots.push({ x, y, r, signal: ((i * 7 + j * 13 + h) % 23 === 0) && wave > 0.6 });
    }
  }

  return (
    <div className={cn("relative overflow-hidden bg-[var(--purple-soft)]", className)} aria-hidden>
      <svg viewBox="0 0 100 62.5" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {dots.map((d, k) => (
          <circle
            key={k}
            cx={d.x}
            cy={d.y}
            r={d.r.toFixed(2)}
            fill={d.signal ? "var(--green-fill)" : "var(--purple)"}
          />
        ))}
      </svg>
      <span className="poster absolute bottom-2 left-3 select-none bg-background px-2 pt-1 text-5xl text-foreground">
        {initials}
      </span>
    </div>
  );
}
