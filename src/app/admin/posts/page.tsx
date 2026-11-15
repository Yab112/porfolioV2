"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Btn, Empty, Field, Loading, Notice, PageTitle, Pager, Pill, api, inputCls, shortDate, timeAgo, useApi } from "../_lib";
import { WritePostForm } from "./_write-form";

type Post = { id: string; slug: string; title: string; description: string; status: string; tags: string[]; published_at: string | null; created_at: string };
type Idea = { id: string; created_at: string; source: string; source_url: string | null; title: string; angle: string; skill_fit: string; status: string };
type Generation = { running: boolean; error?: string | null; topic?: string | null; result?: { slug?: string; status?: string } | null };

const FILTERS = ["all", "review", "draft", "published"] as const;
const PAGE = 20;

export default function AdminPosts() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [offset, setOffset] = useState(0);
  const posts = useApi<{ items: Post[]; total: number }>(`admin/posts?limit=${PAGE}&offset=${offset}${filter === "all" ? "" : `&status=${filter}`}`);
  const ideas = useApi<{ items: Idea[] }>("admin/ideas");
  const gen = useApi<Generation>("admin/generation");
  const [err, setErr] = useState<string | null>(null);
  const [ideaTitle, setIdeaTitle] = useState("");

  // While the writer runs, poll; when it stops, refresh the list once.
  const running = Boolean(gen.data?.running);
  const reloadGen = gen.reload;
  const reloadPosts = posts.reload;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(reloadGen, 8000);
    return () => {
      clearInterval(t);
      void reloadPosts();
    };
  }, [running, reloadGen, reloadPosts]);

  async function act(fn: () => Promise<unknown>) {
    setErr(null);
    try {
      await fn();
      await Promise.all([posts.reload(), ideas.reload()]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  const items = posts.data?.items ?? [];

  return (
    <main className="space-y-12">
      <section>
        <PageTitle title="Blog" sub="Every post the writer produced, and the ones you wrote.">
          {FILTERS.map((f) => (
            <Btn
              key={f}
              tone={filter === f ? "primary" : "plain"}
              onClick={() => {
                setFilter(f);
                setOffset(0);
              }}
              className="h-8 capitalize"
            >
              {f}
            </Btn>
          ))}
        </PageTitle>
        {err || posts.error ? <div className="mb-4"><Notice kind="error">{err ?? posts.error}</Notice></div> : null}
        {running ? (
          <div className="mb-4">
            <Notice>The writer is researching and writing{gen.data?.topic ? `: “${gen.data.topic}”` : ""}. This page updates when it finishes.</Notice>
          </div>
        ) : gen.data?.error ? (
          <div className="mb-4"><Notice kind="error">Last writer run failed: {gen.data.error}</Notice></div>
        ) : null}
        {posts.loading && !posts.data ? <Loading /> : null}
        {posts.data && items.length === 0 ? <Empty>No posts here yet.</Empty> : null}
        <ul className="divide-y divide-border border-border [&:not(:empty)]:border">
          {items.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-card px-4 py-3">
              <div className="min-w-0 flex-1 basis-64">
                <Link href={`/admin/posts/${p.id}`} className="font-medium hover:text-primary">
                  {p.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                  <Pill>{p.status}</Pill>
                  {p.status === "published" ? `Published ${shortDate(p.published_at)}` : `Written ${timeAgo(p.created_at)}`}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/posts/${p.id}`} className="inline-flex h-8 items-center border border-border bg-card px-3 text-[13px] font-medium hover:border-primary/50">
                  Read and edit
                </Link>
                {p.status === "published" ? (
                  <>
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center border border-border bg-card px-3 text-[13px] font-medium hover:border-primary/50">
                      View live
                    </a>
                    <Btn className="h-8" onClick={() => act(() => api(`admin/posts/${p.id}`, { method: "PATCH", body: { status: "draft" } }))}>
                      Unpublish
                    </Btn>
                  </>
                ) : (
                  <Btn className="h-8" tone="primary" onClick={() => act(() => api(`admin/posts/${p.id}`, { method: "PATCH", body: { status: "published" } }))}>
                    Publish
                  </Btn>
                )}
              </div>
            </li>
          ))}
        </ul>
        {posts.data ? <Pager total={posts.data.total} limit={PAGE} offset={offset} onChange={setOffset} /> : null}
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Write a post</h2>
          <WritePostForm running={running} onStarted={gen.reload} />
        </section>

        <section id="ideas">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Idea queue</h2>
          <form
            className="mb-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void act(async () => {
                await api("admin/ideas", { method: "POST", body: { title: ideaTitle.trim() } });
                setIdeaTitle("");
              });
            }}
          >
            <Field label="Add an idea">
              <input value={ideaTitle} onChange={(e) => setIdeaTitle(e.target.value)} placeholder="A post you want written later" className={inputCls} />
            </Field>
            <Btn type="submit" disabled={ideaTitle.trim().length < 6} className="mt-[22px]">
              Queue
            </Btn>
          </form>
          {ideas.error ? <Notice kind="error">{ideas.error}</Notice> : null}
          {ideas.loading && !ideas.data ? <Loading rows={3} /> : null}
          {ideas.data && ideas.data.items.length === 0 ? <Empty>The queue is empty. The idea radar refills it on schedule.</Empty> : null}
          <ul className="max-h-[28rem] divide-y divide-border overflow-y-auto border-border [&:not(:empty)]:border">
            {(ideas.data?.items ?? []).map((i) => (
              <li key={i.id} className="flex items-start gap-3 bg-card px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium">{i.title}</div>
                  {i.angle ? <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{i.angle}</p> : null}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                    <Pill>{i.source}</Pill>
                    fit: {i.skill_fit}
                    {i.source_url ? (
                      <a href={i.source_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                        source
                      </a>
                    ) : null}
                  </div>
                </div>
                <Btn className="h-8" onClick={() => act(() => api(`admin/ideas/${i.id}/skip`, { method: "POST", body: {} }))}>
                  Skip
                </Btn>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
