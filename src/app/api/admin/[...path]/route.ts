import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { getAegisApiBase } from "@/lib/upstream-aegis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Signed-in owner → Aegis admin API. The API secret is added here, on the
 * server, so it is never present in the browser.
 */
const ALLOWED = [/^admin\//, /^internal\/scheduler\//, /^keywords\//, /^newsroom\//];

async function forward(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const jar = await cookies();
  if (!(await verifySessionToken(jar.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ detail: "Sign in again." }, { status: 401 });
  }
  // A cross-site page cannot make the owner's browser change anything.
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (!origin || !host || new URL(origin).host !== host) {
      return NextResponse.json({ detail: "Cross-site request refused." }, { status: 403 });
    }
  }
  const key = process.env.AEGIS_ADMIN_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { detail: "AEGIS_ADMIN_API_KEY is not set on the site (it is the backend's API_SECRET_KEY)." },
      { status: 503 }
    );
  }
  const { path } = await ctx.params;
  const joined = path.map(encodeURIComponent).join("/");
  if (!ALLOWED.some((re) => re.test(joined))) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  const search = new URL(req.url).search;
  const hasBody = req.method !== "GET" && req.method !== "DELETE";
  try {
    const upstream = await fetch(`${getAegisApiBase()}/${joined}${search}`, {
      method: req.method,
      headers: { Authorization: `Bearer ${key}`, ...(hasBody ? { "Content-Type": "application/json" } : {}) },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { detail: "The Aegis API did not answer. On a free host it may be waking up; try again in a minute." },
      { status: 502 }
    );
  }
}

export { forward as DELETE, forward as GET, forward as PATCH, forward as POST };
