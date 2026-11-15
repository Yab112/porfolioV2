/**
 * Normalizes Markdown from CMS/paste for the blog.
 *
 * - Strips stray "Closing" lines, normalizes fullwidth pipes.
 * - Splits collapsed rows (`| |` → newlines).
 * - Converts pipe-grid "tables" into plain bullet lists (**title** — link) instead of GFM tables.
 */

const CLOSING_LINE = /^\s*Closing\s*$/gim;

/** Prose on the same line as a pipe grid: insert break before the grid. */
const PROSE_THEN_PIPE_GRID = /\s+(?=\|[^|\r\n]+\|[^|\r\n]+\|\s+\|(?:[-\s:|]+\|)+)/;

const COLLAPSED_ROW = /\|\s+\|(?=[^|\r\n])/g;

function splitProseFromPipeGridOnSameLine(line: string): string {
  const m = line.match(PROSE_THEN_PIPE_GRID);
  if (!m || m.index === undefined || m.index === 0) return line;

  const prose = line.slice(0, m.index).trimEnd();
  const grid = line.slice(m.index).trim();

  if (!prose || prose.includes("|")) return line;
  if (!grid.startsWith("|")) return line;

  return `${prose}\n\n${grid}`;
}

function ensureBlankLineBeforePipeBlock(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];

  for (const line of lines) {
    const prev = out[out.length - 1];
    const isPipeLine = line.trimStart().startsWith("|");
    const prevIsProse =
      prev !== undefined && prev.trim() !== "" && !prev.trimStart().startsWith("|");

    if (isPipeLine && prevIsProse) out.push("");
    out.push(line);
  }

  return out.join("\n");
}

function parsePipeRow(line: string): string[] | null {
  const t = line.trim();
  if (!t.includes("|")) return null;
  const cells = t
    .split("|")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  if (cells.length < 2) return null;
  return cells;
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((c) => /^[-\s:|]+$/u.test(c));
}

function isHeaderRow(cells: string[]): boolean {
  if (cells.length < 2) return false;
  return cells[0].toLowerCase() === "topic" && cells[1].toLowerCase() === "link";
}

function rowHasUrl(cells: string[]): boolean {
  return cells.some((c) => /^https?:\/\//i.test(c));
}

/** One bullet: **first cell** — rest joined with em dashes. */
function cellsToBullet(cells: string[]): string {
  if (cells.length < 2) return "";
  const [first, ...rest] = cells;
  const tail = rest.join(" — ");
  return `- **${first}** — ${tail}`;
}

/**
 * Turn consecutive `| a | b |` lines into markdown bullets (no HTML table).
 */
function convertPipeGridsToBulletLists(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const parsed = parsePipeRow(lines[i]);
    if (parsed && parsed.length >= 2) {
      let j = i;
      const block: string[][] = [];
      while (j < lines.length) {
        const row = parsePipeRow(lines[j]);
        if (!row || row.length < 2) break;
        block.push(row);
        j++;
      }

      const hasSep = block.some(isSeparatorRow);
      const hasHeader = block.some(isHeaderRow);
      const hasUrl = block.some(rowHasUrl);
      const allTwoCols = block.every((c) => c.length === 2);

      // A block with a separator row is a real GFM table and is rendered as one.
      // Only legacy "Topic | Link" grids and separator-less pipe rows become bullets.
      const shouldConvert =
        block.length >= 2 && (hasHeader || (!hasSep && (hasUrl || allTwoCols)));

      if (shouldConvert) {
        for (const c of block) {
          if (isSeparatorRow(c)) continue;
          if (isHeaderRow(c)) continue;
          const b = cellsToBullet(c);
          if (b) out.push(b);
        }
        i = j;
        continue;
      }
    }

    out.push(lines[i]);
    i++;
  }

  return out.join("\n");
}

function ensureBlankLineBeforeList(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];

  for (const line of lines) {
    const prev = out[out.length - 1];
    const isList = /^\s*[-*]\s/.test(line);
    const prevIsProse =
      prev !== undefined &&
      prev.trim() !== "" &&
      !/^\s*[-*]\s/.test(prev) &&
      !prev.trimStart().startsWith("|");

    if (isList && prevIsProse) out.push("");
    out.push(line);
  }

  return out.join("\n");
}

/**
 * Emphasis colours, written as plain text so the Markdown stays readable:
 *   ==highlight==   {+improvement+}   {-regression-}
 * They become links to `#hl`, `#pos`, `#neg`, which the renderer draws as coloured marks.
 * Inline code is left alone.
 */
function colourMarks(md: string): string {
  return md
    .split(/(`[^`\n]*`)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part
            .replace(/==([^=\n][^\n]*?)==/g, "[$1](#hl)")
            .replace(/\{\+([^\n]+?)\+\}/g, "[$1](#pos)")
            .replace(/\{-([^\n]+?)-\}/g, "[$1](#neg)")
    )
    .join("");
}

function prepareProse(md: string): string {
  let s = colourMarks(md);
  s = s.replace(/\uFF5C/g, "|");
  s = s.replace(CLOSING_LINE, "");

  s = s
    .split("\n")
    .map((line) => splitProseFromPipeGridOnSameLine(line))
    .join("\n");

  s = s.replace(COLLAPSED_ROW, "|\n|");
  s = ensureBlankLineBeforePipeBlock(s);
  s = convertPipeGridsToBulletLists(s);
  s = ensureBlankLineBeforeList(s);
  return s;
}

/** Fenced blocks (code, chart JSON, diagrams) are passed through byte for byte. */
export function prepareBlogMarkdown(md: string): string {
  const src = md.replace(/\r\n?/g, "\n").trim();
  if (!src) return src;

  const out: string[] = [];
  let prose: string[] = [];
  let fence: string[] | null = null;
  const flush = () => {
    if (prose.length) out.push(prepareProse(prose.join("\n")));
    prose = [];
  };
  for (const line of src.split("\n")) {
    const isFence = line.trimStart().startsWith("```");
    if (fence) {
      fence.push(line);
      if (isFence) {
        out.push(fence.join("\n"));
        fence = null;
      }
    } else if (isFence) {
      flush();
      fence = [line];
    } else {
      prose.push(line);
    }
  }
  if (fence) out.push(fence.join("\n"));
  flush();
  return out.join("\n");
}
