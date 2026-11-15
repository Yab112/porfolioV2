"use client";

import { useState } from "react";
import { Btn, Field, Notice, api, inputCls } from "../_lib";

/** Ask the writer agent for a post: from a topic you give it, or from the best queued idea. */
export function WritePostForm({ running, onStarted }: { running: boolean; onStarted?: () => void }) {
  const [title, setTitle] = useState("");
  const [angle, setAngle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function start(useTopic: boolean) {
    setBusy(true);
    setMsg(null);
    try {
      await api("admin/posts/generate", {
        method: "POST",
        body: useTopic
          ? { title: title.trim(), angle: angle.trim() || null, source_url: sourceUrl.trim() || null, status: "review" }
          : { status: "review" },
      });
      setMsg({ kind: "ok", text: "Researching and writing. It takes a few minutes; the post lands in Review and you get a Telegram message." });
      setTitle("");
      setAngle("");
      setSourceUrl("");
      onStarted?.();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Could not start" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 border border-border bg-card p-4">
      <Field label="Topic">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Why RAG pipelines fail on tables" className={inputCls} />
      </Field>
      <Field label="Angle" hint="Optional. The argument you want the post to make.">
        <textarea value={angle} onChange={(e) => setAngle(e.target.value)} rows={2} className={inputCls} />
      </Field>
      <Field label="Start from this page" hint="Optional. A URL the writer should read and cite.">
        <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://" className={inputCls} />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Btn tone="primary" disabled={busy || running || title.trim().length < 6} onClick={() => start(true)}>
          {running ? "Writer is running…" : "Write this post"}
        </Btn>
        <Btn disabled={busy || running} onClick={() => start(false)}>
          Write from the idea queue
        </Btn>
      </div>
      {msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : null}
    </div>
  );
}
