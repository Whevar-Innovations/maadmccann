import { useEffect, useRef } from 'react';
import type { WorkPage } from '@/content/types';
import { Pill } from '@/components/ui/Pill';

export type CategoryFilterProps = {
  label: string;
  allLabel: string;
  categories: WorkPage['categories'];
  /** Selected category id, or null for "all". */
  value: string | null;
  onChange: (categoryId: string | null) => void;
};

/**
 * Sector pills. Wrapped and centred from md up; below that a single scrolling row with the
 * selected pill kept in view and faded edges instead of a four-row stack.
 */
export function CategoryFilter({ label, allLabel, categories, value, onChange }: CategoryFilterProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

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

  const options = [{ id: null, label: allLabel }, ...categories];

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label={label}
      className="-mx-5 flex snap-x gap-2.5 overflow-x-auto px-5 py-1 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] md:mx-auto md:max-w-[56rem] md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:px-0 md:[mask-image:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <span key={option.id ?? 'all'} data-selected={selected} className="snap-center">
            <Pill selected={selected} aria-pressed={selected} onClick={() => onChange(option.id)}>
              {option.label}
            </Pill>
          </span>
        );
      })}
    </div>
  );
}
