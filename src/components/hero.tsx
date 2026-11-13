"use client";

import { SpotlightCard } from "@/components/fx/spotlight-card";
import { DATA } from "@/data/resume";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Command, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATS = [
  { value: "194+", label: "Playwright tests guarding production" },
  { value: "7", label: "AI agents running 24/7" },
  { value: "<50ms", label: "edge-served static shell" },
  { value: "n8n", label: "official Ambassador" },
] as const;

const SCRIPT = [
  { cmd: "aegis whoami", out: "Yabibal Eshetie · fullstack + AI engineer · Addis Ababa" },
  { cmd: "aegis stack --top", out: "Next.js · FastAPI · LangGraph · PostgreSQL · n8n" },
  { cmd: "aegis ship --status", out: "194 tests green · 7 agents live · 0 pages at 3am" },
  { cmd: "aegis hire --ask", out: "Open the chat — I answer, book a call, or ping Yabibal." },
] as const;

function useAddisTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Addis_Ababa",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/** Types the scripted commands one after another, then loops. */
function HeroTerminal() {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(reduce ? SCRIPT.length - 1 : 0);
  const [typed, setTyped] = useState(reduce ? SCRIPT[SCRIPT.length - 1].cmd.length : 0);

  useEffect(() => {
    if (reduce) return;
    const full = SCRIPT[line].cmd.length;
    if (typed < full) {
      const t = window.setTimeout(() => setTyped((n) => n + 1), 45 + Math.random() * 50);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setLine((l) => (l + 1) % SCRIPT.length);
      setTyped(0);
    }, 2400);
    return () => window.clearTimeout(t);
  }, [line, typed, reduce]);

  const history = reduce ? SCRIPT.slice(0, -1) : SCRIPT.slice(Math.max(0, line - 2), line);
  const current = SCRIPT[line];
  const done = typed >= current.cmd.length;

  return (
    <SpotlightCard tilt={5} className="w-full overflow-hidden font-mono text-[12.5px] leading-relaxed">
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] text-muted-foreground">aegis — yabibal.site</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-500">
          <span className="relative flex size-1.5">
            <span className="pulse-ring absolute inset-0 rounded-full bg-emerald-500 [animation:pulse-ring_1.8s_ease-out_infinite]" />
            <span className="relative size-1.5 rounded-full bg-emerald-500" />
          </span>
          live
        </span>
      </div>
      <div className="flex min-h-[15.5rem] flex-col justify-end gap-3 p-4 sm:p-5" aria-hidden>
        {history.map((l) => (
          <div key={l.cmd} className="opacity-55">
            <p>
              <span className="text-primary">❯</span> {l.cmd}
            </p>
            <p className="text-muted-foreground">{l.out}</p>
          </div>
        ))}
        <div>
          <p>
            <span className="text-primary">❯</span> {current.cmd.slice(0, typed)}
            {!done && (
              <span className="caret ml-px inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-primary [animation:caret-blink_1s_steps(1)_infinite]" />
            )}
          </p>
          <motion.p
            key={`${line}-${done}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 4 }}
            className="text-gradient min-h-[1.6em] font-medium"
          >
            {done ? current.out : ""}
          </motion.p>
        </div>
      </div>
      <p className="sr-only">
        Animated terminal: Yabibal Eshetie is a fullstack and AI engineer in Addis Ababa working with Next.js,
        FastAPI, LangGraph, PostgreSQL and n8n.
      </p>
    </SpotlightCard>
  );
}

const rise = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function Hero() {
  const time = useAddisTime();
  const reduce = useReducedMotion();
  const [first, ...rest] = DATA.name.split(" ");

  return (
    <section id="hero" className="relative pt-6 sm:pt-10">
      <motion.div
        initial={reduce ? false : "hidden"}
        animate="show"
        transition={{ staggerChildren: 0.09 }}
        className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14"
      >
        <div className="min-w-0 space-y-7">
          <motion.div variants={rise} className="flex flex-wrap items-center gap-2.5">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
              <span className="relative flex size-2">
                <span className="pulse-ring absolute inset-0 rounded-full bg-emerald-500 [animation:pulse-ring_1.8s_ease-out_infinite]" />
                <span className="relative size-2 rounded-full bg-emerald-500" />
              </span>
              Available for new projects
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
              <MapPin className="size-3" aria-hidden />
              Addis Ababa
              <span className="tabular-nums text-foreground/80" suppressHydrationWarning>
                {time ? `· ${time}` : ""}
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="font-display text-balance text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
          >
            {first} <span className="text-muted-foreground/70">{rest[0]}</span>
            <br />
            <span className="text-gradient">builds AI systems</span>
            <br />
            that stay shipped.
          </motion.h1>

          <motion.p variants={rise} className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Fullstack engineer specializing in <span className="text-foreground">AI security</span>,{" "}
            <span className="text-foreground">self-healing automation</span> and{" "}
            <span className="text-foreground">production-grade multi-tenant systems</span>.
          </motion.p>

          <motion.div variants={rise} className="flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="bg-gradient-brand group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--glow-2)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start a project
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </a>
            <Link
              href="/work"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50"
            >
              See the work
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("aegis:open"))}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Sparkles className="size-4 text-primary" aria-hidden />
              Ask my AI agent
            </button>
          </motion.div>

          <motion.button
            variants={rise}
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("palette:open"))}
            className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Press
            <kbd className="inline-flex items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-foreground">
              <Command className="size-2.5" aria-hidden />K
            </kbd>
            to jump anywhere
          </motion.button>
        </div>

        <motion.div variants={rise} className="min-w-0">
          <HeroTerminal />
        </motion.div>
      </motion.div>

      <motion.dl
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-border/60 [gap:1px] lg:grid-cols-4"
      >
        {STATS.map((s) => (
          <div key={s.label} className="bg-background/80 px-5 py-6 backdrop-blur-sm sm:px-7">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="font-display text-gradient block text-3xl font-semibold tracking-tight sm:text-4xl">
                {s.value}
              </span>
              <span className="mt-1.5 block text-xs leading-snug text-muted-foreground sm:text-[13px]">{s.label}</span>
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
