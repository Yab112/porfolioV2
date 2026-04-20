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
      <p className="mt-2">
        <Link href="/privacy" className="text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline">
          Privacy
        </Link>
      </p>
    </footer>
  );
}
