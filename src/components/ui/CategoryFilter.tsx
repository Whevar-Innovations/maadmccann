import { useEffect, useRef } from 'react';
import { Pill } from './Pill';
import { useHeroEntrance } from '@/motion/useHeroEntrance';

/** One filter choice; `count` (optional) shows after the label, e.g. "Beverages 16". */
export type FilterOption = { id: string; label: string; count?: number };

export type CategoryFilterProps = {
  label: string;
  allLabel: string;
  /** Shown after the "All" pill when the options carry counts. */
  allCount?: number;
  categories: FilterOption[];
  /** Selected category id, or null for "all". */
  value: string | null;
  onChange: (categoryId: string | null) => void;
  /**
   * From lg up, lay the pills out in exactly this many centred lines (balanced by label length)
   * instead of free wrapping, so the count holds at every width. Below lg they stay a swipe row.
   */
  rows?: number;
};

type Option = { id: string | null; label: string; count?: number };

/** Pill width estimate in characters: label + count, plus a constant for padding and gap. */
const PILL_PAD_CHARS = 6;
const weight = (o: Option) =>
  o.label.length + (o.count !== undefined ? String(o.count).length + 1 : 0) + PILL_PAD_CHARS;

/** Split options, in order, into `rows` lines of roughly equal width (never more than `rows`). */
function balanceRows(options: Option[], rows: number): Option[][] {
  const total = options.reduce((sum, o) => sum + weight(o), 0);
  const lines: Option[][] = [[]];
  let acc = 0;
  options.forEach((o, i) => {
    const w = weight(o);
    const line = lines[lines.length - 1];
    const target = (total * lines.length) / rows;
    const remaining = options.length - i;
    const linesLeft = rows - lines.length;
    // Start a new line once this pill's midpoint passes the line's share (keep a pill per line left).
    if (line && line.length > 0 && linesLeft > 0 && (acc + w / 2 > target || remaining <= linesLeft)) {
      lines.push([o]);
    } else {
      line?.push(o);
    }
    acc += w;
  });
  return lines;
}

/**
 * Sector pills. Wrapped and centred from md up (or, with `rows`, exactly that many balanced lines from lg);
 * below that a single scrolling row with the
 * selected pill kept in view and faded edges instead of a four-row stack.
 */
export function CategoryFilter({ label, allLabel, allCount, categories, value, onChange, rows }: CategoryFilterProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  useHeroEntrance(rowRef, { targets: '[data-pill]', delay: 0.2 });

  // Keep the selected pill in view on the mobile scroller (scrollTo on the row, never the page).
  useEffect(() => {
    const row = rowRef.current;
    const selected = row?.querySelector<HTMLElement>('[data-selected="true"]');
    if (!row || !selected || row.scrollWidth <= row.clientWidth) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollTo({
      left: selected.offsetLeft - (row.clientWidth - selected.offsetWidth) / 2,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [value]);

  const options: Option[] = [
    { id: null, label: allLabel, count: allCount },
    ...categories,
  ];

  const renderPill = (option: Option) => {
    const selected = option.id === value;
    return (
      <span key={option.id ?? 'all'} data-pill data-selected={selected} className="shrink-0 snap-center">
        <Pill
          selected={selected}
          aria-pressed={selected}
          onClick={() => onChange(option.id)}
          className="whitespace-nowrap"
        >
          {option.label}
          {option.count !== undefined && (
            <>
              {' '}
              <span className="ml-1 tabular-nums opacity-60">{option.count}</span>
            </>
          )}
        </Pill>
      </span>
    );
  };

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label={label}
      className={`-mx-5 flex snap-x gap-2.5 overflow-x-auto px-5 py-1 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] [&::-webkit-scrollbar]:hidden ${
        rows
          ? // Balanced lines need ~825px each, so tablets keep the swipe row until lg.
            'lg:mx-auto lg:flex-col lg:items-center lg:gap-3 lg:overflow-visible lg:px-0 lg:[mask-image:none]'
          : 'md:mx-auto md:max-w-[56rem] md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:px-0 md:[mask-image:none]'
      }`}
    >
      {rows
        ? balanceRows(options, rows).map((line, i) => (
            <div key={i} className="contents lg:flex lg:flex-nowrap lg:justify-center lg:gap-3">
              {line.map(renderPill)}
            </div>
          ))
        : options.map(renderPill)}
    </div>
  );
}
