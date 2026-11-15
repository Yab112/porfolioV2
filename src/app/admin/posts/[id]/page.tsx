"use client";

import { BlogPostBody } from "@/components/blog/blog-post-body";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Btn, Field, Notice, Pill, api, inputCls, useApi } from "../../_lib";

type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_md: string;
  status: string;
  tags: string[];
  image_url: string | null;
  resource_links?: { title: string; url: string }[];
};

export default function AdminPostEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, error, loading, setData } = useApi<Post>(`admin/posts/${id}`);
  const [form, setForm] = useState<Post | null>(null);
  const [view, setView] = useState<"split" | "write" | "preview">("split");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const dirty = Boolean(form && data && JSON.stringify(form) !== JSON.stringify(data));
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (loading && !form) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <Notice kind="error">{error}</Notice>;
  if (!form) return null;

  const set = <K extends keyof Post>(key: K, value: Post[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));
  const words = form.body_md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;

  async function save(status?: string) {
    if (!form) return;
    setBusy(true);
    setMsg(null);
    try {
      const saved = await api<Post>(`admin/posts/${id}`, {
        method: "PATCH",
        body: {
          title: form.title,
          description: form.description,
          body_md: form.body_md,
          tags: form.tags,
          slug: form.slug,
          image_url: form.image_url ?? "",
          ...(status ? { status } : {}),
        },
      });
      setData(saved);
      setMsg({
        kind: "ok",
        text: status === "published" ? "Published. It is live on the blog within a minute." : status === "draft" ? "Unpublished and saved as a draft." : "Saved.",
      });
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Could not save" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete “${form?.title}”? This cannot be undone.`)) return;
    try {
      await api(`admin/posts/${id}`, { method: "DELETE" });
      router.push("/admin/posts");
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Could not delete" });
    }
  }

  return (
    <main>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-[13px]">
          <Link href="/admin/posts" className="text-muted-foreground hover:text-foreground">
            ← All posts
          </Link>
          <Pill>{data?.status ?? form.status}</Pill>
          <span className="text-muted-foreground">
            {words.toLocaleString()} words{dirty ? " · unsaved changes" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn tone="danger" onClick={remove} disabled={busy}>
            Delete
          </Btn>
          <Btn onClick={() => save()} disabled={busy || !dirty}>
            Save
          </Btn>
          {data?.status === "published" ? (
            <>
              <a href={`/blog/${data.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center border border-border bg-card px-3 text-[13px] font-medium hover:border-primary/50">
                View live
              </a>
              <Btn onClick={() => save("draft")} disabled={busy}>
                Unpublish
              </Btn>
            </>
          ) : (
            <Btn tone="primary" onClick={() => save("published")} disabled={busy}>
              {dirty ? "Save and publish" : "Publish"}
            </Btn>
          )}
        </div>
      </div>
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="URL slug" hint={`/blog/${form.slug}`}>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={cn(inputCls, "font-mono text-[13px]")} />
        </Field>
        <Field label="Summary" hint="Shown under the title, on cards and in search results.">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className={inputCls} />
        </Field>
        <div className="space-y-4">
          <Field label="Tags" hint="Comma separated.">
            <input
              value={form.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trimStart()))}
              className={inputCls}
            />
          </Field>
          <Field label="Cover image URL">
            <input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} placeholder="https://" className={inputCls} />
          </Field>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Article</span>
        <div className="flex gap-1">
          {(["write", "split", "preview"] as const).map((v) => (
            <Btn key={v} tone={view === v ? "primary" : "plain"} onClick={() => setView(v)} className={cn("h-7 px-2 text-[12px] capitalize", v === "split" && "hidden lg:inline-flex")}>
              {v}
            </Btn>
          ))}
        </div>
      </div>
      <div className={cn("grid gap-4", view === "split" && "lg:grid-cols-2")}>
        {view !== "preview" ? (
          <textarea
            value={form.body_md}
            onChange={(e) => set("body_md", e.target.value)}
            spellCheck
            aria-label="Article Markdown"
            className={cn(inputCls, "h-[75vh] resize-none font-mono text-[13px] leading-relaxed")}
          />
        ) : null}
        {view !== "write" ? (
          <div className={cn("h-[75vh] overflow-y-auto border border-border bg-background px-5 py-6", view === "split" && "hidden lg:block", view === "preview" && "block")}>
            <BlogPostBody content={form.body_md} />
          </div>
        ) : null}
      </div>
      <details className="mt-4 text-[13px] text-muted-foreground">
        <summary className="cursor-pointer">Blocks you can use in the article</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Chart: a <code>```chart</code> block with JSON: <code>type</code> (line, area, bar, scatter), <code>title</code>, <code>x</code>, <code>series</code>, <code>unit</code>, <code>caption</code>,{" "}
            <code>basis</code> (sourced or illustrative) and <code>source</code>.
          </li>
          <li>
            Figure: a <code>```figure</code> block with JSON: <code>src</code>, <code>alt</code>, <code>caption</code>, <code>credit</code>, <code>license</code>, <code>source_url</code>.
          </li>
          <li>Diagram: a <code>```mermaid</code> block. Table: a normal Markdown table.</li>
          <li>
            Footnote: <code>[^1]</code> in the text and <code>[^1]: note with a link</code> at the end. Callout: a quote starting with <code>[!KEY]</code>, <code>[!NOTE]</code> or{" "}
            <code>[!WARNING]</code>.
          </li>
        </ul>
      </details>
    </main>
  );
}
