/** Image block for blog posts: every figure shows who made it, its licence and where it came from. */
export type FigureSpec = {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  license?: string;
  source_url?: string;
  width?: number;
  height?: number;
};

export function parseFigureSpec(raw: string): FigureSpec | null {
  try {
    const f = JSON.parse(raw) as FigureSpec;
    return f && typeof f.src === "string" && /^https:\/\//.test(f.src) ? f : null;
  } catch {
    return null;
  }
}

export function BlogFigure({ spec }: { spec: FigureSpec }) {
  const credit = [spec.credit, spec.license].filter(Boolean).join(", ");
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element -- remote, licensed images with arbitrary hosts */}
      <img
        src={spec.src}
        alt={spec.alt ?? spec.caption ?? ""}
        width={spec.width}
        height={spec.height}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-auto max-h-[min(72vh,640px)] w-full border border-border bg-muted/20 object-contain"
      />
      <figcaption className="mt-2.5 border-l-2 border-[var(--green)] pl-3 text-[13.5px] leading-relaxed text-foreground/85">
        {spec.caption}
        {credit || spec.source_url ? (
          <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
            {credit ? `Image: ${credit}. ` : null}
            {spec.source_url ? (
              <a href={spec.source_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                Source
              </a>
            ) : null}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
