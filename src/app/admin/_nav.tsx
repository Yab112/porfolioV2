"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/email", label: "Email" },
  { href: "/admin/keywords", label: "Keywords" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/automation", label: "Automation" },
  { href: "/admin/data", label: "Data" },
];

export function AdminNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  if (pathname === "/admin/login") return null;

  async function signOut() {
    await fetch("/api/admin-auth", { method: "DELETE" });
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
