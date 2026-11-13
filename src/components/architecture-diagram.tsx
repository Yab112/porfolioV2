"use client";

import type { Architecture, NodeKind } from "@/data/architectures";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

const CELL_W = 196;
const CELL_H = 104;
const NODE_W = 156;
const NODE_H = 54;

const KIND_LABEL: Record<NodeKind, string> = {
  person: "Person",
  surface: "Interface",
  service: "Service",
  agent: "Agent",
  data: "Data",
  external: "External",
};

/**
 * Interactive system map: click a part to read what it does, or trace a real
 * request through it one step at a time.
 */
export function ArchitectureDiagram({ arch }: { arch: Architecture }) {
  const [selected, setSelected] = useState<string>(arch.nodes[0].id);
  const [flowIndex, setFlowIndex] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const cols = Math.max(...arch.nodes.map((n) => n.at[0])) + 1;
  const rows = Math.max(...arch.nodes.map((n) => n.at[1])) + 1;
  const width = cols * CELL_W;
  const height = rows * CELL_H;
  const center = useMemo(() => {
    const map = new Map<string, [number, number]>();
    arch.nodes.forEach((n) => map.set(n.id, [n.at[0] * CELL_W + CELL_W / 2, n.at[1] * CELL_H + CELL_H / 2]));
    return map;
  }, [arch]);

  const flow = flowIndex === null ? null : arch.flows[flowIndex];
  const visited = flow ? flow.steps.slice(0, step + 1).map((s) => s.at) : [];
  const current = flow ? flow.steps[step].at : selected;
  const litEdges = new Set<string>();
  for (let i = 1; i < visited.length; i++) {
    litEdges.add(`${visited[i - 1]}>${visited[i]}`);
    litEdges.add(`${visited[i]}>${visited[i - 1]}`);
  }

  useEffect(() => {
    if (!playing || !flow) return;
    if (step >= flow.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 1500);
    return () => window.clearTimeout(t);
  }, [playing, step, flow]);

  const startFlow = (i: number) => {
    setFlowIndex(i);
    setStep(0);
    setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  const stopFlow = () => {
    setFlowIndex(null);
    setPlaying(false);
  };

  const node = arch.nodes.find((n) => n.id === current) ?? arch.nodes[0];

  /** Line between two node boxes, trimmed so the arrowhead meets the box edge. */
  const edgePath = (from: string, to: string) => {
    const [x1, y1] = center.get(from)!;
    const [x2, y2] = center.get(to)!;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const trim = (ax: number, ay: number, sign: 1 | -1) => {
      const tx = dx === 0 ? Infinity : (NODE_W / 2 + 4) / Math.abs(dx);
      const ty = dy === 0 ? Infinity : (NODE_H / 2 + 4) / Math.abs(dy);
      const t = Math.min(tx, ty);
      return [ax + sign * dx * t, ay + sign * dy * t];
    };
    const [sx, sy] = trim(x1, y1, 1);
    const [ex, ey] = trim(x2, y2, -1);
    return `M${sx.toFixed(1)} ${sy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };

  return (
    <figure className="spotlight-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        <span className="note mr-2">Trace a request</span>
        {arch.flows.map((f, i) => (
          <button
            key={f.name}
            type="button"
            aria-pressed={flowIndex === i}
            onClick={() => (flowIndex === i ? stopFlow() : startFlow(i))}
            className={cn(
              "border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              flowIndex === i
                ? "border-transparent bg-signal"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block h-auto w-full min-w-[44rem]"
            role="group"
            aria-label="System diagram. Select a part to read what it does."
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill="context-stroke" />
              </marker>
            </defs>
            {arch.edges.map(([from, to]) => {
              const lit = litEdges.has(`${from}>${to}`);
              return (
                <path
                  key={`${from}-${to}`}
                  d={edgePath(from, to)}
                  fill="none"
                  markerEnd="url(#arrow)"
                  stroke={lit ? "var(--green)" : "var(--border)"}
                  strokeWidth={lit ? 2.5 : 1.25}
                  strokeDasharray={lit ? "6 6" : undefined}
                  className={lit ? "flow-dash [animation:flow-dash_0.8s_linear_infinite]" : undefined}
                />
              );
            })}
            {arch.nodes.map((n) => {
              const [cx, cy] = center.get(n.id)!;
              const isCurrent = n.id === current;
              const wasVisited = visited.includes(n.id);
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isCurrent}
                  aria-label={`${n.label}: ${KIND_LABEL[n.kind]}`}
                  onClick={() => {
                    stopFlow();
                    setSelected(n.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      stopFlow();
                      setSelected(n.id);
                    }
                  }}
                  className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--green)]"
                >
                  <rect
                    x={cx - NODE_W / 2}
                    y={cy - NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    fill={isCurrent ? "var(--green-fill)" : "var(--card)"}
                    stroke={isCurrent ? "var(--green-fill)" : wasVisited ? "var(--green)" : n.kind === "agent" ? "var(--purple)" : "var(--border)"}
                    strokeWidth={n.kind === "agent" || wasVisited ? 2 : 1.25}
                    strokeDasharray={n.kind === "external" ? "4 4" : undefined}
                    rx={n.kind === "person" ? NODE_H / 2 : 0}
                  />
                  <text
                    x={cx}
                    y={cy - 3}
                    textAnchor="middle"
                    fontSize="13.5"
                    fontWeight="600"
                    fill={isCurrent ? "var(--on-green)" : "var(--foreground)"}
                  >
                    {n.label}
                  </text>
                  <text
                    x={cx}
                    y={cy + 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    letterSpacing="1.2"
                    fontFamily="var(--font-mono), monospace"
                    fill={isCurrent ? "var(--on-green)" : "var(--muted-foreground)"}
                  >
                    {KIND_LABEL[n.kind].toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <figcaption className="flex flex-col gap-4 border-t border-border p-5 lg:border-l lg:border-t-0" aria-live="polite">
          {flow ? (
            <>
              <p className="note">
                Step {step + 1} of {flow.steps.length}
              </p>
              <p className="poster text-3xl">{node.label}</p>
              <p className="leading-relaxed">{flow.steps[step].note}</p>
              <div className="mt-auto flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setStep((s) => Math.max(0, s - 1));
                  }}
                  disabled={step === 0}
                  className="border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-wider disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setStep((s) => Math.min(flow.steps.length - 1, s + 1));
                  }}
                  disabled={step === flow.steps.length - 1}
                  className="bg-signal px-3 py-2 font-mono text-[11px] uppercase tracking-wider disabled:opacity-40"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (step === flow.steps.length - 1) setStep(0);
                    setPlaying((p) => !p);
                  }}
                  className="ml-auto font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {playing ? "Pause" : step === flow.steps.length - 1 ? "Replay" : "Play"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="note">{KIND_LABEL[node.kind]}</p>
              <p className="poster text-3xl">{node.label}</p>
              <p className="leading-relaxed text-muted-foreground">{node.detail}</p>
              <p className="note mt-auto pt-2">Select any part, or trace a request above.</p>
            </>
          )}
        </figcaption>
      </div>
    </figure>
  );
}
