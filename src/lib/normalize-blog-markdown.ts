/**
 * CMS/copy-paste often emits GFM tables on one line, with rows glued as `| col | | next row...`.
 * remark-gfm only parses tables when each row is on its own line.
 */
export function normalizeBlogMarkdown(md: string): string {
  let out = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  out = out
    .split("\n")
    .map((line) => {
      const pipes = (line.match(/\|/g) ?? []).length;
      if (pipes < 10) return line;
      return line.replace(/\|\s+\|/g, "|\n|");
    })
    .join("\n");

  return out;
}
