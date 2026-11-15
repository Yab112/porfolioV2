"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

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

export function Btn({
  tone = "plain",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "plain" | "primary" | "danger" }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap border px-3 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        tone === "primary" && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        tone === "plain" && "border-border bg-card hover:border-primary/50",
        tone === "danger" && "border-border bg-card text-destructive hover:border-destructive",
        className
      )}
    />
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
