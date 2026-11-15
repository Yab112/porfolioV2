"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Btn, Empty, Notice, PageTitle, useApi } from "../_lib";

type TableInfo = { table: string; about: string; rows: number | null };
type Rows = { table: string; about: string; total: number; columns: string[]; rows: Record<string, unknown>[] };
const PAGE = 50;

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "yes" : "no";
  return String(value);
}

export default function AdminData() {
  const tables = useApi<{ items: TableInfo[] }>("admin/data");
  const [table, setTable] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const rows = useApi<Rows>(table ? `admin/data/${table}?limit=${PAGE}&offset=${offset}` : null);

  return (
    <main>
      <PageTitle title="Data" sub="Everything stored for your site, table by table. Read-only: nothing here can be changed or deleted." />
      {tables.error ? <Notice kind="error">{tables.error}</Notice> : null}
      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <ul className="divide-y divide-border self-start border border-border">
          {(tables.data?.items ?? []).map((t) => (
            <li key={t.table}>
              <button
                type="button"
                disabled={t.rows === null}
                onClick={() => {
                  setTable(t.table);
                  setOffset(0);
                }}
                className={cn("block w-full px-3 py-2.5 text-left disabled:opacity-50", table === t.table ? "bg-muted/60" : "bg-card hover:bg-muted/40")}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[12.5px]">{t.table}</span>
                  <span className="font-mono text-[12px] tabular-nums text-muted-foreground">{t.rows === null ? "not created" : t.rows.toLocaleString()}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">{t.about}</div>
              </button>
            </li>
          ))}
        </ul>

        <section className="min-w-0">
          {!table ? <Empty>Pick a table to see its rows.</Empty> : null}
          {rows.error ? <Notice kind="error">{rows.error}</Notice> : null}
          {table && rows.loading && !rows.data ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
          {table && rows.data ? (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13.5px] text-muted-foreground">
                  {rows.data.about}. Rows {rows.data.total === 0 ? 0 : offset + 1} to {Math.min(offset + PAGE, rows.data.total)} of {rows.data.total.toLocaleString()}, newest first.
                </p>
                <div className="flex gap-2">
                  <Btn className="h-8" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>
                    Newer
                  </Btn>
                  <Btn className="h-8" disabled={offset + PAGE >= rows.data.total} onClick={() => setOffset(offset + PAGE)}>
                    Older
                  </Btn>
                </div>
              </div>
              {rows.data.rows.length === 0 ? (
                <Empty>This table is empty.</Empty>
              ) : (
                <div className="max-h-[70vh] overflow-auto border border-border">
                  <table className="w-max min-w-full border-collapse text-left text-[12.5px]">
                    <thead className="sticky top-0 bg-muted font-mono text-[11px] uppercase tracking-wide">
                      <tr>
                        {rows.data.columns.map((c) => (
                          <th key={c} className="whitespace-nowrap border-b border-border px-3 py-2 font-medium">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {rows.data.rows.map((r, i) => (
                        <tr key={i} className="align-top hover:bg-muted/30">
                          {rows.data!.columns.map((c) => (
                            <td key={c} className="max-w-[22rem] px-3 py-2">
                              <div className="line-clamp-3 break-words" title={cell(r[c])}>
                                {cell(r[c])}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}
