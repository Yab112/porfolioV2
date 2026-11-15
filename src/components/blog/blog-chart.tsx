"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Chart block for blog posts. The writer agent emits a JSON spec in a
 * ```chart fence (validated server-side in aegis-agent/src/blog/rich_content.py);
 * this draws it as SVG with a hover readout, a legend and a data-table view.
 */
export type ChartSpec = {
  type: "line" | "area" | "bar" | "scatter";
  title: string;
  x?: (string | number)[];
  series: { name: string; data: (number | [number, number])[] }[];
  x_label?: string;
  y_label?: string;
  unit?: string;
  caption?: string;
  basis?: "sourced" | "illustrative";
  source?: { label: string; url: string };
};

const SERIES_VARS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];
const M = { top: 12, right: 16, bottom: 44, left: 52 };

export function parseChartSpec(raw: string): ChartSpec | null {
  try {
    const s = JSON.parse(raw) as ChartSpec;
    if (!s || !["line", "area", "bar", "scatter"].includes(s.type)) return null;
    if (!Array.isArray(s.series) || s.series.length === 0 || s.series.length > 4) return null;
    if (s.type === "scatter") {
      const ok = s.series.every(
        (se) => Array.isArray(se.data) && se.data.every((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite))
      );
      return ok ? s : null;
    }
    if (!Array.isArray(s.x) || s.x.length < 2) return null;
    const ok = s.series.every(
      (se) => Array.isArray(se.data) && se.data.length === s.x!.length && se.data.every((v) => typeof v === "number" && Number.isFinite(v))
    );
    return ok ? s : null;
  } catch {
    return null;
  }
}

function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    max = min + 1;
  }
  const span = max - min;
  const step0 = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = span / count / step0;
  const step = step0 * (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1);
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.5; v += step) ticks.push(Number(v.toPrecision(12)));
  return ticks;
}

function fmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1e9) return `${+(v / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `${+(v / 1e6).toFixed(1)}M`;
  if (a >= 1e4) return `${+(v / 1e3).toFixed(1)}k`;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: a < 10 ? 2 : 1 }).format(v);
}

