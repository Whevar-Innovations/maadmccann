import type { AnchorHTMLAttributes, ReactNode } from 'react';
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
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full font-body font-semibold transition-opacity duration-300 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper';
  const variants = {
    'pill-light': 'bg-paper text-crimson-800',
    'pill-outline': 'border border-paper/80 text-paper',
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
      {...rest}
    >
      {children ?? link.label}
    </Link>
  );
}
