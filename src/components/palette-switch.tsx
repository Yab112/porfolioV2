"use client";

import { useEffect, useState } from "react";

export const PALETTES = [
  { id: "aubergine", name: "Aubergine & Mint", purple: "#8e62a9", green: "#45e896" },
  { id: "orchid", name: "Orchid & Lime", purple: "#c99cff", green: "#c3f26b" },
  { id: "sage", name: "Plum & Sage", purple: "#c5a8e0", green: "#9ad6ae" },
  { id: "ink", name: "Ink", purple: "#a78bfa", green: "#4ade80" },
] as const;

const KEY = "palette";

function apply(id: string) {
  if (id === "aubergine") document.documentElement.removeAttribute("data-palette");
  else document.documentElement.setAttribute("data-palette", id);
}

/** Cycles the site through its colour options and remembers the choice on this device. */
export function PaletteSwitch({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* private mode: stay on the default */
    }
    const i = PALETTES.findIndex((p) => p.id === saved);
    if (i > 0) {
      setIndex(i);
      apply(PALETTES[i].id);
    }
  }, []);

  const next = () => {
    const i = (index + 1) % PALETTES.length;
    setIndex(i);
    apply(PALETTES[i].id);
    try {
      localStorage.setItem(KEY, PALETTES[i].id);
    } catch {
      /* ignore */
    }
  };

  const p = PALETTES[index];
  return (
    <button
      type="button"
      onClick={next}
      title={`Colours: ${p.name}. Click for the next option.`}
      aria-label={`Colour option ${index + 1} of ${PALETTES.length}: ${p.name}. Activate for the next option.`}
      className={className}
    >
      <span className="flex size-4 overflow-hidden border border-border" aria-hidden>
        <span className="h-full w-1/2" style={{ background: p.purple }} />
        <span className="h-full w-1/2" style={{ background: p.green }} />
      </span>
    </button>
  );
}
