"use client";

import { useState } from "react";
import { Btn, Field, Notice, inputCls } from "../_lib";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
      return;
    }
    const data = (await res.json().catch(() => null)) as { detail?: string } | null;
    setError(data?.detail ?? "Could not sign in.");
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-sm flex-col justify-center">
      <h1 className="poster text-5xl">Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">Inbox, blog, projects and automation in one place.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Password">
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </Field>
        {error ? <Notice kind="error">{error}</Notice> : null}
        <Btn type="submit" tone="primary" disabled={busy || !password} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Btn>
      </form>
    </main>
  );
}
