"use client";

import { cn } from "@/lib/utils";
import { getWikiUrl } from "@/lib/wiki-links";
import Link from "next/link";
import { useState } from "react";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <div className="w-full aspect-[4/3] bg-muted" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      onError={() => setError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  caseStudyHref?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  video?: string;
  links?: readonly { icon: React.ReactNode; type: string; href: string }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  caseStudyHref,
  description,
  dates,
  tags,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border border-border overflow-hidden bg-card/30 transition-all duration-200 hover:border-primary/30 hover:shadow-sm",
        className
      )}
    >
      {/* Image */}
      <div className="relative shrink-0 overflow-hidden">
        {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-[4/3] object-cover"
          />
        ) : (
          <ProjectImage src={image ?? ""} alt={title} />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm leading-snug text-foreground">{title}</h3>
            <time className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">{dates}</time>
          </div>
          {caseStudyHref && (
            <Link
              href={caseStudyHref}
              className="shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              Case study
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 flex-1">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const url = getWikiUrl(tag);
              const chip = (
                <span className="rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary">
                  {tag}
                </span>
              );
              return url ? (
                <a
                  key={tag}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {chip}
                </a>
              ) : (
                <span key={tag}>{chip}</span>
              );
            })}
          </div>
        )}

        {/* Links */}
        {links && links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {link.icon}
                {link.type}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
