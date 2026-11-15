"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Btn, Empty, Field, Notice, PageTitle, Pill, api, inputCls, timeAgo, useApi } from "../_lib";
import { KeywordDetail, type Keyword } from "./_detail";

type Best = { items: Keyword[]; categories: Record<string, string> };
const STATUSES = ["candidate", "writing", "written", "dismissed"] as const;

export default function AdminKeywords() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("candidate");
  const [category, setCategory] = useState("");
  const list = useApi<Best>(`keywords/best?limit=40&status=${status}${category ? `&category=${category}` : ""}`);
  const [open, setOpen] = useState<Keyword | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function run(fn: () => Promise<unknown>, ok: string) {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg({ kind: "ok", text: ok });
      await list.reload();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  }

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      setOpen(await api<Keyword>(`keywords/analyze?q=${encodeURIComponent(query.trim())}`));
    } catch (err) {
      setMsg({ kind: "error", text: err instanceof Error ? err.message : "Could not analyse" });
    } finally {
      setBusy(false);
    }
  }

  const items = list.data?.items ?? [];
  const categories = list.data?.categories ?? {};

  return (
    <main>
      <PageTitle title="Keywords" sub="Topics that several trusted sources are covering, scored by coverage, search interest, builder activity and freshness.">
        <Btn disabled={busy} onClick={() => run(() => api("keywords/refresh", { method: "POST", body: {} }), "Recomputing in the background. Refresh this page in a minute.")}>
          Recompute now
        </Btn>
      </PageTitle>

      <form onSubmit={analyze} className="mb-6 flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1 basis-64">
          <Field label="Check any keyword">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. gemini 4, reward hacking, swe-bench" className={inputCls} />
          </Field>
        </div>
        <Btn type="submit" tone="primary" disabled={busy || query.trim().length < 2}>
          {busy ? "Checking…" : "Analyse"}
        </Btn>
      </form>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <Btn key={s} tone={status === s ? "primary" : "plain"} onClick={() => setStatus(s)} className="h-8 capitalize">
            {s === "candidate" ? "To write" : s}
          </Btn>
        ))}
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" className={cn(inputCls, "h-8 w-auto py-0 text-[13px]")}>
          <option value="">All categories</option>
          {Object.entries(categories).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      {list.error ? <Notice kind="error">{list.error}</Notice> : null}
      {list.loading && !list.data ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
      {list.data && items.length === 0 ? (
        <Empty>
          {status === "candidate"
            ? "No candidates yet. The source reader runs every three hours; a topic appears here once two independent sources cover it."
            : "Nothing here."}
        </Empty>
      ) : null}

      <div className={cn("grid gap-6", open && "lg:grid-cols-[minmax(0,1fr)_27rem]")}>
        <ul className="divide-y divide-border self-start border-border [&:not(:empty)]:border">
          {items.map((k) => (
            <li key={k.id} className={cn("grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 bg-card px-4 py-3", open?.id === k.id && "bg-muted/60")}>
              <div className="text-center">
                <div className="poster text-3xl tabular-nums leading-none">{Math.round(k.score)}</div>
                <div className="mt-1 h-1 w-full bg-border" aria-hidden>
                  <div className="h-full bg-[var(--green)]" style={{ width: `${Math.min(100, k.score)}%` }} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setOpen(k)} className="text-left font-medium hover:text-primary">
                    {k.display || k.phrase}
                  </button>
                  <Pill>{k.category_label ?? k.category}</Pill>
                  <Pill>{k.suggested_format}</Pill>
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">{k.reason}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                  <span>
                    {k.source_count} sources · {k.item_count} articles · updated {timeAgo(k.updated_at)}
                  </span>
                  <span className="ml-auto flex gap-2">
                    <Btn className="h-7 px-2 text-[12px]" onClick={() => setOpen(k)}>
                      Details
                    </Btn>
                    {k.status === "candidate" && k.id ? (
                      <>
                        <Btn className="h-7 px-2 text-[12px]" disabled={busy} onClick={() => run(() => api(`keywords/${k.id}/dismiss`, { method: "POST", body: {} }), "Dismissed.")}>
                          Dismiss
                        </Btn>
                        <Btn
                          tone="primary"
                          className="h-7 px-2 text-[12px]"
                          disabled={busy}
                          onClick={() => run(() => api(`keywords/${k.id}/write`, { method: "POST", body: {} }), `Writing “${k.display || k.phrase}”. It lands in Blog → Review in a few minutes.`)}
                        >
                          Write it
                        </Btn>
                      </>
                    ) : null}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {open ? <KeywordDetail keyword={open} onClose={() => setOpen(null)} /> : null}
      </div>
    </main>
  );
}
