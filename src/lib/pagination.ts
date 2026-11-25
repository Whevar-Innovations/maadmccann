/** Clamp a requested page into 1..pageCount (NaN and out-of-range values fall back sensibly). */
export function clampPage(requested: number, pageCount: number): number {
  if (!Number.isFinite(requested)) return 1;
  return Math.min(Math.max(1, Math.trunc(requested)), Math.max(1, pageCount));
}

/**
 * Page numbers to show, with `null` for an ellipsis: first, last, and the current page ±1.
 * 1 … 4 5 6 … 12. Short lists (up to 7 pages) show every page.
 */
export function pageWindow(current: number, pageCount: number): (number | null)[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const wanted = new Set([1, pageCount, current - 1, current, current + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  pages.forEach((p, i) => {
    const prev = pages[i - 1];
    if (prev !== undefined && p - prev > 1) out.push(null);
    out.push(p);
  });
  return out;
}

/** Replaces `{token}` placeholders in interface copy. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
