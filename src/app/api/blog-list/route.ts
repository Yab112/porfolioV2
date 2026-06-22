import { getAegisApiBase } from "@/lib/upstream-aegis";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("page_size") ?? "12", 10) || 12));
  const topic = searchParams.get("topic")?.trim() || null;

  const u = new URL(`${getAegisApiBase()}/blog`);
  u.searchParams.set("page", String(page));
  u.searchParams.set("page_size", String(pageSize));
  if (topic) u.searchParams.set("topic", topic);

  try {
    const res = await fetch(u.toString());
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog list" }, { status: 500 });
  }
}
