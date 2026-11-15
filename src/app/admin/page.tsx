"use client";

import Link from "next/link";
import { Empty, Notice, PageTitle, Pill, timeAgo, useApi } from "./_lib";
import { WritePostForm } from "./posts/_write-form";

type Overview = {
  inbox: { open: number; total: number; latest: { id: string; visitor_email: string | null; user_query: string; created_at: string; status: string }[] };
  posts: { draft: number | null; review: number | null; published: number | null };
  ideas_pending: number | null;
  leads: number | null;
  projects: number | null;
  generation: { running: boolean; error?: string | null; topic?: string | null };
};

function Stat({ label, value, href, note }: { label: string; value: number | null | undefined; href: string; note?: string }) {
  return (
    <Link href={href} className="block border border-border bg-card p-4 transition-colors hover:border-primary/50">
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="poster mt-1 text-5xl tabular-nums">{value ?? "—"}</div>
      {note ? <div className="mt-1 text-[12px] text-muted-foreground">{note}</div> : null}
    </Link>
  );
}

export default function AdminOverview() {
  const { data, error, loading, reload } = useApi<Overview>("admin/overview");

  return (
    <main>
      <PageTitle title="Overview" sub="What needs you today." />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {loading && !data ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
      {data ? (
        <div className="space-y-10">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Open conversations" value={data.inbox.open} href="/admin/inbox" note={`${data.inbox.total} in total`} />
            <Stat label="Posts to review" value={(data.posts.review ?? 0) + (data.posts.draft ?? 0)} href="/admin/posts" note={`${data.posts.published ?? 0} published`} />
            <Stat label="Ideas queued" value={data.ideas_pending} href="/admin/posts#ideas" />
            <Stat label="Leads captured" value={data.leads} href="/admin/inbox" />
          </section>

          <div className="grid gap-10 lg:grid-cols-2">
            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Latest conversations</h2>
              {data.inbox.latest.length === 0 ? (
                <Empty>No conversations yet. When the site agent hands a visitor over, they appear here.</Empty>
              ) : (
                <ul className="divide-y divide-border border border-border bg-card">
                  {data.inbox.latest.map((a) => (
                    <li key={a.id}>
                      <Link href={`/admin/inbox?id=${a.id}`} className="block px-4 py-3 hover:bg-muted/40">
                        <div className="flex items-center justify-between gap-3 text-[13px]">
                          <span className="truncate font-medium">{a.visitor_email ?? "No email left"}</span>
                          <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                            <Pill>{a.status}</Pill>
                            {timeAgo(a.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{a.user_query}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Write a post</h2>
              <WritePostForm running={data.generation.running} onStarted={reload} />
              {data.generation.error ? <div className="mt-3"><Notice kind="error">Last run failed: {data.generation.error}</Notice></div> : null}
            </section>
          </div>
        </div>
      ) : null}
    </main>
  );
}
