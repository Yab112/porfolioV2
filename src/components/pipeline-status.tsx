"use client";

import { SpotlightCard } from "@/components/fx/spotlight-card";
import { cn } from "@/lib/utils";
import { PenLine, Radar, Send, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface PipelineJob {
  name: string;
  title: string;
  description: string;
  enabled: boolean;
  last_status: string | null;
  last_run_at: string | null;
  next_run_at: string | null;
}

const ICONS: Record<string, LucideIcon> = {
  blog_ideas: Radar,
  blog_draft: PenLine,
  blog_publish: Send,
};

function until(iso: string | null, now: number): string {
  if (!iso) return "—";
  const ms = new Date(iso).getTime() - now;
  if (!Number.isFinite(ms)) return "—";
  if (ms <= 0) return "any moment";
  const m = Math.floor(ms / 60_000);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${Math.max(1, m)}m`;
}

function ago(iso: string | null, now: number): string {
  if (!iso) return "not yet run";
  const m = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (!Number.isFinite(m) || m < 0) return "just now";
  if (m < 60) return `${Math.max(1, m)}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
}

function tone(job: PipelineJob): { dot: string; label: string } {
  if (!job.enabled) return { dot: "bg-muted-foreground", label: "paused" };
  if (job.last_status === "running") return { dot: "bg-sky-400", label: "running" };
  if (job.last_status === "failed") return { dot: "bg-amber-400", label: "retrying" };
  return { dot: "bg-signal", label: "healthy" };
}

/**
 * Live view of the backend content pipeline (ideas → writer → publisher).
 * Renders nothing until the backend answers, so an offline API never breaks the page.
 */
export function PipelineStatus({ className }: { className?: string }) {
  const [jobs, setJobs] = useState<PipelineJob[] | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/automation")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (alive && d && Array.isArray(d.jobs) && d.jobs.length) setJobs(d.jobs);
        })
        .catch(() => undefined);
    load();
    const poll = window.setInterval(load, 120_000);
    const clock = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      alive = false;
      window.clearInterval(poll);
      window.clearInterval(clock);
    };
  }, []);

  if (!jobs) return null;

  return (
    <SpotlightCard className={cn("p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <p className="note">Live system</p>
          <h3 className="poster text-3xl">This blog runs itself.</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Three scheduled agents inside my own backend find ideas, write and publish — no third-party cron.
            These are their real schedules, read live from the API.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-none border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="pulse-ring absolute inset-0 rounded-none bg-signal [animation:pulse-ring_1.8s_ease-out_infinite]" />
            <span className="relative size-1.5 rounded-none bg-signal" />
          </span>
          live
        </span>
      </div>

      <ol className="relative mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
        <svg
          aria-hidden
          className="absolute left-0 top-7 hidden h-px w-full overflow-visible md:block"
          preserveAspectRatio="none"
        >
          <line
            x1="56"
            x2="69%"
            y1="0"
            y2="0"
            stroke="var(--green)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            className="flow-dash opacity-60 [animation:flow-dash_1.2s_linear_infinite]"
          />
        </svg>
        {jobs.map((job, i) => {
          const Icon = ICONS[job.name] ?? Radar;
          const t = tone(job);
          return (
            <li key={job.name} className="relative flex gap-4 md:flex-col md:gap-5">
              <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-none border border-border bg-card">
                <Icon className="size-5 text-ink-purple" aria-hidden />
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-none border border-border bg-background font-mono text-[9px] text-muted-foreground">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">{job.title}</h4>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className={cn("size-1.5 rounded-none", t.dot)} />
                    {t.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{job.description}</p>
                <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  next in <span className="text-foreground">{until(job.next_run_at, now)}</span>
                  <span className="mx-1.5 opacity-40">/</span>
                  last {ago(job.last_run_at, now)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </SpotlightCard>
  );
}
