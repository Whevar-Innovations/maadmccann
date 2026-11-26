import type { WorkPage } from '@/content/types';
import { Pill } from '@/components/ui/Pill';
import { fill, pageWindow } from '@/lib/pagination';

export type PaginationProps = {
  page: number;
  pageCount: number;
  labels: WorkPage['labels'];
  onChange: (page: number) => void;
};

function StepButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const next = direction === 'next';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={`group inline-flex min-h-11 items-center gap-3 rounded-full px-2 text-body font-semibold text-ink transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${next ? 'flex-row' : 'flex-row-reverse'} ${disabled ? 'pointer-events-none opacity-35' : ''}`}
    >
      <span>{label}</span>
      {/* The work-tile line: a 24px stem that stretches to 48px, with the tip following. */}
      <span aria-hidden="true" className={`inline-flex items-center ${next ? '' : 'flex-row-reverse'}`}>
        <span
          className={`inline-block h-px w-6 bg-current transition-transform duration-500 ease-brand group-hover:scale-x-[2] group-focus-visible:scale-x-[2] motion-reduce:transition-none ${next ? 'origin-left' : 'origin-right'}`}
        />
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-500 ease-brand group-hover:translate-x-6 group-focus-visible:translate-x-6 motion-reduce:transition-none ${next ? '-ml-1.5' : '-mr-1.5 -scale-x-100 group-hover:-translate-x-6 group-focus-visible:-translate-x-6'}`}
        >
          <path d="m4 2 4.5 4L4 10" />
        </svg>
      </span>
    </button>
  );
}

/**
 * Paginator: Prev, windowed page circles (1 … 4 5 6 … 12), Next. Below md the circles give way
 * to "Page 3 of 12". Prev/Next stay in layout at the ends so the row never shifts.
 */
export function Pagination({ page, pageCount, labels, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={labels.paginationLabel}
      className="flex items-center justify-between gap-4 md:justify-center md:gap-8"
    >
      <StepButton
        direction="prev"
        label={labels.previous}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      />

      <ol className="hidden items-center gap-2 md:flex">
        {pageWindow(page, pageCount).map((entry, i) =>
          entry === null ? (
            <li key={`gap-${i}`} aria-hidden="true" className="w-6 text-center text-body text-ink/50">
              …
            </li>
          ) : (
            <li key={entry}>
              <Pill
                tone="ink"
                shape="circle"
                selected={entry === page}
                aria-current={entry === page ? 'page' : undefined}
                aria-label={fill(labels.goToPage, { n: entry })}
                onClick={() => onChange(entry)}
              >
                {entry}
              </Pill>
            </li>
          ),
        )}
      </ol>

      <p className="text-small font-semibold text-ink tabular-nums md:hidden">
        {fill(labels.pageOf, { page, total: pageCount })}
      </p>

      <StepButton
        direction="next"
        label={labels.next}
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      />
    </nav>
  );
}
