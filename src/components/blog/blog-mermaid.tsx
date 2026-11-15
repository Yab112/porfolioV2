"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

/** Diagram block (```mermaid). Loaded on demand; falls back to the source if it cannot be drawn. */
export function BlogMermaid({ code, natural = false }: { code: string; natural?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: resolvedTheme === "dark" ? "dark" : "neutral",
          fontFamily: "inherit",
          // `natural`: keep the diagram at its real size and let the frame scroll, instead of shrinking it to fit.
          er: { useMaxWidth: !natural },
        });
        const out = await mermaid.render(`mmd${id}`, code);
        if (!cancelled) setSvg(out.svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, id, resolvedTheme, natural]);

  if (failed) {
    return (
      <pre className="my-8 overflow-x-auto border border-border bg-card p-5 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    );
  }
  return (
    <figure className="my-10 overflow-x-auto border border-border bg-card p-4">
      {svg ? (
        <div
          className={natural ? "w-max min-w-full [&_svg]:h-auto [&_svg]:max-w-none" : "flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="h-40 animate-pulse bg-muted/40" aria-label="Loading diagram" />
      )}
    </figure>
  );
}
