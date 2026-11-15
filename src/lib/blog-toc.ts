/** Heading ids + table of contents, shared by the post renderer and the page. */

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[`*_~]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80) || "section"
  );
}

export function extractToc(md: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_~]/g, "").trim();
    if (text) items.push({ id: slugifyHeading(text), text, level: m[1].length as 2 | 3 });
  }
  return items;
}
