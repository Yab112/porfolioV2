"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PITCH: { match: (p: string) => boolean; title: string; body: string }[] = [
  {
    match: (p) => p.startsWith("/work/"),
    title: "Want something like this built?",
    body: "Tell me what you are trying to ship. I will reply with how I would build it and how long it takes.",
  },
  {
    match: (p) => p.startsWith("/blog"),
    title: "Need this in your product?",
    body: "I do this work for clients: agents, RAG, automation and the systems around them.",
  },
  {
    match: (p) => p.startsWith("/learning"),
    title: "Building with machine learning?",
    body: "I bring the production side: evaluation, monitoring, and systems that keep working after launch.",
  },
];

/** Closing call to action on every page except Contact itself. */
export function WorkWithMe() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/privacy") return null;
  const pitch = PITCH.find((p) => p.match(pathname)) ?? {
    title: "Want me to work with you?",
    body: "I take on a small number of projects at a time. Send me the problem and I will tell you honestly whether I am the right person.",
  };

  return (
    <aside className="mt-32 border-y border-border py-12" aria-label="Work with me">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-2xl space-y-4">
          <p className="section-kicker">Next step</p>
          <p className="poster text-balance text-5xl sm:text-6xl">{pitch.title}</p>
          <p className="text-lg leading-relaxed text-muted-foreground">{pitch.body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/contact" className="act act-solid">
            Start a project <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            className="act"
            onClick={() => window.dispatchEvent(new CustomEvent("aegis:open"))}
          >
            Ask my agent first
          </button>
        </div>
      </div>
    </aside>
  );
}
