"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Btn, Empty, Loading, Notice, PANE, PageTitle, Pager, Pill, inputCls, shortDate, timeAgo, useApi } from "../_lib";

type Person = {
  email: string;
  first_seen: string | null;
  last_seen: string | null;
  conversations: number;
  chat_sessions: number;
  emails_sent: number;
  last_emailed?: string;
  intents: string[];
  last_question: string;
  open: number;
};
type Detail = {
  email: string;
  conversations: { id: string; created_at: string; user_query: string; status: string; intent: string | null }[];
  sessions: { id: string; updated_at: string; messages: { role: string; content: string }[] }[];
  mail: { created_at: string; subject?: string; body_md?: string; sent_body?: string; body?: string; status?: string; channel?: string }[];
};

type PeoplePage = { items: Person[]; total: number; everyone: number; waiting: number; anonymous_conversations: number };
const PAGE = 25;

export default function AdminPeople() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [only, setOnly] = useState<"" | "waiting">("");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  // Search runs on the server, a moment after you stop typing.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(query.trim());
      setOffset(0);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, error, loading } = useApi<PeoplePage>(
    `admin/people?limit=${PAGE}&offset=${offset}&only=${only}&q=${encodeURIComponent(search)}`
  );
  const people = data?.items ?? [];

  return (
    <main>
      <PageTitle title="People" sub="Everyone who left an email on your site: what they asked, and what you have sent them.">
        {(["", "waiting"] as const).map((f) => (
          <Btn
            key={f || "all"}
            tone={only === f ? "primary" : "plain"}
            className="h-8"
            onClick={() => {
              setOnly(f);
              setOffset(0);
            }}
          >
            {f ? "Waiting for you" : "Everyone"}
            {data ? <span className="tabular-nums opacity-70">{f ? data.waiting : data.everyone}</span> : null}
          </Btn>
        ))}
      </PageTitle>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by email or question" aria-label="Search people" className={cn(inputCls, "mb-4 max-w-md")} />
      {loading && !data ? <Loading /> : null}
      {data ? (
        <>
          <p className="mb-4 text-[13.5px] text-muted-foreground">
            {data.everyone} people with an email. {data.waiting} asked something and have not had an email from you yet. {data.anonymous_conversations} conversations left no email, so they cannot be contacted.
          </p>
          {people.length === 0 ? <Empty>No one matches.</Empty> : null}
          <div className={cn("grid gap-6", selected && "lg:grid-cols-[minmax(0,1fr)_28rem]")}>
            <div className={cn(PANE, loading && "opacity-60")}>
              <ul className="divide-y divide-border border-border [&:not(:empty)]:border">
                {people.map((p) => (
                  <li key={p.email}>
                    <button type="button" onClick={() => setSelected(p.email)} className={cn("block w-full px-4 py-3 text-left hover:bg-muted/40", selected === p.email ? "bg-muted/60" : "bg-card")}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{p.email}</span>
                        <span className="text-[12px] text-muted-foreground">last seen {timeAgo(p.last_seen)}</span>
                      </div>
                      {p.last_question ? <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{p.last_question}</p> : null}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
                        {p.open > 0 && p.emails_sent === 0 ? <Pill>open</Pill> : null}
                        {p.intents.map((i) => (
                          <Pill key={i}>{i}</Pill>
                        ))}
                        <span>
                          {p.conversations} handed over · {p.chat_sessions} chats · {p.emails_sent} emails from you
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <Pager total={data.total} limit={PAGE} offset={offset} onChange={setOffset} />
            </div>
            {selected ? <PersonPane key={selected} email={selected} onClose={() => setSelected(null)} /> : null}
          </div>
        </>
      ) : null}
    </main>
  );
}

function PersonPane({ email, onClose }: { email: string; onClose: () => void }) {
  const { data, error, loading } = useApi<Detail>(`admin/people/${encodeURIComponent(email)}`);
  return (
    <aside className={cn(PANE, "space-y-5 self-start border border-border bg-card p-4")}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="break-all text-[16px] font-semibold">{email}</h2>
        <button type="button" onClick={onClose} className="text-[13px] text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>
      <Link href={`/admin/email?to=${encodeURIComponent(email)}`} className="inline-flex h-9 items-center border border-primary bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:bg-primary/90">
        Write an email
      </Link>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {loading && !data ? <Loading kind="detail" /> : null}
      {data ? (
        <>
          <Block title={`Asked you (${data.conversations.length})`}>
            {data.conversations.map((c) => (
              <li key={c.id} className="border-l-2 border-[var(--green)] pl-3">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  {shortDate(c.created_at)} <Pill>{c.status}</Pill>
                  <Link href={`/admin/inbox?id=${c.id}`} className="underline underline-offset-2">
                    open in inbox
                  </Link>
                </div>
                <p className="text-[13.5px]">{c.user_query}</p>
              </li>
            ))}
          </Block>
          <Block title={`You sent (${data.mail.length})`}>
            {data.mail.map((m, i) => (
              <li key={i} className="border-l-2 border-[var(--purple)] pl-3">
                <div className="font-mono text-[11px] text-muted-foreground">
                  {shortDate(m.created_at)} {m.status === "failed" ? "· failed" : ""} {m.channel ? `· from ${m.channel}` : ""}
                </div>
                {m.subject ? <div className="text-[13.5px] font-medium">{m.subject}</div> : null}
                <p className="line-clamp-4 whitespace-pre-wrap text-[13px] text-muted-foreground">{m.body_md ?? m.sent_body ?? m.body}</p>
              </li>
            ))}
          </Block>
          <Block title={`Chats with the site agent (${data.sessions.length})`}>
            {data.sessions.map((s) => (
              <li key={s.id}>
                <details>
                  <summary className="cursor-pointer text-[13px]">
                    {shortDate(s.updated_at)} · {s.messages.length} recent messages
                  </summary>
                  <div className="mt-2 space-y-1.5">
                    {s.messages.map((m, i) => (
                      <p key={i} className={cn("text-[13px]", m.role === "user" || m.role === "human" ? "" : "text-muted-foreground")}>
                        <span className="font-mono text-[10px] uppercase">{m.role === "user" || m.role === "human" ? "Visitor" : "Agent"}: </span>
                        {m.content}
                      </p>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </Block>
        </>
      ) : null}
    </aside>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </section>
  );
}
