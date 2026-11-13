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
 * Deterministic cover art for a project or post that has no real image:
 * the same seed always renders the same composition, so it works with SSR.
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
  const hue = 255 + (h % 70); // violet → magenta, stays on-brand
  const hue2 = (hue + 40 + ((h >> 8) % 50)) % 360;
  const angle = (h >> 4) % 360;
  const variant = (h >> 12) % 3;
  const cx = 20 + ((h >> 16) % 60);
  const cy = 20 + ((h >> 20) % 50);
  const id = `gc-${h.toString(36)}`;
  const initials = (label ?? seed)
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{
        background: `linear-gradient(${angle}deg, hsl(${hue} 62% 20%), hsl(${hue2} 68% 12%))`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id={`${id}-g`} cx={`${cx}%`} cy={`${cy}%`} r="65%">
            <stop offset="0%" stopColor={`hsl(${hue2} 95% 68%)`} stopOpacity="0.85" />
            <stop offset="55%" stopColor={`hsl(${hue} 90% 55%)`} stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <pattern id={`${id}-p`} width="6" height="6" patternUnits="userSpaceOnUse">
            {variant === 0 ? (
              <circle cx="1" cy="1" r="0.45" fill="white" opacity="0.28" />
            ) : variant === 1 ? (
              <path d="M0 6 L6 0" stroke="white" strokeWidth="0.25" opacity="0.22" />
            ) : (
              <path d="M6 0H0V6" fill="none" stroke="white" strokeWidth="0.2" opacity="0.22" />
            )}
          </pattern>
        </defs>
        <rect width="100" height="75" fill={`url(#${id}-g)`} />
        <rect width="100" height="75" fill={`url(#${id}-p)`} />
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={10 + i * 11}
            fill="none"
            stroke="white"
            strokeWidth="0.2"
            opacity={0.3 - i * 0.06}
          />
        ))}
      </svg>
      <span className="font-display absolute bottom-3 left-4 select-none text-5xl font-semibold leading-none tracking-tighter text-white/90 mix-blend-overlay sm:text-6xl">
        {initials}
      </span>
    </div>
  );
}
