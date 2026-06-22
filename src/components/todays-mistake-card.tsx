"use client";

import {
  DAILY_LESSONS,
  indexForLocalDay,
  lessonFlavorLabel,
  randomLessonIndex,
} from "@/data/daily-lessons";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

const DOUBLED = [...DAILY_LESSONS, ...DAILY_LESSONS];

function ScrollColumn({
  direction,
  startOffset = 0,
}: {
  direction: "up" | "down";
  startOffset?: number;
}) {
  return (
    <div
      className="absolute inset-y-0 w-48 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <div
        className="scroll-col flex flex-col gap-3 py-4"
        style={{
          animation: `scroll-${direction} 40s linear infinite`,
          animationDelay: `-${startOffset}s`,
        }}
      >
        {DOUBLED.map((lesson, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 space-y-1"
          >
            <span className="block text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/50">
              {lessonFlavorLabel(lesson.flavor)}
            </span>
            <p className="text-[11px] leading-relaxed text-muted-foreground/50 line-clamp-3">
              {lesson.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TodaysMistakeCard() {
  const [index, setIndex] = useState<number | null>(null);
  const [shuffled, setShuffled] = useState(false);

  const pickToday = useCallback(() => {
    setIndex(indexForLocalDay(new Date(), DAILY_LESSONS.length));
    setShuffled(false);
  }, []);

  useEffect(() => {
    pickToday();
  }, [pickToday]);

  const lesson = index !== null ? DAILY_LESSONS[index] : null;

  const handleShuffle = () => {
    if (index === null) return;
    setIndex(randomLessonIndex(index, DAILY_LESSONS.length));
    setShuffled(true);
  };

  return (
    <section
      id="todays-lesson"
      aria-labelledby="todays-lesson-heading"
      className="relative w-full h-screen overflow-hidden border-y border-border"
    >
      {/* Left scroll column */}
      <div className="hidden md:block absolute left-4 inset-y-0 w-48">
        <ScrollColumn direction="up" startOffset={0} />
      </div>

      {/* Right scroll column */}
      <div className="hidden md:block absolute right-4 inset-y-0 w-48">
        <ScrollColumn direction="down" startOffset={20} />
      </div>

      {/* Center — always full height, content vertically centered */}
      <div className="relative h-full flex flex-col items-center justify-center gap-8 text-center px-6 md:px-56">
        <div className="space-y-1">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground/60">
            {shuffled ? "random draw" : "today's pick"}
          </p>
          <h2
            id="todays-lesson-heading"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Yesterday&apos;s me
          </h2>
        </div>

        {!lesson ? (
          <div className="w-full max-w-sm space-y-3">
            {[100, 88, 70].map((w, i) => (
              <div
                key={i}
                className="mx-auto h-4 animate-pulse rounded bg-muted"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : (
          <blockquote
            className="max-w-md space-y-4"
            aria-live={shuffled ? "polite" : "off"}
          >
            <p className="text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
              &ldquo;{lesson.text}&rdquo;
            </p>
            <footer className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary">
              — {lessonFlavorLabel(lesson.flavor)}
            </footer>
          </blockquote>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={handleShuffle}
            disabled={index === null}
            className={cn(
              "rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:border-primary/50 hover:text-foreground",
              "disabled:cursor-not-allowed disabled:opacity-40"
            )}
          >
            Draw another
          </button>
          <button
            type="button"
            onClick={pickToday}
            disabled={index === null || !shuffled}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors duration-200",
              "text-muted-foreground/50 hover:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-30"
            )}
          >
            Back to today&apos;s
          </button>
        </div>
      </div>
    </section>
  );
}
