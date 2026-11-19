import type { AnchorHTMLAttributes, PointerEvent, ReactNode } from 'react';
import type { Link as LinkType } from '@/content/types';
import { Link } from './Link';

export type ButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  link: LinkType;
  variant?: 'pill-light' | 'pill-outline';
  size?: 'sm' | 'md';
  children?: ReactNode;
};

/**
 * Brand pill CTA button (Header "Talk To Us" and CTA band "Let's Talk").
 */
export function Button({
  link,
  variant = 'pill-light',
  size = 'md',
  className = '',
  children,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: ButtonProps) {
  // The fill grows from (and shrinks back to) wherever the pointer crosses the edge.
  const setOrigin = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--fx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--fy', `${e.clientY - r.top}px`);
  };
  const base =
    'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-body font-semibold transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgb(0_0_0/0.28)] focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper';
  const variants = {
    'pill-light': 'bg-paper text-crimson-800',
    'pill-outline': 'border border-paper/80 text-paper',
  } as const;
  // Colour the fill wipes to on hover, and the text colour that goes with it.
  const wipe = {
    'pill-light': { fill: 'bg-crimson-800', text: 'group-hover:text-paper group-focus-visible:text-paper' },
    'pill-outline': { fill: 'bg-paper', text: 'group-hover:text-crimson-800 group-focus-visible:text-crimson-800' },
  } as const;
  const sizes = {
    sm: 'px-5 py-2 text-small',
    md: 'px-8 py-3 text-small sm:text-body',
  } as const;

  return (
    <Link
      href={link.href}
      external={link.external}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
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
      <span
        aria-hidden="true"
        style={{ left: 'var(--fx, 50%)', top: 'var(--fy, 50%)' }}
        className={`pointer-events-none absolute aspect-square w-[240%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-focus-visible:scale-100 ${wipe[variant].fill}`}
      />
      <span
        className={`relative z-10 transition-colors duration-300 ${wipe[variant].text}`}
      >
        {children ?? link.label}
      </span>
    </Link>
  );
}
