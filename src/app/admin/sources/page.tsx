"use client";

import { useState } from "react";
import { Loading, Btn, Field, Notice, PageTitle, Pill, api, inputCls, timeAgo, useApi } from "../_lib";

type Source = {
  key: string;
  name: string;
  url: string;
  feed_url: string | null;
  kind: string;
  tier: number;
  grp: string;
  enabled: boolean;
  last_checked_at: string | null;
  last_status: string | null;
  last_error: string | null;
  items_total: number;
};
const HOW: Record<string, string> = { feed: "feed", page: "page scan", json: "API", reference: "data reference" };

export default function AdminSources() {
  const { data, error, loading, reload } = useApi<{ items: Source[]; items_total: number }>("newsroom/sources");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", feed_url: "", tier: 2 });

  async function run(fn: () => Promise<unknown>, ok: string) {
    setMsg(null);
    try {
      await fn();
      setMsg({ kind: "ok", text: ok });
      await reload();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong" });
    }
  }

  const sources = data?.items ?? [];
  const groups = [1, 2, 3, 4].map((tier) => sources.filter((s) => s.tier === tier)).filter((g) => g.length);
  const failing = sources.filter((s) => s.enabled && s.last_status === "failed").length;

  return (
    <main>
      <PageTitle title="Sources" sub="The trusted places the news desk reads. Posts are researched from these and cite them.">
        <Btn onClick={() => setAdding((v) => !v)}>{adding ? "Cancel" : "Add source"}</Btn>
        <Btn tone="primary" onClick={() => run(() => api("newsroom/collect", { method: "POST", body: {} }), "Reading all sources in the background. Refresh in a minute.")}>
          Read all now
        </Btn>
      </PageTitle>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      {loading && !data ? <Loading rows={8} /> : null}

      {adding ? (
        <form
          className="mb-6 grid gap-3 border border-border bg-card p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const key = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
            void run(async () => {
              await api("newsroom/sources", { method: "POST", body: { key, name: form.name.trim(), url: form.url.trim(), feed_url: form.feed_url.trim() || null, tier: form.tier } });
              setAdding(false);
              setForm({ name: "", url: "", feed_url: "", tier: 2 });
            }, "Source added. It is read on the next run.");
          }}
        >
          <Field label="Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Page URL">
            <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://" className={inputCls} />
          </Field>
          <Field label="Feed URL" hint="RSS or Atom. Leave empty to scan the page for article links.">
            <input value={form.feed_url} onChange={(e) => setForm({ ...form, feed_url: e.target.value })} placeholder="https://…/feed.xml" className={inputCls} />
          </Field>
          <Field label="Tier" hint="1 lab · 2 newsroom · 3 papers and benchmarks · 4 data companies">
            <select value={form.tier} onChange={(e) => setForm({ ...form, tier: Number(e.target.value) })} className={inputCls}>
              {[1, 2, 3, 4].map((t) => (
                <option key={t} value={t}>
                  Tier {t}
                </option>
              ))}
            </select>
          </Field>
          <Btn type="submit" tone="primary" className="md:col-span-2 md:justify-self-start">
            Add source
          </Btn>
        </form>
      ) : null}

      {data ? (
        <p className="mb-6 text-[13.5px] text-muted-foreground">
          {data.items_total.toLocaleString()} articles collected from {sources.filter((s) => s.enabled).length} active sources.
          {failing ? ` ${failing} could not be read on the last run; the reason is shown on each.` : ""}
        </p>
      ) : null}

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group[0].tier}>
            <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Tier {group[0].tier} · {group[0].grp}
            </h2>
            <ul className="divide-y divide-border border border-border">
              {group.map((s) => (
                <li key={s.key} className={`flex flex-wrap items-center gap-x-4 gap-y-2 bg-card px-4 py-3 ${s.enabled ? "" : "opacity-60"}`}>
                  <div className="min-w-0 flex-1 basis-64">
                    <div className="flex flex-wrap items-center gap-2">
                      <a href={s.url} target="_blank" rel="noreferrer" className="font-medium hover:text-primary">
                        {s.name}
                      </a>
                      <Pill>{HOW[s.kind] ?? s.kind}</Pill>
                      {s.kind === "reference" ? null : !s.enabled ? <Pill>paused</Pill> : s.last_status ? <Pill>{s.last_status === "ok" ? "success" : "failed"}</Pill> : <Pill>not read yet</Pill>}
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {s.kind === "reference"
                        ? "Not read as news. Offered to the writer as a place to take benchmark numbers from."
                        : s.last_error
                          ? s.last_error
                          : `${s.items_total} articles${s.last_checked_at ? ` · read ${timeAgo(s.last_checked_at)}` : ""}`}
                    </p>
                  </div>
                  {s.kind !== "reference" ? (
                    <div className="flex gap-2">
                      <Btn className="h-8" onClick={() => run(() => api(`newsroom/collect?source=${s.key}`, { method: "POST", body: {} }), `Reading ${s.name}.`)}>
                        Read now
                      </Btn>
                      <Btn className="h-8" onClick={() => run(() => api(`newsroom/sources/${s.key}`, { method: "PATCH", body: { enabled: !s.enabled } }), s.enabled ? `${s.name} paused.` : `${s.name} resumed.`)}>
                        {s.enabled ? "Pause" : "Resume"}
                      </Btn>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
