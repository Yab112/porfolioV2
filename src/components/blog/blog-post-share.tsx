"use client";

import { cn } from "@/lib/utils";
import { Copy, Facebook, Globe, Linkedin, Mail, MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";

export type BlogPostShareProps = {
  /** Full absolute URL to share (canonical or page URL). */
  url: string;
  title: string;
  className?: string;
};

function shareTargets(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const tWithLink = encodeURIComponent(`${title}\n\n${url}`);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    reddit: `https://www.reddit.com/submit?url=${u}&title=${t}`,
    whatsapp: `https://wa.me/?text=${tWithLink}`,
    email: `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n\n${url}`)}`,
  };
}

export function BlogPostShare({ url, title, className }: BlogPostShareProps) {
  const s = shareTargets(url, title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  const btn =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-card/60 px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <section aria-label="Share this post" className={cn("space-y-3", className)}>
      <h2 className="text-sm font-semibold tracking-tight text-foreground">Share</h2>
      <p className="text-xs text-muted-foreground">Post to your network or copy the link.</p>
      <div className="flex flex-wrap gap-2">
        <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className={btn} title="Share on LinkedIn">
          <Linkedin className="size-4 shrink-0 text-[#0A66C2]" aria-hidden />
          LinkedIn
        </a>
        <a href={s.x} target="_blank" rel="noopener noreferrer" className={btn} title="Share on X (Twitter)">
          <Share2 className="size-4 shrink-0 opacity-90" aria-hidden />
          X
        </a>
        <a href={s.facebook} target="_blank" rel="noopener noreferrer" className={btn} title="Share on Facebook">
          <Facebook className="size-4 shrink-0 text-[#1877F2]" aria-hidden />
          Facebook
        </a>
        <a href={s.reddit} target="_blank" rel="noopener noreferrer" className={btn} title="Share on Reddit">
          <Globe className="size-4 shrink-0 text-[#FF4500]" aria-hidden />
          Reddit
        </a>
        <a href={s.whatsapp} target="_blank" rel="noopener noreferrer" className={btn} title="Share on WhatsApp">
          <MessageCircle className="size-4 shrink-0 text-[#25D366]" aria-hidden />
          WhatsApp
        </a>
        <a href={s.email} className={btn} title="Share by email">
          <Mail className="size-4 shrink-0 opacity-80" aria-hidden />
          Email
        </a>
        <button type="button" onClick={copy} className={btn} title="Copy link to clipboard">
          <Copy className="size-4 shrink-0 opacity-80" aria-hidden />
          Copy link
        </button>
      </div>
    </section>
  );
}
