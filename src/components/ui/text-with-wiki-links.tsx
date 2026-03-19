"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getWikiSegments } from "@/lib/wiki-links";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const linkClass =
  "inline-flex items-center gap-0.5 border-b border-dashed border-primary/50 text-foreground rounded px-0.5 transition-colors hover:border-primary hover:text-primary hover:underline hover:underline-offset-2 cursor-pointer";

interface TextWithWikiLinksProps {
  text: string;
  className?: string;
  linkClassName?: string;
  showHint?: boolean;
}

export function TextWithWikiLinks({
  text,
  className,
  linkClassName,
  showHint = false,
}: TextWithWikiLinksProps) {
  const segments = getWikiSegments(text);
  const hasLinks = segments.some((s) => s.type === "link");

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{seg.content}</span>
        ) : (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <a
                href={seg.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(linkClass, linkClassName)}
              >
                {seg.content}
                <ExternalLink className="h-3 w-3 opacity-70 shrink-0" aria-hidden />
              </a>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={6}
              className="z-[9999] max-w-xs rounded-xl border border-border bg-card p-3 text-left shadow-lg"
            >
              <span className="text-xs text-muted-foreground">Look up on Wikipedia</span>
            </TooltipContent>
          </Tooltip>
        )
      )}
      {showHint && hasLinks && (
        <span className="mt-2 block text-[11px] text-muted-foreground/80">
          Terms link to Wikipedia; click to learn more.
        </span>
      )}
    </span>
  );
}
