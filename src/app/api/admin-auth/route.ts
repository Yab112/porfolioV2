import { ADMIN_COOKIE, ADMIN_SESSION_DAYS, adminConfigured, createSessionToken, passwordMatches } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

// Slow down guessing: a few attempts per address per window (per server instance).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

/** POST { password } signs in. DELETE signs out. */
export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { detail: "Admin is not set up: add ADMIN_PASSWORD and ADMIN_SESSION_SECRET to the site's environment." },
      { status: 503 }
    );
  }
  const key = clientKey(req);
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ detail: "Too many attempts. Wait ten minutes and try again." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password : "";
  if (!(await passwordMatches(password))) {
    attempts.set(key, entry && entry.resetAt > now ? { ...entry, count: entry.count + 1 } : { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.json({ detail: "Wrong password." }, { status: 401 });
  }
  attempts.delete(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
