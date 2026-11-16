/** A post on X quoted in an article: the real words, author and date, with a link to the post. */
export type XPostSpec = { url: string; author: string; handle: string; text: string; date?: string };

export function parseXPostSpec(raw: string): XPostSpec | null {
  try {
    const p = JSON.parse(raw) as XPostSpec;
    return p && /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(p.url) && p.text && p.handle ? p : null;
  } catch {
    return null;
  }
}

/** Links inside the post text become real links; everything else stays plain text. */
function withLinks(text: string) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-primary underline underline-offset-2">
        {part.replace(/^https?:\/\//, "")}
      </a>
    ) : (
      part
    )
  );
}

export function BlogXPost({ spec }: { spec: XPostSpec }) {
  return (
    <figure className="my-9 border border-border bg-background">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <span className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex size-9 shrink-0 items-center justify-center bg-[var(--purple)] text-[15px] font-bold text-background">
            {spec.author.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-foreground">{spec.author}</span>
            <span className="block truncate font-mono text-[12px] text-muted-foreground">@{spec.handle}</span>
          </span>
        </span>
        {/* X mark */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 fill-muted-foreground">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </figcaption>
      <blockquote className="whitespace-pre-line px-5 py-4 text-[16.5px] leading-[1.6] text-foreground">{withLinks(spec.text)}</blockquote>
      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-2.5 font-mono text-[12px] text-muted-foreground">
        <span>{spec.date ? `Posted on X, ${spec.date}` : "Posted on X"}</span>
        <a href={spec.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
          View the post
        </a>
      </div>
    </figure>
  );
}
