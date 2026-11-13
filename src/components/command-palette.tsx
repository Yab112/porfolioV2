"use client";

import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Copy,
  FileDown,
  FileText,
  Github,
  Hash,
  Home,
  Linkedin,
  Mail,
  Search,
  Sparkles,
  SunMoon,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Item {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  keywords?: string;
  run: () => void;
}

interface PostHit {
  slug: string;
  title: string;
}

/** ⌘K / Ctrl+K launcher: navigation, actions, links and live blog search. */
export function CommandPalette() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [posts, setPosts] = useState<PostHit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const loadedPosts = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!loadedPosts.current) {
      loadedPosts.current = true;
      fetch("/api/blog-list?page=1&page_size=8")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && Array.isArray(d.items)) {
            setPosts(d.items.map((p: PostHit) => ({ slug: p.slug, title: p.title })));
          }
        })
        .catch(() => {
          loadedPosts.current = false;
        });
    }
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    const ext = (href: string) => () => window.open(href, "_blank", "noopener,noreferrer");
    const social = DATA.contact.social;
    return [
      { id: "home", group: "Go to", label: "Home", hint: "0", icon: Home, run: go("/") },
      { id: "work", group: "Go to", label: "Work & case studies", hint: "1", icon: Briefcase, keywords: "projects portfolio", run: go("/work") },
      { id: "about", group: "Go to", label: "About: experience, stack, education", hint: "2", icon: Hash, keywords: "career jobs skills background cv", run: go("/about") },
      { id: "lab", group: "Go to", label: "Lab: what I am learning", hint: "3", icon: Hash, keywords: "machine learning deep ml coursera gradient descent playground", run: go("/learning") },
      { id: "blog", group: "Go to", label: "Writing", hint: "4", icon: BookOpen, keywords: "articles blog posts", run: go("/blog") },
      { id: "contact", group: "Go to", label: "Contact", hint: "5", icon: Mail, keywords: "hire email message", run: go("/contact") },
      {
        id: "aegis",
        group: "Actions",
        label: "Ask Aegis, my AI agent",
        hint: "chat",
        icon: Sparkles,
        keywords: "assistant bot question book meeting call",
        run: () => window.dispatchEvent(new CustomEvent("aegis:open")),
      },
      {
        id: "theme",
        group: "Actions",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`,
        icon: SunMoon,
        keywords: "dark light mode appearance",
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "email",
        group: "Actions",
        label: "Copy email address",
        hint: DATA.contact.email,
        icon: Copy,
        keywords: "mail contact",
        run: () => {
          navigator.clipboard
            ?.writeText(DATA.contact.email)
            .then(() => toast.success("Email copied"))
            .catch(() => toast.error("Could not copy"));
        },
      },
      { id: "cv", group: "Actions", label: "Download CV", hint: "PDF", icon: FileDown, keywords: "resume", run: ext(DATA.contact.resumePdfUrl) },
      { id: "gh", group: "Links", label: "GitHub", icon: Github, keywords: "code source", run: ext(social.GitHub.url) },
      { id: "li", group: "Links", label: "LinkedIn", icon: Linkedin, run: ext(social.LinkedIn.url) },
      ...posts.map<Item>((p) => ({
        id: `post-${p.slug}`,
        group: "Latest posts",
        label: p.title,
        icon: FileText,
        keywords: "blog article",
        run: go(`/blog/${p.slug}`),
      })),
    ];
  }, [router, resolvedTheme, setTheme, posts]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items;
    return items.filter((it) => {
      const hay = `${it.label} ${it.group} ${it.keywords ?? ""} ${it.hint ?? ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [items, query]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const choose = (it: Item | undefined) => {
    if (!it) return;
    close();
    it.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[cursor]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={close} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onKeyDown={onKeyDown}
            className="relative w-full max-w-xl overflow-hidden rounded-none border border-border bg-card"
          >
            <div className="bg-signal absolute inset-x-0 top-0 h-[3px]" aria-hidden />
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, posts and actions…"
                className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[cursor] ? `palette-${results[cursor].id}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="shrink-0 rounded-none border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                esc
              </kbd>
            </div>

            <div ref={listRef} id="palette-list" role="listbox" className="max-h-[min(22rem,50vh)] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Nothing matches “{query}”. Try “blog”, “theme” or “contact”.
                </p>
              ) : (
                results.map((it, i) => {
                  const header = it.group !== lastGroup ? it.group : null;
                  lastGroup = it.group;
                  const active = i === cursor;
                  const Icon = it.icon;
                  return (
                    <div key={it.id}>
                      {header && (
                        <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                          {header}
                        </p>
                      )}
                      <button
                        type="button"
                        id={`palette-${it.id}`}
                        role="option"
                        aria-selected={active}
                        data-index={i}
                        onMouseMove={() => setCursor(i)}
                        onClick={() => choose(it)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-none px-3 py-2.5 text-left text-sm transition-colors",
                          active ? "bg-signal" : "text-foreground/90"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-none border border-border",
                            active ? "bg-background text-foreground" : "bg-muted/60 text-muted-foreground"
                          )}
                        >
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{it.label}</span>
                        {it.hint && (
                          <span className={cn("hidden shrink-0 truncate font-mono text-[11px] sm:block", !active && "text-muted-foreground")}>
                            {it.hint}
                          </span>
                        )}
                        {active && (
                          <span className="shrink-0 font-mono text-[11px]" aria-hidden>
                            ↵
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
              <span>↑↓ navigate · ↵ select</span>
              <span>⌘K / Ctrl K anywhere</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
