"use client";

import { GenerativeCover } from "@/components/fx/generative-cover";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { cn } from "@/lib/utils";
import { getWikiUrl } from "@/lib/wiki-links";
import Link from "next/link";
import { useState } from "react";

/** Stock placeholders are not real screenshots — render generated cover art instead. */
function isPlaceholder(src: string): boolean {
  return !src || src.includes("picsum.photos");
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (isPlaceholder(src) || error) {
    return (
      <GenerativeCover
        seed={alt}
        label={alt}
        className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.05]"
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
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
    <SpotlightCard tilt={4} className={cn("group flex h-full flex-col overflow-hidden", className)}>
      {/* Image */}
      <div className="relative shrink-0 overflow-hidden rounded-t-[1.2rem]">
                {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <ProjectImage src={image ?? ""} alt={title} />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3.5 p-5 sm:p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="poster text-2xl leading-snug tracking-tight text-foreground">{title}</h3>
            <time className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">{dates}</time>
          </div>
          {caseStudyHref && (
            <Link
              href={caseStudyHref}
              className="shrink-0 rounded-none border border-border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              Case study
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const url = getWikiUrl(tag);
              const chip = (
                <span className="rounded-none border border-border/60 bg-muted/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary">
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
                className="inline-flex items-center gap-1.5 rounded-none border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {link.icon}
                {link.type}
              </Link>
            ))}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
