"use client";

import { cn } from "@/lib/utils";
import { PANE, Pill, shortDate } from "../_lib";

type Sig = { score?: number } & Record<string, unknown>;
export type Keyword = {
  id?: string;
  phrase: string;
  display?: string;
  category: string;
  category_label?: string;
  suggested_format: string;
  score: number;
  reason: string;
  status?: string;
  item_count: number;
  source_count: number;
  updated_at?: string;
  in_library?: boolean;
  signals: {
    coverage?: Sig & { sources?: number; lab_sources?: number; items?: number };
    momentum?: Sig & { last_48h?: number };
    freshness?: Sig & { age_hours?: number };
    search?: Sig & {
      suggestions?: string[];
      trend?: { recent: number; before: number; change: number; series: number[] } | null;
      wikipedia?: { article: string; daily_views: number; url: string } | null;
      available?: string[];
    };
    community?: Sig & {
      hacker_news?: { stories: number; top_points: number } | null;
      github?: { repos: number; top_repo?: string | null } | null;
      hugging_face?: { models: number; top_model?: string | null } | null;
    };
    format_reason?: string;
  };
  sources?: { title: string; url: string; source: string; tier?: number; published_at?: string }[];
};

const WEIGHTS: [keyof Keyword["signals"], string, number][] = [
  ["coverage", "Coverage", 28],
  ["search", "Search interest", 25],
  ["freshness", "Freshness", 18],
  ["momentum", "Momentum", 17],
  ["community", "Builder activity", 12],
];

function Bar({ label, value, weight, note }: { label: string; value: number; weight: number; note: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[13px]">
        <span className="font-medium">
          {label} <span className="font-normal text-muted-foreground">· {weight}% of score</span>
        </span>
        <span className="font-mono tabular-nums">{value.toFixed(2)}</span>
      </div>
      <div className="mt-1 h-1.5 w-full bg-border" aria-hidden>
        <div className="h-full bg-[var(--purple)]" style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">{note}</p>
    </div>
  );
}

/** Trends series as a small line: direction matters here, not exact values. */
function Spark({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 220;
  const h = 36;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - (v / max) * (h - 4)).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} role="img" aria-label="Search interest over the last 30 days" className="mt-1 block max-w-full">
      <polyline points={pts} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

export function KeywordDetail({ keyword: k, onClose }: { keyword: Keyword; onClose: () => void }) {
  const s = k.signals ?? {};
  const search = s.search ?? {};
  const community = s.community ?? {};
  const notes: Record<string, string> = {
    coverage: `${s.coverage?.sources ?? 0} trusted sources, ${s.coverage?.lab_sources ?? 0} of them labs, ${s.coverage?.items ?? 0} articles.`,
    search: search.available?.length ? `From ${search.available.join(", ")}.` : "No outside search data yet; it is fetched on the next refresh.",
    freshness: `First trusted article ${Math.round(s.freshness?.age_hours ?? 0)} hours ago.`,
    momentum: `${s.momentum?.last_48h ?? 0} of the articles are from the last 48 hours.`,
    community: [
      community.hacker_news ? `${community.hacker_news.stories} Hacker News stories this week (top ${community.hacker_news.top_points} points)` : null,
      community.github ? `${community.github.repos.toLocaleString()} active GitHub repos` : null,
      community.hugging_face ? `${community.hugging_face.models} Hugging Face models` : null,
    ]
      .filter(Boolean)
      .join(" · ") || "No builder data yet.",
  };

  return (
    <aside className={cn(PANE, "space-y-5 self-start border border-border bg-card p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="poster text-5xl tabular-nums leading-none">{Math.round(k.score)}</div>
          <h2 className="mt-2 text-[17px] font-semibold">{k.display || k.phrase}</h2>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Pill>{k.category_label ?? k.category}</Pill>
            <Pill>{k.suggested_format}</Pill>
            {k.in_library === false ? <Pill>not in your sources</Pill> : null}
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-[13px] text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>
      <p className="text-[13px] text-muted-foreground">
        {k.reason} {s.format_reason}
      </p>

      <div className="space-y-3">
        {WEIGHTS.map(([key, label, weight]) => (
          <Bar key={key} label={label} weight={weight} value={Number((s[key] as Sig | undefined)?.score ?? 0)} note={notes[key]} />
        ))}
      </div>

      {search.trend ? (
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Google Trends, last 30 days</h3>
          <Spark values={search.trend.series} />
          <p className="text-[12px] text-muted-foreground">
            This week {search.trend.recent} vs {search.trend.before} before ({search.trend.change >= 0 ? "+" : ""}
            {Math.round(search.trend.change * 100)}%). Relative scale, 100 is the peak.
          </p>
        </div>
      ) : null}
      {search.wikipedia ? (
        <p className="text-[13px]">
          <a href={search.wikipedia.url} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
            {search.wikipedia.article}
          </a>{" "}
          <span className="text-muted-foreground">gets about {search.wikipedia.daily_views.toLocaleString()} Wikipedia views a day.</span>
        </p>
      ) : null}
      {search.suggestions?.length ? (
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">People also search</h3>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {search.suggestions.map((q) => (
              <li key={q} className="border border-border px-2 py-0.5 text-[12px]">
                {q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {k.sources?.length ? (
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Pages the writer will read</h3>
          <ul className="mt-1.5 space-y-2">
            {k.sources.map((src) => (
              <li key={src.url} className="text-[13px] leading-snug">
                <a href={src.url} target="_blank" rel="noreferrer" className="hover:text-primary">
                  {src.title}
                </a>
                <div className="font-mono text-[11px] text-muted-foreground">
                  {src.source} · tier {src.tier} · {shortDate(src.published_at)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
