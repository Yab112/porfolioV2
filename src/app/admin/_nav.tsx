"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { prefetch } from "./_lib";
import { queryClient } from "./_query";

const TABS = [
  { href: "/admin", label: "Overview", first: "admin/overview" },
  { href: "/admin/inbox", label: "Inbox", first: "admin/inbox?limit=25&offset=0&status=open" },
  { href: "/admin/people", label: "People", first: "admin/people?limit=25&offset=0&only=&q=" },
  { href: "/admin/email", label: "Email", first: "admin/email/templates" },
  { href: "/admin/keywords", label: "Keywords", first: "keywords/best?limit=40&status=candidate" },
  { href: "/admin/posts", label: "Blog", first: "admin/posts?limit=20&offset=0" },
  { href: "/admin/sources", label: "Sources", first: "newsroom/sources" },
  { href: "/admin/projects", label: "Projects", first: "admin/projects" },
  { href: "/admin/automation", label: "Automation", first: "internal/scheduler/status" },
  { href: "/admin/data", label: "Data", first: "admin/data" },
];

export function AdminNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const signedIn = pathname !== "/admin/login";

  // Load every section's first screen in the background, so opening a tab is instant.
  useEffect(() => {
    if (!signedIn) return;
    const t = setTimeout(() => TABS.forEach((tab) => prefetch(tab.first)), 400);
    return () => clearTimeout(t);
  }, [signedIn]);

  if (!signedIn) return null;

  async function signOut() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    queryClient.clear(); // nothing from this session stays in memory
    router.push("/admin/login");
  }

  return (
    <header className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border py-4">
      <Link href="/admin" className="poster text-2xl">
        Admin
      </Link>
      <nav className="flex flex-1 flex-wrap gap-1" aria-label="Admin sections">
        {TABS.map((t) => {
          const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              onMouseEnter={() => prefetch(t.first)}
              onFocus={() => prefetch(t.first)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "border-b-2 px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                active ? "border-[var(--green)] text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="text-[13px] text-muted-foreground hover:text-foreground">
        View site
      </Link>
      <button type="button" onClick={signOut} className="text-[13px] text-muted-foreground hover:text-foreground">
        Sign out
      </button>
    </header>
  );
}
