"use client";

import { Search } from "lucide-react";

/** Dock button that opens the command palette (also bound to ⌘K / Ctrl+K). */
export function PaletteTrigger() {
  return (
    <button
      type="button"
      aria-label="Open command palette"
      onClick={() => window.dispatchEvent(new CustomEvent("palette:open"))}
      className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl"
    >
      <Search className="size-[1.125rem]" strokeWidth={2} aria-hidden />
    </button>
  );
}
