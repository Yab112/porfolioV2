"use client";

import { BlogChart, parseChartSpec } from "@/components/blog/blog-chart";
import { BlogCode } from "@/components/blog/blog-code";
import { BlogFigure, parseFigureSpec } from "@/components/blog/blog-figure";
import { BlogMermaid } from "@/components/blog/blog-mermaid";
import { BlogXPost, parseXPostSpec } from "@/components/blog/blog-xpost";
import { slugifyHeading } from "@/lib/blog-toc";
import { prepareBlogMarkdown } from "@/lib/prepare-blog-markdown";
import { cn } from "@/lib/utils";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const MARKS: Record<string, string> = {
  "#hl": "blog-mark blog-mark-hl",
  "#pos": "blog-mark blog-mark-pos",
  "#neg": "blog-mark blog-mark-neg",
};

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

const CALLOUTS: Record<string, { label: string; tone: string }> = {
  KEY: { label: "Key point", tone: "border-[var(--green)] bg-[var(--green)]/[0.07]" },
  TIP: { label: "Tip", tone: "border-[var(--green)] bg-[var(--green)]/[0.07]" },
  NOTE: { label: "Note", tone: "border-[var(--purple)] bg-[var(--purple)]/[0.07]" },
  WARNING: { label: "Watch out", tone: "border-destructive bg-destructive/[0.07]" },
};

/** `> [!KEY]` style blockquotes become labelled callouts; the marker is removed from the text. */
function splitCallout(children: ReactNode): { kind: string; body: ReactNode } | null {
  const kids = Children.toArray(children);
  const idx = kids.findIndex((k) => isValidElement(k));
  if (idx < 0) return null;
  const first = kids[idx] as ReactElement<{ children?: ReactNode }>;
  const inner = Children.toArray(first.props.children);
  if (typeof inner[0] !== "string") return null;
  const m = /^\s*\[!(KEY|TIP|NOTE|WARNING)\]\s*/i.exec(inner[0]);
  if (!m) return null;
  inner[0] = inner[0].slice(m[0].length);
  kids[idx] = cloneElement(first, undefined, ...inner);
  return { kind: m[1].toUpperCase(), body: kids };
}

const components = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-10 scroll-m-20 text-2xl font-bold tracking-tight text-foreground first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children, id }: { children?: React.ReactNode; id?: string }) =>
    id === "footnote-label" ? (
      <h2 id={id} className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Notes
      </h2>
    ) : (
      <h2
        id={slugifyHeading(textOf(children))}
        className="poster mt-14 scroll-m-24 border-t border-border pt-6 text-3xl text-foreground first:mt-0 first:border-t-0 first:pt-0 sm:text-4xl"
      >
        {children}
      </h2>
    ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 id={slugifyHeading(textOf(children))} className="mt-10 scroll-m-24 text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-5 text-[17px] leading-[1.8] text-foreground first:mt-0">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-[17px] leading-[1.75] text-foreground/90">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-[17px] leading-[1.75] text-foreground/90">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="pl-1 marker:text-[var(--green)]">{children}</li>,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children, id, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) =>
    href && MARKS[href] ? (
      <mark className={MARKS[href]}>{children}</mark>
    ) : "data-footnote-ref" in rest ? (
      <a
        href={href}
        id={id}
        aria-describedby="footnote-label"
        className="ml-0.5 rounded-sm px-0.5 font-mono text-[0.72em] font-semibold text-primary no-underline hover:bg-primary/10"
      >
        {children}
      </a>
    ) : "data-footnote-backref" in rest ? (
      <a href={href} aria-label="Back to text" className="ml-1 font-mono text-primary no-underline">
        ↩
      </a>
    ) : (
    <a
      href={href}
      id={id}
      className="font-medium text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors hover:decoration-primary break-words"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
    ),
  section: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
    className?.includes("footnotes") ? (
      <section className="blog-footnotes mt-16 border-t border-border pt-6">{children}</section>
    ) : (
      <section className={className}>{children}</section>
    ),
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src?.trim()) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary user/CDN URLs from Markdown
      <img
        src={src.trim()}
        alt={alt?.trim() ? alt : ""}
        className="my-8 w-full max-w-full rounded-none border border-border/60 bg-muted/20 object-contain shadow-sm [max-height:min(72vh,640px)]"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  },
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = className?.includes("language-") || className?.includes("hljs");
    if (isBlock) {
      return <code className={cn("font-mono text-[13px]", className)}>{children}</code>;
    }
    return (
      <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[13px] text-foreground dark:bg-primary/15">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => {
    const child = Children.toArray(children).find((c) => isValidElement(c)) as
      | ReactElement<{ className?: string; children?: ReactNode }>
      | undefined;
    const lang = /language-(\w+)/.exec(child?.props.className ?? "")?.[1];
    if (child && (lang === "chart" || lang === "figure" || lang === "mermaid" || lang === "xpost")) {
      const raw = textOf(child.props.children).trim();
      if (lang === "mermaid") return <BlogMermaid code={raw} />;
      if (lang === "xpost") {
        const post = parseXPostSpec(raw);
        return post ? <BlogXPost spec={post} /> : null;
      }
      if (lang === "chart") {
        const spec = parseChartSpec(raw);
        return spec ? <BlogChart spec={spec} /> : null;
      }
      const fig = parseFigureSpec(raw);
      return fig ? <BlogFigure spec={fig} /> : null;
    }
    const meta = (child?.props as { node?: { data?: { meta?: string } } } | undefined)?.node?.data?.meta ?? "";
    const title = /title="([^"]+)"/.exec(meta)?.[1];
    return (
      <BlogCode lang={lang} title={title}>
        {children}
      </BlogCode>
    );
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => {
    const callout = splitCallout(children);
    if (callout) {
      const { label, tone } = CALLOUTS[callout.kind];
      return (
        <aside className={cn("my-8 border-l-4 px-5 py-4 [&>p]:mt-2 [&>p]:text-[16px]", tone)}>
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70">{label}</div>
          {callout.body}
        </aside>
      );
    }
    return (
      <blockquote className="my-8 border-l-4 border-[var(--green)] pl-5 text-xl leading-relaxed text-foreground">
        {children}
      </blockquote>
    );
  },
  hr: () => <hr className="my-10 border-border/80" />,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-8 w-full overflow-x-auto rounded-none border border-border/70 bg-card/30 shadow-sm">
      <table className="w-full min-w-[min(100%,36rem)] border-collapse text-left text-[14.5px] leading-snug">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="border-b border-border bg-muted/50 dark:bg-muted/30">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => <tbody className="divide-y divide-border/60">{children}</tbody>,
  tr: ({ children }: { children?: React.ReactNode }) => <tr className="transition-colors hover:bg-muted/25">{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-foreground first:pl-4 last:pr-4">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-3 py-2.5 align-top text-foreground/90 first:pl-4 first:font-medium first:text-foreground last:pr-4 [&_a]:break-all">{children}</td>
  ),
  del: ({ children }: { children?: React.ReactNode }) => (
    <del className="text-muted-foreground line-through">{children}</del>
  ),
};

export function BlogPostBody({ content }: { content: string }) {
  const prepared = prepareBlogMarkdown(content);
  return (
    <div className="blog-body mx-auto max-w-[44rem]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true, plainText: ["chart", "figure", "mermaid", "xpost"] }]]} components={components}>
        {prepared}
      </ReactMarkdown>
    </div>
  );
}
