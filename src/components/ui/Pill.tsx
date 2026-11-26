import type { ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react';

export type PillProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** The active choice: solid fill, no hover change. */
  selected?: boolean;
  tone?: 'crimson' | 'ink';
  shape?: 'pill' | 'circle';
  children: ReactNode;
};

/**
 * Selectable pill / numbered circle for in-page state (sector filter, pagination).
 * Default: paper with a hairline. Hover and keyboard focus: the brand fill wipe grows from where
 * the pointer crossed the edge (same mechanic as ui/Button). Selected: solid fill.
 * Reduced motion gets an instant colour change instead of the wipe.
 */
export function Pill({
  selected = false,
  tone = 'crimson',
  shape = 'pill',
  className = '',
  children,
  onPointerEnter,
  onPointerLeave,
  type = 'button',
  ...rest
}: PillProps) {
  const setOrigin = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--fx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--fy', `${e.clientY - r.top}px`);
  };

  const tones = {
    crimson: {
      selected: 'border-service-red bg-service-red text-paper',
      idle: 'border-line bg-paper text-ink hover:border-service-red focus-visible:border-service-red',
      focus: 'focus-visible:outline-service-red',
      fill: 'bg-service-red',
    },
    ink: {
      selected: 'border-ink bg-ink text-paper',
      idle: 'border-line bg-paper text-ink hover:border-ink focus-visible:border-ink',
      focus: 'focus-visible:outline-ink',
      fill: 'bg-ink',
    },
  } as const;
  const shapes = {
    pill: 'min-h-11 px-5 text-small tracking-wide uppercase md:min-h-0 md:py-1.5',
    circle: 'size-11 text-body tabular-nums',
  } as const;
  const t = tones[tone];

  return (
    <button
      type={type}
      className={`group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border font-body font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${shapes[shape]} ${selected ? t.selected : t.idle} ${t.focus} ${className}`.trim()}
      onPointerEnter={(e) => {
        setOrigin(e);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setOrigin(e);
        onPointerLeave?.(e);
      }}
      {...rest}
    >
      {!selected && (
        <span
          aria-hidden="true"
          style={{ left: 'var(--fx, 50%)', top: 'var(--fy, 50%)' }}
          className={`pointer-events-none absolute aspect-square w-[240%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-700 ease-brand group-hover:scale-100 group-focus-visible:scale-100 motion-reduce:transition-none ${t.fill}`}
        />
      )}
      <span
        className={`relative z-10 transition-colors duration-300 ${selected ? '' : 'group-hover:text-paper group-focus-visible:text-paper'}`}
      >
        {children}
      </span>
    </button>
  );
}
