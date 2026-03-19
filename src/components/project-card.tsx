"use client";

import { Badge } from "@/components/ui/badge";
import { TextWithWikiLinks } from "@/components/ui/text-with-wiki-links";
import { cn } from "@/lib/utils";
import { getWikiUrl } from "@/lib/wiki-links";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  if (!src || imageError) {
    return <div className="w-full h-48 bg-muted" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
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
        "flex flex-col border border-border rounded-xl overflow-hidden hover:ring-2 cursor-pointer hover:ring-muted transition-all duration-200",
        className
      )}
    >
      <div className="relative shrink-0">
        <Link
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-48 object-cover"
            />
          ) : image ? (
            <ProjectImage src={image} alt={title} />
          ) : (
            <div className="w-full h-48 bg-muted" />
          )}
        </Link>
        {links && links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {links.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90" variant="default">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{title}</h3>
            <time className="text-xs text-muted-foreground">{dates}</time>
          </div>
          <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="text-xs text-pretty font-sans leading-relaxed text-muted-foreground">
          <TextWithWikiLinks text={description} />
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {tags.map((tag) => {
              const url = getWikiUrl(tag);
              const badge = (
                <Badge
                  className="text-[11px] font-medium border border-border h-6 w-fit px-2 inline-flex items-center gap-1"
                  variant="outline"
                >
                  {tag}
                  {url && <ExternalLink className="h-2.5 w-2.5 opacity-70 shrink-0" aria-hidden />}
                </Badge>
              );
              return url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={tag}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:opacity-90 transition-opacity"
                >
                  {badge}
                </a>
              ) : (
                <span key={tag}>{badge}</span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
