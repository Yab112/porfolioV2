import { DATA } from "@/data/resume";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t border-border/70 pt-8 text-center text-xs text-muted-foreground"
      role="contentinfo"
    >
      <p className="font-mono tabular-nums">
        &copy; {year} {DATA.name}. All rights reserved.
      </p>
      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link href="/work" className="text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline">
          Work
        </Link>
        <span className="text-border" aria-hidden>
          ·
        </span>
        <Link href="/privacy" className="text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline">
          Privacy
        </Link>
      </p>
    </footer>
  );
}
