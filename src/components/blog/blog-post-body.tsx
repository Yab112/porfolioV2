"use client";

import { prepareBlogMarkdown } from "@/lib/prepare-blog-markdown";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-10 scroll-m-20 text-2xl font-bold tracking-tight text-foreground first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-10 scroll-m-20 border-b border-border/60 pb-2 text-xl font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight text-foreground">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-4 text-[15px] leading-[1.75] text-foreground/90 first:mt-0">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-foreground/90">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-[15px] leading-relaxed text-foreground/90">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="pl-1 marker:text-primary">{children}</li>,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors hover:decoration-primary break-words"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src?.trim()) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary user/CDN URLs from Markdown
      <img
        src={src.trim()}
        alt={alt?.trim() ? alt : ""}
        className="my-8 w-full max-w-full rounded-xl border border-border/60 bg-muted/20 object-contain shadow-sm [max-height:min(72vh,640px)]"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  },
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return <code className={cn("font-mono text-[13px]", className)}>{children}</code>;
    }
    return (
      <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[13px] text-foreground dark:bg-primary/15">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-border/70 bg-muted/40 p-4 font-mono text-[13px] leading-relaxed dark:bg-muted/25">
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-6 border-l-[3px] border-primary/50 pl-4 text-[15px] italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border/80" />,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-8 w-full overflow-x-auto rounded-xl border border-border/70 bg-card/30 shadow-sm">
      <table className="w-full min-w-[min(100%,36rem)] border-collapse text-left text-[14px] leading-snug">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="border-b border-border bg-muted/50 dark:bg-muted/30">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => <tbody className="divide-y divide-border/60">{children}</tbody>,
  tr: ({ children }: { children?: React.ReactNode }) => <tr className="transition-colors hover:bg-muted/25">{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-3 py-2.5 font-semibold text-foreground first:pl-4 last:pr-4">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-3 py-2.5 align-top text-foreground/90 first:pl-4 last:pr-4 [&_a]:break-all">{children}</td>
  ),
  del: ({ children }: { children?: React.ReactNode }) => (
    <del className="text-muted-foreground line-through">{children}</del>
  ),
};

export function BlogPostBody({ content }: { content: string }) {
  const prepared = prepareBlogMarkdown(content);
  return (
    <div className="max-w-[52rem]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {prepared}
      </ReactMarkdown>
    </div>
  );
}
