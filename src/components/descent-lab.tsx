"use client";

import { himmelblau } from "@/components/swarm/shapes";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const RANGE = 5; // the plot covers [-5, 5] on both axes
type Optimizer = "sgd" | "momentum";

function grad(x: number, y: number): [number, number] {
  return [
    4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
    2 * (x * x + y - 11) + 4 * y * (x + y * y - 7),
  ];
}

function hex(v: string): [number, number, number] {
  const m = v.trim().replace("#", "");
  const n = parseInt(m.length === 3 ? m.replace(/./g, "$&$&") : m, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * A playable optimiser: click anywhere on the loss surface to drop a starting
 * point and watch gradient descent walk downhill. Raise the learning rate far
 * enough and it overshoots — the same failure a real training run shows.
 */
export function DescentLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<HTMLCanvasElement | null>(null);
  const runRef = useRef<{ path: [number, number][]; v: [number, number]; done: boolean }>({
    path: [],
    v: [0, 0],
    done: true,
  });
  const [lr, setLr] = useState(0.006);
  const [opt, setOpt] = useState<Optimizer>("sgd");
  const [stats, setStats] = useState({ steps: 0, loss: 0, state: "click the surface to start" });
  const lrRef = useRef(lr);
  const optRef = useRef(opt);
  lrRef.current = lr;
  optRef.current = opt;

  /** Paint the loss surface once per theme into an offscreen canvas. */
  const paintField = useCallback(() => {
    const css = getComputedStyle(document.documentElement);
    const bg = hex(css.getPropertyValue("--background"));
    const ink = hex(css.getPropertyValue("--purple"));
    const W = 520;
    const off = document.createElement("canvas");
    off.width = W;
    off.height = W;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(W, W);
    const band = (px: number, py: number) => {
      const x = (px / (W - 1) - 0.5) * 2 * RANGE;
      const y = (0.5 - py / (W - 1)) * 2 * RANGE;
      return Math.floor(Math.log1p(himmelblau(x, y)) * 2.1);
    };
    for (let py = 0; py < W; py++) {
      for (let px = 0; px < W; px++) {
        const b = band(px, py);
        const line = b !== band(px + 1, py) || b !== band(px, py + 1);
        const t = line ? 0.85 : Math.max(0, 0.42 - b * 0.03);
        const i = (py * W + px) * 4;
        for (let k = 0; k < 3; k++) img.data[i + k] = bg[k] + (ink[k] - bg[k]) * t;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    fieldRef.current = off;
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    const field = fieldRef.current;
    if (!c || !field) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const S = c.width;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(field, 0, 0, S, S);
    const css = getComputedStyle(document.documentElement);
    const green = css.getPropertyValue("--green-fill").trim();
    const fg = css.getPropertyValue("--foreground").trim();
    const toPx = (x: number, y: number): [number, number] => [(x / (2 * RANGE) + 0.5) * S, (0.5 - y / (2 * RANGE)) * S];
    const { path } = runRef.current;
    if (!path.length) return;
    ctx.lineWidth = S / 260;
    ctx.strokeStyle = green;
    ctx.lineJoin = "round";
    ctx.beginPath();
    path.forEach(([x, y], i) => {
      const [px, py] = toPx(x, y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    const [sx, sy] = toPx(...path[0]);
    ctx.strokeStyle = fg;
    ctx.strokeRect(sx - S / 110, sy - S / 110, S / 55, S / 55);
    const [ex, ey] = toPx(...path[path.length - 1]);
    ctx.fillStyle = green;
    ctx.fillRect(ex - S / 80, ey - S / 80, S / 40, S / 40);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const size = () => {
      const px = Math.round(c.clientWidth * Math.min(window.devicePixelRatio, 2));
      c.width = px;
      c.height = px;
      draw();
    };
    paintField();
    size();
    const themeWatch = new MutationObserver(() => {
      paintField();
      draw();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-palette"] });
    window.addEventListener("resize", size);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const run = runRef.current;
      if (run.done || !run.path.length) return;
      // A few optimiser steps per frame keeps the walk brisk but readable.
      for (let i = 0; i < 3 && !run.done; i++) {
        const [x, y] = run.path[run.path.length - 1];
        const [gx, gy] = grad(x, y);
        const eta = lrRef.current;
        if (optRef.current === "momentum") {
          run.v = [0.9 * run.v[0] - eta * gx, 0.9 * run.v[1] - eta * gy];
        } else {
          run.v = [-eta * gx, -eta * gy];
        }
        const nx = x + run.v[0];
        const ny = y + run.v[1];
        let state = "descending";
        if (!Number.isFinite(nx) || Math.abs(nx) > RANGE * 1.4 || Math.abs(ny) > RANGE * 1.4) {
          run.done = true;
          state = "diverged: the step was too large";
        } else {
          run.path.push([nx, ny]);
          if (Math.hypot(gx, gy) < 0.02) {
            run.done = true;
            state = "converged at a minimum";
          } else if (run.path.length > 1400) {
            run.done = true;
            state = "stopped: still bouncing after 1,400 steps";
          }
        }
        const [lx, ly] = run.path[run.path.length - 1];
        setStats({ steps: run.path.length - 1, loss: himmelblau(lx, ly), state });
      }
      draw();
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      window.removeEventListener("resize", size);
    };
  }, [draw, paintField]);

  const start = (x: number, y: number) => {
    runRef.current = { path: [[x, y]], v: [0, 0], done: false };
    setStats({ steps: 0, loss: himmelblau(x, y), state: "descending" });
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    start(((e.clientX - r.left) / r.width - 0.5) * 2 * RANGE, (0.5 - (e.clientY - r.top) / r.height) * 2 * RANGE);
  };

  return (
    <figure className="spotlight-card grid gap-0 md:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
      <canvas
        ref={canvasRef}
        onClick={onClick}
        role="img"
        aria-label="Contour plot of a loss surface with four minima. Click to choose where gradient descent starts."
        className="aspect-square w-full cursor-crosshair [image-rendering:auto]"
      />
      <figcaption className="flex flex-col gap-6 border-t border-border p-5 md:border-l md:border-t-0">
        <div>
          <p className="note">Fig. L1 · loss surface</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Darker is lower. Four valleys, one hill. Click anywhere to drop a starting point.
          </p>
        </div>

        <label className="block">
          <span className="note flex justify-between">
            Learning rate <span className="text-foreground">{lr.toFixed(3)}</span>
          </span>
          <input
            type="range"
            min={0.001}
            max={0.03}
            step={0.001}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--green-fill)]"
          />
        </label>

        <div>
          <p className="note">Optimiser</p>
          <div className="mt-2 grid grid-cols-2 border border-border">
            {(["sgd", "momentum"] as const).map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={opt === o}
                onClick={() => setOpt(o)}
                className={cn(
                  "px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
                  opt === o ? "bg-signal" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => start((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8)}
          className="act self-start"
        >
          Random start
        </button>

        <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 border-t border-border pt-4 font-mono text-xs" aria-live="polite">
          <dt className="text-muted-foreground">steps</dt>
          <dd className="text-right tabular-nums">{stats.steps}</dd>
          <dt className="text-muted-foreground">loss</dt>
          <dd className="text-right tabular-nums">{stats.loss < 1e-4 ? stats.loss.toExponential(1) : stats.loss.toFixed(3)}</dd>
          <dt className="sr-only">state</dt>
          <dd className="col-span-2 pt-2 text-signal">{stats.state}</dd>
        </dl>
      </figcaption>
    </figure>
  );
}
