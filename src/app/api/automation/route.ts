import { getAegisApiBase } from "@/lib/upstream-aegis";
import { NextResponse } from "next/server";

/** Public, sanitized state of the backend content pipeline (cached briefly at the edge). */
export async function GET() {
  try {
    const res = await fetch(`${getAegisApiBase()}/automation/status`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Pipeline status unavailable" }, { status: 502 });
  }
}
