"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Btn, Empty, Loading, Notice, PANE, PageTitle, Pager, Pill, api, inputCls, shortDate, timeAgo, useApi } from "../_lib";

type Alert = {
  id: string;
  created_at: string;
  session_id: string;
  visitor_email: string | null;
  user_query: string;
  intent: string | null;
  status: string;
};
type Conversation = {
  alert: Alert;
  messages: { role: string; content: string }[];
  replies: { id: string; created_at: string; channel: string; body: string; sent_body: string; delivered: boolean }[];
  suggested_reply: string;
};

const FILTERS = ["open", "replied", "handled", "all"] as const;
const PAGE = 25;

export default function AdminInbox() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("open");
  const [offset, setOffset] = useState(0);
  const list = useApi<{ items: Alert[]; total: number; counts: Record<string, number> }>(
    `admin/inbox?limit=${PAGE}&offset=${offset}${filter === "all" ? "" : `&status=${filter}`}`
  );
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setSelected(id);
      setFilter("all");
    }
  }, []);

  const items = list.data?.items ?? [];

  return (
    <main>
      <PageTitle title="Inbox" sub="Visitors the site agent handed over to you. Reply here and they get your email.">
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
            {list.data?.counts?.[f] !== undefined ? <span className="tabular-nums opacity-70">{list.data.counts[f]}</span> : null}
          </Btn>
        ))}
      </PageTitle>
      {list.error ? <Notice kind="error">{list.error}</Notice> : null}
      <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className={cn(PANE, selected && "hidden lg:block", list.loading && list.data && "opacity-60")}>
          {list.loading && !list.data ? <Loading /> : null}
          {list.data && items.length === 0 ? <Empty>{filter === "open" ? "Inbox zero. Nothing is waiting for you." : "Nothing here."}</Empty> : null}
          <ul className="divide-y divide-border border-border [&:not(:empty)]:border">
            {items.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setSelected(a.id)}
                  className={cn("block w-full px-4 py-3 text-left hover:bg-muted/40", selected === a.id ? "bg-muted/60" : "bg-card")}
                >
                  <div className="flex items-center justify-between gap-2 text-[13px]">
                    <span className="truncate font-medium">{a.visitor_email ?? "No email left"}</span>
                    <span className="shrink-0 text-[12px] text-muted-foreground">{timeAgo(a.created_at)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{a.user_query}</p>
                  <div className="mt-2 flex gap-1.5">
                    <Pill>{a.status}</Pill>
                    {a.intent ? <Pill>{a.intent}</Pill> : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {list.data ? <Pager total={list.data.total} limit={PAGE} offset={offset} onChange={setOffset} /> : null}
        </div>
        <div className={cn(PANE, !selected && "hidden lg:block")}>
          {selected ? (
            <ConversationPane key={selected} id={selected} onBack={() => setSelected(null)} onChanged={list.reload} />
          ) : (
            <Empty>Pick a conversation to read the transcript and reply.</Empty>
          )}
        </div>
      </div>
    </main>
  );
}

function ConversationPane({ id, onBack, onChanged }: { id: string; onBack: () => void; onChanged: () => void }) {
  const { data, error, loading, reload } = useApi<Conversation>(`admin/inbox/${id}`);
  const [text, setText] = useState("");
  const [polish, setPolish] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function send() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ detail: string }>(`admin/inbox/${id}/reply`, { method: "POST", body: { text, polish } });
      setMsg({ kind: "ok", text: r.detail });
      setText("");
      await reload();
      onChanged();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Could not send" });
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(status: string) {
    try {
      await api(`admin/inbox/${id}/status`, { method: "POST", body: { status } });
      await reload();
      onChanged();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Could not update" });
    }
  }

  if (loading && !data) return <Loading kind="detail" />;
  if (error) return <Notice kind="error">{error}</Notice>;
  if (!data) return null;
  const { alert } = data;
  const canReply = Boolean(alert.visitor_email);

  return (
    <article className="border border-border bg-card">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <button type="button" onClick={onBack} className="mb-1 text-[12px] text-muted-foreground hover:text-foreground lg:hidden">
            ← All conversations
          </button>
          <div className="truncate text-[15px] font-semibold">{alert.visitor_email ?? "No email left"}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            <Pill>{alert.status}</Pill>
            {shortDate(alert.created_at)} · session {alert.session_id.slice(0, 8)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {alert.status !== "handled" ? <Btn className="h-8" onClick={() => setStatus("handled")}>Mark handled</Btn> : <Btn className="h-8" onClick={() => setStatus("open")}>Reopen</Btn>}
          {alert.status !== "spam" ? <Btn className="h-8" tone="danger" onClick={() => setStatus("spam")}>Spam</Btn> : null}
        </div>
      </header>

      <div className="space-y-3 px-4 py-4">
        {data.messages.length === 0 ? (
          <div className="border-l-2 border-[var(--green)] pl-3 text-[14px]">
            <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Visitor asked</div>
            {alert.user_query}
          </div>
        ) : (
          data.messages.map((m, i) => {
            const visitor = m.role === "user" || m.role === "human";
            return (
              <div key={i} className={cn("border-l-2 pl-3 text-[14px] leading-relaxed", visitor ? "border-[var(--green)]" : "border-border text-muted-foreground")}>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{visitor ? "Visitor" : "Site agent"}</div>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            );
          })
        )}
        {data.replies.map((r) => (
          <div key={r.id} className="border-l-2 border-[var(--purple)] pl-3 text-[14px] leading-relaxed">
            <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              You, by email from {r.channel} · {shortDate(r.created_at)} {r.delivered ? "" : "· not delivered"}
            </div>
            <p className="whitespace-pre-wrap">{r.sent_body || r.body}</p>
          </div>
        ))}
      </div>

      <footer className="space-y-3 border-t border-border px-4 py-4">
        {canReply ? (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder={`Write to ${alert.visitor_email}…`}
              className={inputCls}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Btn tone="primary" disabled={busy || !text.trim()} onClick={send}>
                {busy ? "Sending…" : "Send email"}
              </Btn>
              <Btn disabled={busy} onClick={() => setText(data.suggested_reply)}>
                Use suggested reply
              </Btn>
              <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <input type="checkbox" checked={polish} onChange={(e) => setPolish(e.target.checked)} />
                Tidy my wording before sending
              </label>
            </div>
          </>
        ) : (
          <Notice>This visitor did not leave an email, so there is nowhere to send a reply.</Notice>
        )}
        {msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : null}
      </footer>
    </article>
  );
}
