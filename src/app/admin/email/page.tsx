"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Btn, Field, Notice, PageTitle, Pill, api, inputCls, shortDate, useApi } from "../_lib";

type Template = { id: string; key: string; name: string; subject: string; body_md: string };
type Preview = { subject: string; html: string; unfilled: string[] };
type Sent = { id: string; created_at: string; to_email: string; subject: string; status: string; provider: string; error: string | null };
type Status = { provider: string; from: string | null; note: string | null };

const SYNTAX = "**bold**  *italic*  [label](https://link)  - list item  > quote  ## Heading  [[Button|https://link]]  {{first_name}} {{owner_name}} {{site}}";

export default function AdminEmail() {
  const templates = useApi<{ items: Template[] }>("admin/email/templates");
  const status = useApi<Status>("admin/email/status");
  const sent = useApi<{ items: Sent[] }>("admin/email/sent?limit=20");
  const [to, setTo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("to");
    if (preset) setTo(preset);
  }, []);

  // Start from the first template so the page never opens on an empty editor.
  const items = templates.data?.items;
  useEffect(() => {
    if (items?.length && !templateId && !body) pick(items[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // The preview is rendered by the API, so it is exactly what the recipient gets.
  useEffect(() => {
    if (!subject.trim() || !body.trim()) {
      setPreview(null);
      return;
    }
    const mine = ++seq.current;
    const t = setTimeout(async () => {
      try {
        const p = await api<Preview>("admin/email/preview", { method: "POST", body: { to, first_name: firstName || null, subject, body } });
        if (mine === seq.current) setPreview(p);
      } catch {
        /* keep the last good preview while typing */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [to, firstName, subject, body]);

  function pick(t: Template) {
    setTemplateId(t.id);
    setSubject(t.subject);
    setBody(t.body_md);
    setConfirming(false);
  }

  const current = items?.find((t) => t.id === templateId);
  const validTo = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to.trim());

  async function run(fn: () => Promise<string>) {
    setBusy(true);
    setMsg(null);
    try {
      setMsg({ kind: "ok", text: await fn() });
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  const send = () =>
    run(async () => {
      const r = await api<{ detail: string }>("admin/email/send", {
        method: "POST",
        body: { to: to.trim(), first_name: firstName || null, subject, body, template_key: current?.key ?? null },
      });
      await sent.reload();
      return r.detail;
    });

  const saveTemplate = (asNew: boolean) =>
    run(async () => {
      if (asNew || !current) {
        const name = window.prompt("Name for the new template");
        if (!name?.trim()) throw new Error("No name given, nothing saved.");
        const t = await api<Template>("admin/email/templates", { method: "POST", body: { name: name.trim(), subject, body_md: body } });
        await templates.reload();
        setTemplateId(t.id);
        return `Saved as “${t.name}”.`;
      }
      await api(`admin/email/templates/${current.id}`, { method: "PATCH", body: { name: current.name, subject, body_md: body } });
      await templates.reload();
      return `Updated “${current.name}”.`;
    });

  return (
    <main>
      <PageTitle title="Email" sub="Write to anyone in your branded layout. Only the body changes; the header, signature and footer stay the same." />
      {templates.error ? <div className="mb-4"><Notice kind="error">{templates.error}</Notice></div> : null}
      {status.data ? (
        <div className="mb-5">
          <Notice kind={status.data.provider === "resend" ? "ok" : "info"}>
            {status.data.provider === "resend" ? `Sending through Resend as ${status.data.from}.` : status.data.note}
          </Notice>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Templates">
            {(items ?? []).map((t) => (
              <Btn key={t.id} tone={t.id === templateId ? "primary" : "plain"} onClick={() => pick(t)} className="h-8">
                {t.name}
              </Btn>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
            <Field label="To">
              <input type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@company.com" className={inputCls} />
            </Field>
            <Field label="First name" hint="Optional.">
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label="Subject">
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Body">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={15} className={cn(inputCls, "font-mono text-[13px] leading-relaxed")} />
          </Field>
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">{SYNTAX}</p>

          {preview?.unfilled.length ? <Notice kind="error">Not filled in yet: {preview.unfilled.map((v) => `{{${v}}}`).join(", ")}. Replace or remove before sending.</Notice> : null}
          {msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : null}

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
            {confirming ? (
              <>
                <span className="text-[13.5px]">
                  Send “{preview?.subject ?? subject}” to <strong>{to.trim()}</strong>?
                </span>
                <Btn tone="primary" disabled={busy} onClick={send}>
                  {busy ? "Sending…" : "Yes, send"}
                </Btn>
                <Btn disabled={busy} onClick={() => setConfirming(false)}>
                  Cancel
                </Btn>
              </>
            ) : (
              <>
                <Btn tone="primary" disabled={busy || !validTo || !subject.trim() || !body.trim() || Boolean(preview?.unfilled.length)} onClick={() => setConfirming(true)}>
                  Send email
                </Btn>
                {current ? (
                  <Btn disabled={busy || (current.subject === subject && current.body_md === body)} onClick={() => saveTemplate(false)}>
                    Update “{current.name}”
                  </Btn>
                ) : null}
                <Btn disabled={busy || !body.trim()} onClick={() => saveTemplate(true)}>
                  Save as new template
                </Btn>
              </>
            )}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">What they receive</span>
            <span className="truncate text-[13px] text-muted-foreground">{preview ? preview.subject : ""}</span>
          </div>
          {preview ? (
            <iframe title="Email preview" sandbox="" srcDoc={preview.html} className="h-[42rem] w-full border border-border bg-white" />
          ) : (
            <div className="flex h-[42rem] items-center justify-center border border-dashed border-border text-sm text-muted-foreground">Write a subject and a body to see the email.</div>
          )}
        </section>
      </div>

      <section className="mt-12">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Recently sent</h2>
        {sent.error ? <Notice kind="error">{sent.error}</Notice> : null}
        {sent.data && sent.data.items.length === 0 ? <p className="text-sm text-muted-foreground">Nothing sent from here yet.</p> : null}
        <ul className="divide-y divide-border border-border [&:not(:empty)]:border">
          {(sent.data?.items ?? []).map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-card px-4 py-2.5 text-[13.5px]">
              <span className="min-w-0 flex-1 basis-56 truncate">
                <span className="font-medium">{s.to_email}</span> <span className="text-muted-foreground">· {s.subject}</span>
              </span>
              {s.error ? <span className="basis-full text-[12px] text-destructive">{s.error}</span> : null}
              <Pill>{s.status === "sent" ? "success" : "failed"}</Pill>
              <span className="text-[12px] text-muted-foreground">
                {shortDate(s.created_at)} · {s.provider}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
