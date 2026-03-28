import { buildLlmsTxt } from "@/lib/build-llms-txt";
import { NextResponse } from "next/server";

export function GET() {
  const body = buildLlmsTxt();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
