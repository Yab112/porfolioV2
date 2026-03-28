"use client";

import {
  AEGIS_SESSION_STORAGE_KEY,
  formatChatErrorDetail,
  type ChatIntent,
  type ChatResponseBody,
} from "@/lib/aegis-chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, RotateCcw, Send, Terminal, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

const CHAT_LOGO = "/logo_papu.png";

const SUGGESTIONS = [
  { prompt: "What does Yabibal build with day to day?", label: "Stack & tools" },
  { prompt: "Give me a tight summary of his recent roles and projects.", label: "Experience snapshot" },
  { prompt: "I'd like to book a short intro call.", label: "Schedule a call" },
] as const;

/** Rotates above the launcher when the panel is closed */
const FAB_TEASERS = [
  "Hello!",
  "Ask about me",
  "Projects & stack",
  "Book a quick call",
] as const;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  intent?: ChatIntent;
  sources?: string[];
  confidence?: number | null;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function postChat(
  message: string,
  sessionId: string | null
): Promise<ChatResponseBody> {
  const body: Record<string, unknown> = { message };
  if (sessionId) body.session_id = sessionId;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? (data as { detail: unknown }).detail
        : data;
    throw new Error(formatChatErrorDetail(detail));
  }
  return data as ChatResponseBody;
}

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 last:mb-0 text-[14px] leading-[1.65] text-foreground/95">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-4 text-[14px] leading-[1.6] last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-4 text-[14px] leading-[1.6] last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="text-foreground/95">{children}</li>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors hover:decoration-primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-primary/8 px-1.5 py-0.5 font-mono text-[12px] text-foreground">
      {children}
    </code>
  ),
};

