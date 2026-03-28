import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { FileDown, Github, Linkedin } from "lucide-react";
import Link from "next/link";

const BLUR_DELAY = 0.04;

const linkClass = cn(
  "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground",
  "transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

export default function ConnectStripSection() {
  const c = DATA.contact;
  const linkedIn = c.social.LinkedIn.url;
  const github = c.social.GitHub.url;
  const pdf = c.resumePdfUrl;

  return (
    <section id="connect" className="mt-12 mb-4 max-w-4xl mx-auto">
      <BlurFade delay={BLUR_DELAY * 14}>
        <div className=" bg-card/40 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="space-y-1 flex-1 min-w-0">
              <h2 className="text-xl font-bold">Connect</h2>
              <p className="text-sm text-muted-foreground max-w-xl text-pretty leading-relaxed">
                {c.connectIntro}
              </p>
            </div>
            <nav
              className="flex flex-wrap items-center gap-2 md:justify-end shrink-0"
              aria-label="Profile and resume links"
            >
              <Link
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <Linkedin className="size-4 text-[#0077b5]" aria-hidden />
                LinkedIn
              </Link>
              <Link
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <Github className="size-4 text-[#181717] dark:text-white" aria-hidden />
                GitHub
              </Link>
              <a
                href={pdf}
                download
                className={linkClass}
              >
                <FileDown className="size-4 text-red-600 dark:text-red-500" aria-hidden />
                Download CV
              </a>
            </nav>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