export function BlogChart({ spec }: { spec: ChartSpec }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.floor(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = Math.round(Math.min(360, Math.max(220, width * 0.5)));
  const iw = width - M.left - M.right;
  const ih = height - M.top - M.bottom;
  const isScatter = spec.type === "scatter";
  const unit = spec.unit ? ` ${spec.unit}` : "";
  const n = spec.x?.length ?? 0;

  const model = useMemo(() => {
    const ys = spec.series.flatMap((s) => s.data.map((d) => (Array.isArray(d) ? d[1] : d)));
    const yMinRaw = Math.min(...ys);
    const yMaxRaw = Math.max(...ys);
    // Bars and areas encode magnitude from zero; lines may zoom when all values are far from it.
    const zeroBased = spec.type !== "line" && !isScatter ? true : yMinRaw >= 0 && yMinRaw < (yMaxRaw - yMinRaw) * 1.5;
    const yTicks = niceTicks(zeroBased ? Math.min(0, yMinRaw) : yMinRaw, yMaxRaw);
    const y0 = yTicks[0];
    const y1 = yTicks[yTicks.length - 1];
    let xTicks: number[] = [];
    let x0 = 0;
    let x1 = 1;
    if (isScatter) {
      const xs = spec.series.flatMap((s) => s.data.map((d) => (d as [number, number])[0]));
      xTicks = niceTicks(Math.min(...xs), Math.max(...xs));
      x0 = xTicks[0];
      x1 = xTicks[xTicks.length - 1];
    }
    return { yTicks, y0, y1, xTicks, x0, x1 };
  }, [spec, isScatter]);

  const sy = (v: number) => M.top + ih - ((v - model.y0) / (model.y1 - model.y0)) * ih;
  const band = n > 0 ? iw / n : iw;
  const sx = (i: number) =>
    spec.type === "bar" ? M.left + band * (i + 0.5) : M.left + (n > 1 ? (iw * i) / (n - 1) : iw / 2);
  const sxv = (v: number) => M.left + ((v - model.x0) / (model.x1 - model.x0)) * iw;
  const baseline = sy(Math.max(model.y0, Math.min(0, model.y1)));

  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 64))));
  const multi = spec.series.length > 1;

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (isScatter || n === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - M.left;
    const i = spec.type === "bar" ? Math.floor(px / band) : Math.round((px / iw) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  }

  const tipLeft = hover === null ? 0 : Math.min(Math.max(sx(hover), 90), width - 90);

  return (
    <figure className="blog-chart not-prose my-10 border border-border bg-card p-4 sm:p-5">
      <figcaption className="mb-3">
        <div className="text-[15px] font-semibold leading-snug text-foreground">{spec.title}</div>
        {spec.y_label || spec.unit ? (
          <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            {[spec.y_label, spec.unit ? `(${spec.unit})` : ""].filter(Boolean).join(" ")}
          </div>
        ) : null}
      </figcaption>

      {multi ? (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-foreground/85">
          {spec.series.map((s, i) => (
            <li key={s.name} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5"
                style={{ background: SERIES_VARS[i], borderRadius: spec.type === "bar" ? 2 : 999 }}
              />
              {s.name}
            </li>
          ))}
        </ul>
      ) : null}

      <div ref={wrapRef} className="relative w-full">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${spec.title}. ${spec.caption ?? ""}`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          className="block max-w-full select-none"
        >
          {model.yTicks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={width - M.right} y1={sy(t)} y2={sy(t)} stroke="var(--border)" strokeWidth={1} strokeDasharray={t === 0 ? undefined : "2 4"} />
              <text x={M.left - 8} y={sy(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground font-mono" fontSize={11}>
                {fmt(t)}
              </text>
            </g>
          ))}

          {isScatter
            ? model.xTicks.map((t) => (
                <text key={t} x={sxv(t)} y={height - M.bottom + 16} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={11}>
                  {fmt(t)}
                </text>
              ))
            : spec.x!.map((label, i) =>
                i % labelEvery === 0 ? (
                  <text
                    key={i}
                    x={sx(i)}
                    y={height - M.bottom + 16}
                    // the first and last labels of a line chart sit on the plot edges: anchor them inward so they are not cut off
                    textAnchor={spec.type === "bar" ? "middle" : i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                    className="fill-muted-foreground font-mono"
                    fontSize={11}
                  >
                    {String(label).length > 12 ? `${String(label).slice(0, 11)}…` : String(label)}
                  </text>
                ) : null
              )}
          {spec.x_label ? (
            <text x={M.left + iw / 2} y={height - 6} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>
              {spec.x_label}
            </text>
          ) : null}

          {hover !== null && spec.type !== "bar" && !isScatter ? (
            <line x1={sx(hover)} x2={sx(hover)} y1={M.top} y2={M.top + ih} stroke="var(--muted-foreground)" strokeWidth={1} />
          ) : null}
          {hover !== null && spec.type === "bar" ? (
            <rect x={M.left + band * hover} y={M.top} width={band} height={ih} fill="var(--muted)" opacity={0.5} />
          ) : null}

          {spec.series.map((s, si) => {
            const color = SERIES_VARS[si];
            if (isScatter) {
              return (s.data as [number, number][]).map(([x, y], i) => (
                <circle key={`${si}-${i}`} cx={sxv(x)} cy={sy(y)} r={4.5} fill={color} stroke="var(--card)" strokeWidth={2}>
                  <title>{`${s.name}: ${fmt(x)}, ${fmt(y)}${unit}`}</title>
                </circle>
              ));
            }
            const vals = s.data as number[];
            if (spec.type === "bar") {
              const group = Math.min(band * 0.72, 56 * spec.series.length);
              const bw = Math.max(2, group / spec.series.length - 2);
              return vals.map((v, i) => {
                const x = sx(i) - group / 2 + si * (group / spec.series.length) + 1;
                const y = Math.min(sy(v), baseline);
                const h = Math.max(1, Math.abs(sy(v) - baseline));
                const r = Math.min(4, bw / 2, h);
                const up = v >= 0;
                const d = up
                  ? `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + bw - r}Q${x + bw},${y} ${x + bw},${y + r}V${y + h}Z`
                  : `M${x},${y}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + bw - r}Q${x + bw},${y + h} ${x + bw},${y + h - r}V${y}Z`;
                return <path key={`${si}-${i}`} d={d} fill={color} opacity={hover === null || hover === i ? 1 : 0.55} />;
              });
            }
            const line = vals.map((v, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join("");
            return (
              <g key={si}>
                {spec.type === "area" ? (
                  <path d={`${line}L${sx(n - 1)},${baseline}L${sx(0)},${baseline}Z`} fill={color} opacity={0.16} />
                ) : null}
                <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                {n <= 16 || hover !== null
                  ? vals.map((v, i) =>
                      n <= 16 || hover === i ? (
                        <circle key={i} cx={sx(i)} cy={sy(v)} r={hover === i ? 5 : 3.5} fill={color} stroke="var(--card)" strokeWidth={2} />
                      ) : null
                    )
                  : null}
              </g>
            );
          })}
        </svg>

        {hover !== null && !isScatter ? (
          <div
            className="pointer-events-none absolute top-1 z-10 w-max max-w-[180px] -translate-x-1/2 border border-border bg-background px-2.5 py-1.5 text-[12px] shadow-sm"
            style={{ left: tipLeft }}
          >
            <div className="font-mono text-[11px] text-muted-foreground">{String(spec.x![hover])}</div>
            {spec.series.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-foreground">
                <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: SERIES_VARS[i] }} />
                {multi ? <span className="text-muted-foreground">{s.name}</span> : null}
                <span className="ml-auto pl-2 font-semibold tabular-nums">
                  {fmt(s.data[hover] as number)}
                  {unit}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-3 border-t border-border/70 pt-3 text-[13px] leading-relaxed text-muted-foreground">
        {spec.caption ? <p className="text-foreground/85">{spec.caption}</p> : null}
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
          {spec.basis === "sourced" && spec.source ? (
            <span>
              Source:{" "}
              <a href={spec.source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                {spec.source.label}
              </a>
            </span>
          ) : (
            <span title="These numbers illustrate the idea. They are not measurements.">
              Illustrative data, not a measurement
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="underline underline-offset-2 hover:text-foreground"
            aria-expanded={showTable}
          >
            {showTable ? "Hide data" : "View data"}
          </button>
        </p>
        {showTable ? (
          <div className="mt-3 max-h-64 overflow-auto border border-border/70">
            <table className="w-full border-collapse text-left text-[12px] tabular-nums">
              <thead className="sticky top-0 bg-muted">
                <tr>
                  <th className="px-2 py-1.5 font-semibold text-foreground">{isScatter ? "Series" : spec.x_label || ""}</th>
                  {isScatter ? (
                    <>
                      <th className="px-2 py-1.5 font-semibold text-foreground">{spec.x_label || "x"}</th>
                      <th className="px-2 py-1.5 font-semibold text-foreground">{spec.y_label || "y"}</th>
                    </>
                  ) : (
                    spec.series.map((s) => (
                      <th key={s.name} className="px-2 py-1.5 font-semibold text-foreground">
                        {s.name}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {isScatter
                  ? spec.series.flatMap((s) =>
                      (s.data as [number, number][]).map(([x, y], i) => (
                        <tr key={`${s.name}-${i}`} className="border-t border-border/60">
                          <td className="px-2 py-1">{s.name}</td>
                          <td className="px-2 py-1">{fmt(x)}</td>
                          <td className="px-2 py-1">{fmt(y)}</td>
                        </tr>
                      ))
                    )
                  : spec.x!.map((label, i) => (
                      <tr key={i} className="border-t border-border/60">
                        <td className="px-2 py-1">{String(label)}</td>
                        {spec.series.map((s) => (
                          <td key={s.name} className="px-2 py-1">
                            {fmt(s.data[i] as number)}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </figure>
  );
}
