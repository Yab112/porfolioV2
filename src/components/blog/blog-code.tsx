"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

const LANG_LABEL: Record<string, string> = {
  ts: "TypeScript", tsx: "TypeScript", typescript: "TypeScript", js: "JavaScript", jsx: "JavaScript", javascript: "JavaScript",
  py: "Python", python: "Python", sh: "Shell", bash: "Shell", shell: "Shell", zsh: "Shell", sql: "SQL", json: "JSON",
  yaml: "YAML", yml: "YAML", go: "Go", rust: "Rust", rs: "Rust", html: "HTML", css: "CSS", diff: "Diff", text: "Text",
};

/** Code block with a header (file name or language) and a copy button. Highlighting comes from rehype-highlight. */
export function BlogCode({ lang, title, children }: { lang?: string; title?: string; children: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard refused: the text is still selectable */
    }
  }

  return (
    <figure className="blog-code my-8 overflow-hidden border border-border bg-card">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-1.5">
        <span className="min-w-0 truncate font-mono text-[11px] text-muted-foreground">
          {title ? <span className="text-foreground">{title}</span> : (lang && LANG_LABEL[lang]) || lang || "Code"}
          {title && lang ? <span className="ml-2 opacity-70">{LANG_LABEL[lang] ?? lang}</span> : null}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5 text-[var(--green)]" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre ref={preRef} className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        {children}
      </pre>
    </figure>
  );
}