export function AegisChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teaserIdx, setTeaserIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(AEGIS_SESSION_STORAGE_KEY);
    if (saved) setSessionId(saved);
  }, []);

  const persistSession = useCallback((id: string) => {
    setSessionId(id);
    sessionStorage.setItem(AEGIS_SESSION_STORAGE_KEY, id);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 180);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) return;
    const id = window.setInterval(() => {
      setTeaserIdx((i) => (i + 1) % FAB_TEASERS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [open]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    sessionStorage.removeItem(AEGIS_SESSION_STORAGE_KEY);
    toast.success("Started fresh");
    inputRef.current?.focus();
  }, []);

  const send = useCallback(
    async (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text || loading) return;

      const userMsg: ChatMessage = { id: uid(), role: "user", text };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const data = await postChat(text, sessionId);
        persistSession(data.session_id);
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            text: data.response,
            intent: data.intent,
            sources: data.sources?.length ? data.sources : undefined,
            confidence: data.confidence,
          },
        ]);
      } catch {
        toast.error("Couldn’t get a reply. Please try again.");
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            text:
              "Something went wrong. Please try again in a moment, or reach out through the contact section.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, sessionId, persistSession]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div
      className={cn(
        "fixed right-4 z-[60] flex flex-col items-end gap-2 sm:right-6",
        /* Extra space above the bottom dock + small lift from viewport bottom */
        "bottom-[5.5rem] sm:bottom-32"
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            id="aegis-chat-panel"
            className={cn(
              "w-[min(100vw-1.5rem,420px)] overflow-hidden rounded-xl border border-border",
              "bg-card shadow-[0_20px_50px_-12px_rgba(26,11,46,0.25)]",
              "dark:border-primary/20 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)]"
            )}
            role="dialog"
            aria-labelledby="aegis-chat-title"
            aria-modal="true"
          >
            {/* Agent shell: status bar */}
            <div
              className="h-1 w-full bg-gradient-to-r from-primary via-violet-500 to-primary opacity-90"
              aria-hidden
            />

            <header className="border-b border-border/80 bg-muted/20 px-4 pb-3.5 pt-5 dark:bg-muted/10">
              <div className="flex items-start gap-3">
                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background ring-1 ring-border shadow-sm">
                  <img
                    src={CHAT_LOGO}
                    alt=""
                    className="size-9 object-contain p-0.5"
                    width={36}
                    height={36}
                  />
                  <span
                    className="absolute bottom-0.5 right-0.5 flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
                    title="Agent ready"
                  />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                      Aegis
                    </span>
                  </div>
                  <h2
                    id="aegis-chat-title"
                    className="mt-1 flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
                  >
                    <Bot className="size-4 text-primary" strokeWidth={2} aria-hidden />
                    Portfolio agent
                  </h2>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    Answers about this portfolio · help booking a call
                  </p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    title="Start over"
                    onClick={handleNewChat}
                  >
                    <RotateCcw className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            </header>

            <div
              ref={listRef}
              className={cn(
                "max-h-[min(340px,46vh)] min-h-[240px] overflow-y-auto overscroll-contain px-4 py-4",
                "bg-gradient-to-b from-muted/15 to-background dark:from-background dark:to-muted/5"
              )}
            >
              {messages.length === 0 && !loading && (
                <div className="space-y-5">
                  <div className="rounded-lg bg-primary/[0.04] px-3.5 py-3 dark:bg-primary/[0.07]">
                    <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
                      <Terminal className="size-3" aria-hidden />
                      Welcome
                    </div>
                    <p className="text-[13px] leading-relaxed text-foreground/90">
                      This is <strong className="text-foreground">Aegis</strong>, Yabibal’s assistant for questions
                      about his work and for arranging a conversation. Your chat stays on this browser until you start
                      over.
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Suggestions
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTIONS.map(({ prompt, label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => void send(prompt)}
                          className={cn(
                            "group flex w-full flex-col gap-0.5 rounded-lg bg-card px-3 py-2.5 text-left",
                            "transition-all hover:bg-muted/40"
                          )}
                        >
                          <span className="font-mono text-[10px] text-muted-foreground group-hover:text-primary">
                            {">"} {label}
                          </span>
                          <span className="text-[13px] leading-snug text-foreground">{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex flex-col gap-1", m.role === "user" ? "items-end" : "items-start")}
                  >
                    <span
                      className={cn(
                        "px-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em]",
                        m.role === "user" ? "text-muted-foreground" : "text-primary"
                      )}
                    >
                      {m.role === "user" ? "You" : "Agent"}
                    </span>
                    <div
                      className={cn(
                        "max-w-[min(100%,20rem)] px-4 py-3",
                        m.role === "user"
                          ? "rounded-2xl rounded-tr-md bg-primary text-primary-foreground shadow-sm"
                          : "rounded-2xl rounded-tl-md bg-muted/50 text-foreground dark:bg-muted/30"
                      )}
                    >
                      {m.role === "assistant" ? (
                        <ReactMarkdown components={mdComponents}>{m.text}</ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap text-[14px] leading-[1.6]">{m.text}</p>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex flex-col gap-1 items-start">
                    <span className="px-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Agent
                    </span>
                    <div className="flex max-w-[min(100%,20rem)] items-center gap-3 rounded-2xl rounded-tl-md bg-muted/50 px-4 py-3.5 dark:bg-muted/30">
                      <span className="flex gap-1" aria-hidden>
                        <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.2s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.1s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-primary/70" />
                      </span>
                      <span className="text-[13px] text-muted-foreground">Writing a reply…</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <footer className="border-t border-border bg-card px-4 pb-3 pt-3">
              <div className="mb-1.5">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Message
                </span>
              </div>
              <div className="flex gap-2 rounded-lg border border-input bg-background p-1.5 pl-3 shadow-inner focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/15">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your message…"
                  rows={2}
                  disabled={loading}
                  className={cn(
                    "max-h-28 min-h-[48px] w-full resize-none bg-transparent py-2 text-[14px] leading-snug",
                    "text-foreground placeholder:text-muted-foreground/65",
                    "outline-none disabled:opacity-50"
                  )}
                  aria-label="Message to agent"
                />
                <Button
                  type="button"
                  size="icon"
                  className="mt-auto size-10 shrink-0 rounded-md"
                  disabled={loading || !input.trim()}
                  onClick={() => void send()}
                  aria-label="Send to agent"
                >
                  <Send className="size-4" />
                </Button>
              </div>
              <p className="mt-2 font-mono text-[9px] leading-relaxed text-muted-foreground/90">
                <kbd className="rounded bg-muted/60 px-1 py-0.5">Enter</kbd> send ·{" "}
                <kbd className="rounded bg-muted/60 px-1 py-0.5">Shift</kbd>+
                <kbd className="rounded bg-muted/60 px-1 py-0.5">Enter</kbd> line ·{" "}
                <kbd className="rounded bg-muted/60 px-1 py-0.5">Esc</kbd> close
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <div className="pointer-events-none flex max-w-[11rem] flex-col items-end gap-1.5 pr-0.5">
          <motion.div
            layout
            className="rounded-xl bg-card/95 px-3 py-2 shadow-md backdrop-blur-md"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="min-h-[2.25rem] text-right">
              {/* No AnimatePresence mode="wait" here: it unmounts the exiting line before the next mounts, which flashes empty. */}
              <motion.p
                key={teaserIdx}
                initial={{ opacity: 0.35 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-[13px] font-medium leading-snug text-foreground"
              >
                {FAB_TEASERS[teaserIdx % FAB_TEASERS.length]}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "relative flex size-[56px] items-center justify-center overflow-hidden rounded-2xl",
          "border-2 border-primary/35 bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
        aria-expanded={open}
        aria-controls={open ? "aegis-chat-panel" : undefined}
        aria-label={open ? "Close portfolio agent" : "Open portfolio agent"}
        title={open ? "Close" : "Aegis · portfolio agent"}
      >
        {open ? (
          <ChevronDown className="size-6" strokeWidth={2.25} />
        ) : (
          <>
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-card p-1.5 ring-2 ring-primary-foreground/25">
              <img src={CHAT_LOGO} alt="" className="size-full object-contain" width={40} height={40} />
            </span>
            <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 rounded-md border border-primary/30 bg-card px-1 py-px font-mono text-[8px] font-bold uppercase leading-none tracking-wide text-primary shadow-sm">
              AI
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}
