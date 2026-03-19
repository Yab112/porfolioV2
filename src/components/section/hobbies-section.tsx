"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink, Goal } from "lucide-react";
import Link from "next/link";

const BLUR_DELAY = 0.04;

export default function HobbiesSection() {
  const h = DATA.hobbies;
  if (!h) return null;

  return (
    <section id="hobbies" className="mt-16  max-w-4xl mx-auto mb-16">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_DELAY * 12}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Hobbies</h2>
            <p className="text-sm text-muted-foreground max-w-xl">{h.intro}</p>
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_DELAY * 13} className="grid gap-8 md:grid-cols-[minmax(0,200px)_1fr] items-start">
          <div className="mx-auto md:mx-0 w-full max-w-[200px] rounded-lg overflow-hidden border border-border shadow-sm bg-card">
            <img
              src={h.bookImage}
              alt={`${h.bookTitle} cover`}
              className="w-full h-auto object-cover aspect-[2/3]"
              width={200}
              height={300}
            />
          </div>
          <div className="space-y-4 min-w-0">
            <div className="flex items-start gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{h.bookTitle}</h3>
                <p className="text-sm text-muted-foreground">{h.bookAuthor}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{h.bookNote}</p>

            <div className="flex items-start gap-2 pt-2">
              <Goal className="size-5 text-primary shrink-0 mt-0.5" aria-hidden />
              <p className="text-sm text-muted-foreground leading-relaxed">
                I follow and play football when I can; it&apos;s the reset button after long debugging sessions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={h.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
                )}
              >
                LeetCode profile
                <ExternalLink className="size-3.5 opacity-70" />
              </Link>
              <Link
                href={h.codeforcesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
                )}
              >
                Codeforces profile
                <ExternalLink className="size-3.5 opacity-70" />
              </Link>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
