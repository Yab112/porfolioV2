"use client";

import { BlogMermaid } from "@/components/blog/blog-mermaid";
import { useMemo } from "react";
import { Loading, Notice, useApi } from "../_lib";

type Column = { name: string; type: string; pk: boolean; required: boolean; fk: { table: string; column: string } | null };
type Table = { table: string; about: string; rows: number | null; columns: Column[] };
type Relation = { from: string; column: string; to: string; to_column: string; optional: boolean };
type Schema = { tables: Table[]; relations: Relation[] };

const SHORT: Record<string, string> = {
  "timestamp with time zone": "timestamptz",
  "character varying": "varchar",
  "double precision": "float8",
  "text[]": "text_array",
};

function diagram(schema: Schema): string {
  const lines = ["erDiagram"];
  for (const r of schema.relations) {
    // one parent row, zero or many child rows; the parent side is optional when the column may be empty
    lines.push(`  ${r.to} ${r.optional ? "|o" : "||"}--o{ ${r.from} : "${r.column}"`);
  }
  const linked = new Set(schema.relations.flatMap((r) => [r.from, r.to]));
  for (const t of schema.tables.filter((x) => linked.has(x.table))) {
    const keys = t.columns.filter((c) => c.pk || c.fk);
    const rest = t.columns.filter((c) => !c.pk && !c.fk).slice(0, 6);
    lines.push(`  ${t.table} {`);
    for (const c of [...keys, ...rest]) {
      const type = (SHORT[c.type] ?? c.type ?? "text").replace(/[^a-zA-Z0-9_]/g, "_") || "text";
      lines.push(`    ${type} ${c.name}${c.pk ? " PK" : c.fk ? " FK" : ""}`);
    }
    lines.push("  }");
  }
  return lines.join("\n");
}

/** How the tables connect: a diagram, then each link in words with its row counts. */
export function SchemaView() {
  const { data, error, loading } = useApi<Schema>("admin/schema");
  const code = useMemo(() => (data ? diagram(data) : ""), [data]);
  if (error) return <Notice kind="error">{error}</Notice>;
  if (loading && !data) return <Loading kind="table" />;
  if (!data) return null;

  const rows = new Map(data.tables.map((t) => [t.table, t.rows]));
  const linked = new Set(data.relations.flatMap((r) => [r.from, r.to]));
  const alone = data.tables.filter((t) => !linked.has(t.table));
  const count = (name: string) => (rows.get(name) ?? 0).toLocaleString();

  return (
    <div className="space-y-8">
      <p className="text-[13.5px] text-muted-foreground">
        {data.tables.length} tables, {data.relations.length} links between them. The diagram shows the {linked.size} tables that are linked. A line ending in a fork means &quot;many&quot;: one row
        on the plain side can have many rows on the fork side. Each box shows the key columns and the first few others; scroll sideways if it is wider than the page.
      </p>
      <BlogMermaid code={code} natural />

      <section>
        <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Links, in words</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[40rem] text-left text-[13px]">
            <thead className="bg-muted font-mono text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 font-medium">Many</th>
                <th className="px-3 py-2 font-medium">Through column</th>
                <th className="px-3 py-2 font-medium">One</th>
                <th className="px-3 py-2 font-medium">Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {data.relations.map((r) => (
                <tr key={`${r.from}.${r.column}`}>
                  <td className="px-3 py-2">
                    <span className="font-mono">{r.from}</span> <span className="text-muted-foreground">({count(r.from)} rows)</span>
                  </td>
                  <td className="px-3 py-2 font-mono">{r.column}</td>
                  <td className="px-3 py-2">
                    <span className="font-mono">{r.to}</span> <span className="text-muted-foreground">({count(r.to)} rows)</span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {r.optional ? `Each ${r.from} row may point to one ${r.to} row, or none.` : `Each ${r.from} row belongs to exactly one ${r.to} row.`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {alone.length ? (
        <section>
          <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Tables that stand alone</h2>
          <p className="mb-3 text-[13.5px] text-muted-foreground">
            No database link to another table. They are matched by value in code, for example a visitor&apos;s email or a session id.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {alone.map((t) => (
              <li key={t.table} className="border border-border bg-card p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[12.5px] font-medium">{t.table}</span>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{t.rows === null ? "missing" : `${t.rows.toLocaleString()} rows`}</span>
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">{t.about}</p>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {t.columns
                    .slice(0, 7)
                    .map((c) => (c.pk ? `${c.name} (key)` : c.name))
                    .join(", ")}
                  {t.columns.length > 7 ? `, +${t.columns.length - 7} more` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
