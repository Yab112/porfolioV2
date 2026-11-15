"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

/** Call the admin API through the site's server-side proxy. Throws with the API's own message. */
export async function api<T = unknown>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, {
    method: init?.method ?? "GET",
    headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new Error("Sign in again.");
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok) {
    const detail = (data as { detail?: unknown } | null)?.detail;
    throw new Error(typeof detail === "string" ? detail : `Request failed (${res.status})`);
  }
  return data as T;
}

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(path));

  const reload = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    try {
      setData(await api<T>(path));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload, setData };
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (Number.isNaN(mins)) return "";
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 60 * 48) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export function shortDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

const PILL: Record<string, string> = {
  open: "border-[var(--green)] text-[var(--green)]",
  published: "border-[var(--green)] text-[var(--green)]",
  success: "border-[var(--green)] text-[var(--green)]",
  review: "border-[var(--purple)] text-[var(--purple)]",
  replied: "border-[var(--purple)] text-[var(--purple)]",
  running: "border-[var(--purple)] text-[var(--purple)]",
  failed: "border-destructive text-destructive",
  spam: "border-destructive text-destructive",
};

export function Pill({ children }: { children: string }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        PILL[children] ?? "border-border text-muted-foreground"
      )}
    >
      {children}
    </span>
  );
}

function Spinner() {
  return <span aria-hidden className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

/**
 * Button for admin actions. When `onClick` returns a promise (any async action), the button
 * shows a spinner and cannot be pressed again until it settles.
 */
export function Btn({
  tone = "plain",
  className,
  onClick,
  disabled,
  children,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  tone?: "plain" | "primary" | "danger";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
}) {
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function handle(e: React.MouseEvent<HTMLButtonElement>) {
    const result = onClick?.(e);
    if (result instanceof Promise) {
      setBusy(true);
      void result.finally(() => mounted.current && setBusy(false));
    }
  }

  return (
    <button
      type="button"
      {...props}
      onClick={handle}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap border px-3 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        tone === "primary" && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        tone === "plain" && "border-border bg-card hover:border-primary/50",
        tone === "danger" && "border-border bg-card text-destructive hover:border-destructive",
        busy && "disabled:opacity-80",
        className
      )}
    >
      {busy ? <Spinner /> : null}
      {children}
    </button>
  );
}

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("animate-pulse bg-muted", className)} style={style} />;
}

/**
 * Skeleton shown while something loads, shaped like what is coming:
 * rows (lists), tiles (stat cards), cards (job cards), detail (a side pane),
 * table (data grid), editor (the post editor).
 */
export function Loading({ kind = "rows", rows = 5 }: { kind?: "rows" | "tiles" | "cards" | "detail" | "table" | "editor"; rows?: number }) {
  let body: React.ReactNode;
  if (kind === "tiles") {
    body = (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-3 border border-border bg-card p-4">
            <Bone className="h-3 w-2/3" />
            <Bone className="h-10 w-16" />
            <Bone className="h-3 w-1/2 bg-muted/60" />
          </div>
        ))}
      </div>
    );
  } else if (kind === "cards") {
    body = (
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-3 border border-border bg-card p-4">
            <Bone className="h-4 w-1/3" />
            <Bone className="h-3 w-full bg-muted/60" />
            <Bone className="h-3 w-4/5 bg-muted/60" />
            <Bone className="h-8 w-40" />
          </div>
        ))}
      </div>
    );
  } else if (kind === "detail") {
    body = (
      <div className="space-y-4 border border-border bg-card p-4">
        <Bone className="h-5 w-1/2" />
        <Bone className="h-3 w-1/3 bg-muted/60" />
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-2 border-l-2 border-border pl-3">
            <Bone className="h-2.5 w-20 bg-muted/60" />
            <Bone className="h-3.5" style={{ width: `${55 + ((i * 13) % 40)}%` }} />
          </div>
        ))}
        <Bone className="h-28 w-full bg-muted/60" />
      </div>
    );
  } else if (kind === "table") {
    body = (
      <div className="border border-border">
        <Bone className="h-9 w-full" />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex gap-4 border-t border-border bg-card px-3 py-3">
            {Array.from({ length: 5 }, (_, j) => (
              <Bone key={j} className="h-3 flex-1 bg-muted/60" />
            ))}
          </div>
        ))}
      </div>
    );
  } else if (kind === "editor") {
    body = (
      <div className="space-y-5">
        <div className="flex justify-between gap-3">
          <Bone className="h-6 w-56" />
          <Bone className="h-9 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Bone key={i} className="h-11 bg-muted/60" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Bone className="h-[60vh] bg-muted/60" />
          <Bone className="h-[60vh] bg-muted/40" />
        </div>
      </div>
    );
  } else {
    body = (
      <div className="divide-y divide-border border border-border">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="space-y-2 bg-card px-4 py-3.5">
            <Bone className="h-3.5" style={{ width: `${38 + ((i * 17) % 30)}%` }} />
            <Bone className="h-3 w-4/5 bg-muted/60" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div role="status" aria-label="Loading">
      {body}
    </div>
  );
}

/** Each pane of a list + detail page scrolls on its own on wide screens. */
export const PANE = "lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto lg:overscroll-contain";

export function Pager({ total, limit, offset, onChange }: { total: number; limit: number; offset: number; onChange: (offset: number) => void }) {
  if (total <= limit) return total > 0 ? <p className="mt-3 text-[12px] text-muted-foreground">{total} in total</p> : null;
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  return (
    <nav aria-label="Pages" className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-muted-foreground">
      <span>
        {offset + 1} to {Math.min(offset + limit, total)} of {total.toLocaleString()}
      </span>
      <span className="flex items-center gap-2">
        <Btn className="h-8" disabled={page <= 1} onClick={() => onChange(Math.max(0, offset - limit))}>
          Previous
        </Btn>
        <span className="tabular-nums">
          Page {page} of {pages}
        </span>
        <Btn className="h-8" disabled={page >= pages} onClick={() => onChange(offset + limit)}>
          Next
        </Btn>
      </span>
    </nav>
  );
}

export const inputCls =
  "w-full border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[12px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
      <div>
        <h1 className="poster text-4xl">{title}</h1>
        {sub ? <p className="mt-1 text-sm text-muted-foreground">{sub}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function Notice({ kind = "info", children }: { kind?: "info" | "error" | "ok"; children: React.ReactNode }) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "border-l-4 bg-card px-4 py-3 text-[13.5px]",
        kind === "error" ? "border-destructive" : kind === "ok" ? "border-[var(--green)]" : "border-[var(--purple)]"
      )}
    >
      {children}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">{children}</p>;
}
