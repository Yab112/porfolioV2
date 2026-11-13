import { NextResponse } from "next/server";
import { getAegisApiBase } from "@/lib/upstream-aegis";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  const upstream = await fetch(`${getAegisApiBase()}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Lets the agent tell a person from an AI agent or script calling the site.
      "X-Visitor-User-Agent": req.headers.get("user-agent") ?? "",
    },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": ct },
  });
}
