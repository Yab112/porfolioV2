"use client";

import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Btn, Empty, Field, Loading, Notice, PageTitle, Pill, api, inputCls, useApi } from "../_lib";
import { ImageUpload } from "../_upload";

type Row = {
  id: string;
  slug: string;
  title: string;
  description: string;
  dates: string;
  href: string | null;
  image: string | null;
  technologies: string[];
  links: { type: string; href: string }[];
  visible: boolean;
  featured: boolean;
  active: boolean;
  client: boolean;
  sort_order: number;
};
type Draft = Omit<Row, "id"> & { id?: string };
type Item = { slug: string; title: string; description: string; builtIn: boolean; row?: Row; position: number };

const BUILT_IN = DATA.projects.map((p, i) => ({
  slug: p.slug as string,
  title: p.title as string,
  description: p.description as string,
  dates: p.dates as string,
  href: p.href as string,
  image: p.image as string,
  technologies: [...p.technologies] as string[],
  links: p.links.map((l) => ({ type: l.type as string, href: l.href as string })),
  position: 100 + i,
}));

export default function AdminProjects() {
  const { data, error, loading, reload } = useApi<{ items: Row[] }>("admin/projects");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const items = useMemo<Item[]>(() => {
    const rows = data?.items ?? [];
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    const builtIn = BUILT_IN.map((b) => {
      const row = bySlug.get(b.slug);
      return { slug: b.slug, title: row?.title || b.title, description: row?.description || b.description, builtIn: true, row, position: row?.sort_order ?? b.position };
    });
    const known = new Set(BUILT_IN.map((b) => b.slug));
    const added = rows
      .filter((r) => !known.has(r.slug))
      .map((r) => ({ slug: r.slug, title: r.title, description: r.description, builtIn: false, row: r, position: r.sort_order }));
    return [...builtIn, ...added].sort(
      (a, b) => Number(Boolean(b.row?.featured)) - Number(Boolean(a.row?.featured)) || a.position - b.position
    );
  }, [data]);

  function startEdit(item: Item) {
    const base = BUILT_IN.find((b) => b.slug === item.slug);
    setErr(null);
    setDraft(
      item.row
        ? { ...item.row }
        : {
            slug: item.slug,
            title: base?.title ?? "",
            description: base?.description ?? "",
            dates: base?.dates ?? "",
            href: base?.href ?? "",
            image: base?.image ?? "",
            technologies: base?.technologies ?? [],
            links: base?.links ?? [],
            visible: true,
            featured: false,
            active: true,
            client: false,
            sort_order: base?.position ?? 200,
          }
    );
  }

  function startNew() {
    setErr(null);
    setDraft({ slug: "", title: "", description: "", dates: "", href: "", image: "", technologies: [], links: [], visible: true, featured: false, active: true, client: false, sort_order: 50 });
  }

  /** Change one setting on a project; a built-in project gets its override row on first change. */
  async function quick(item: Item, patch: Partial<Row>) {
    setErr(null);
    try {
      if (item.row) await api(`admin/projects/${item.row.id}`, { method: "PATCH", body: patch });
      else await api("admin/projects", { method: "POST", body: { slug: item.slug, title: item.title, sort_order: item.position, ...patch } });
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not update");
    }
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setErr(null);
    const { id, ...rest } = draft;
    // Half-typed link lines and empty tags are dropped rather than sent.
    const body = {
      ...rest,
      links: rest.links.filter((l) => l.type && l.href.length > 3),
      technologies: rest.technologies.map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (id) await api(`admin/projects/${id}`, { method: "PATCH", body });
      else await api("admin/projects", { method: "POST", body });
      setDraft(null);
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Row, builtIn: boolean) {
    const question = builtIn ? `Reset “${row.title}” to the version built into the site?` : `Delete “${row.title}”? This cannot be undone.`;
    if (!window.confirm(question)) return;
    try {
      await api(`admin/projects/${row.id}`, { method: "DELETE" });
      setDraft(null);
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete");
    }
  }

  return (
    <main>
      <PageTitle title="Projects" sub="Edit, hide, feature and reorder what the Work page shows. Changes appear on the site within a minute.">
        <Btn tone="primary" onClick={startNew}>
          Add project
        </Btn>
      </PageTitle>
      {error || err ? <div className="mb-4"><Notice kind="error">{err ?? error}</Notice></div> : null}
      {loading && !data ? <Loading /> : null}

      <div className={cn("grid gap-6", draft && "lg:grid-cols-[minmax(0,1fr)_26rem]")}>
        <ul className="divide-y divide-border self-start border border-border">
          {items.map((item) => {
            const hidden = item.row?.visible === false;
            return (
              <li key={item.slug} className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 bg-card px-4 py-3", hidden && "opacity-60")}>
                <div className="min-w-0 flex-1 basis-56">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{item.title}</span>
                    {item.row?.featured ? <Pill>featured</Pill> : null}
                    {hidden ? <Pill>hidden</Pill> : null}
                    {!item.builtIn ? <Pill>added here</Pill> : item.row ? <Pill>edited</Pill> : null}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Btn className="h-8" onClick={() => quick(item, { featured: !item.row?.featured })}>
                    {item.row?.featured ? "Unfeature" : "Feature"}
                  </Btn>
                  <Btn className="h-8" onClick={() => quick(item, { visible: hidden })}>
                    {hidden ? "Show" : "Hide"}
                  </Btn>
                  <Btn className="h-8" onClick={() => startEdit(item)}>
                    Edit
                  </Btn>
                </div>
              </li>
            );
          })}
          {items.length === 0 ? <li><Empty>No projects yet.</Empty></li> : null}
        </ul>

        {draft ? (
          <aside className="space-y-3 self-start border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{draft.id ? "Edit project" : draft.slug ? "Customise project" : "New project"}</h2>
              <button type="button" onClick={() => setDraft(null)} className="text-[13px] text-muted-foreground hover:text-foreground">
                Close
              </button>
            </div>
            <Field label="Title">
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Description">
              <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={6} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Dates">
                <input value={draft.dates} onChange={(e) => setDraft({ ...draft, dates: e.target.value })} placeholder="2026" className={inputCls} />
              </Field>
              <Field label="Order" hint="Lower shows first.">
                <input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })} className={inputCls} />
              </Field>
            </div>
            <Field label="Main link">
              <input value={draft.href ?? ""} onChange={(e) => setDraft({ ...draft, href: e.target.value })} placeholder="https://" className={inputCls} />
            </Field>
            <Field label="Image">
              {draft.image ? (
                <div className="mb-2 flex items-center gap-3 border border-border bg-background p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.image} alt="" className="h-14 w-24 shrink-0 object-cover" />
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">{draft.image}</span>
                  <button type="button" onClick={() => setDraft({ ...draft, image: "" })} className="text-[12px] text-destructive hover:underline">
                    Remove
                  </button>
                </div>
              ) : null}
              <ImageUpload folder="projects" label={draft.image ? "Replace image" : "Upload image"} onUploaded={(url) => setDraft((d) => (d ? { ...d, image: url } : d))} />
            </Field>
            <Field label="Technologies" hint="Comma separated.">
              <input
                value={draft.technologies.join(", ")}
                onChange={(e) => setDraft({ ...draft, technologies: e.target.value.split(",").map((t) => t.trimStart()) })}
                className={inputCls}
              />
            </Field>
            <Field label="Links" hint="One per line: Label | https://…">
              <textarea
                value={draft.links.map((l) => `${l.type} | ${l.href}`).join("\n")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    links: e.target.value.split("\n").map((line) => {
                      const [type, ...rest] = line.split("|");
                      return { type: type.trim(), href: rest.join("|").trim() };
                    }),
                  })
                }
                rows={3}
                className={cn(inputCls, "font-mono text-[13px]")}
              />
            </Field>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
              {(["visible", "featured", "active", "client"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2 capitalize">
                  <input type="checkbox" checked={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.checked })} />
                  {k === "client" ? "Client work" : k === "active" ? "Still active" : k}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <Btn
                tone="primary"
                disabled={busy || draft.title.trim().length < 2}
                onClick={save}
              >
                {busy ? "Saving…" : "Save"}
              </Btn>
              {draft.id ? (
                <Btn tone="danger" onClick={() => remove(draft as Row, BUILT_IN.some((b) => b.slug === draft.slug))}>
                  {BUILT_IN.some((b) => b.slug === draft.slug) ? "Reset to built-in" : "Delete"}
                </Btn>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
