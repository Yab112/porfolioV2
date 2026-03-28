import { NextResponse } from "next/server";

/** Same-origin proxy so the browser never hits CORS; override with AEGIS_AGENT_API_URL. */
const DEFAULT_BASE = "https://aegis-agent-5omj.onrender.com";

function upstreamBase(): string {
  const raw = process.env.AEGIS_AGENT_API_URL?.trim() || DEFAULT_BASE;
  return raw.replace(/\/$/, "");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  const upstream = await fetch(`${upstreamBase()}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": ct },
  });
}
