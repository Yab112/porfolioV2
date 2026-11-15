"use client";

import { usePathname } from "next/navigation";

/** The public site's furniture (rail, footer, chat, backdrop) stays out of /admin. */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  return usePathname()?.startsWith("/admin") ? null : <>{children}</>;
}
