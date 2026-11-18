import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import type { Link as LinkType } from '@/content/types';
import { usePageTransition } from '@/motion/PageTransition';

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  external?: boolean;
  children?: ReactNode;
};

function isNativeHref(href: string, external?: boolean): boolean {
  if (external) return true;
  return (
    href.startsWith('#') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}

function isHomePageHref(href: string): boolean {
  return href === '/' || href === '' || href.startsWith('/#') || href.startsWith('#');
}

/**
 * Router-aware link primitive.
 * Per project requirement: All routes/links except the home page are disabled.
 * Only '/' and hash links ('#work', '#footer', etc.) or external links are navigable.
 */
export function Link({ href, external, children, className, onClick, ...rest }: LinkProps) {
  const { navigateWithTransition } = usePageTransition();
  const isNative = isNativeHref(href, external);
  const isHome = isHomePageHref(href);
  const isDisabledRoute = !isNative && !isHome;

  if (isNative) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={className}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Disabled non-home route: prevent navigation completely
    if (isDisabledRoute) {
      e.preventDefault();
      return;
    }

    // Don't intercept modified clicks (e.g. Cmd+click, Ctrl+click, middle click, new tab)
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    e.preventDefault();
    navigateWithTransition(href);
  };

  return (
    <RouterLink
      to={isDisabledRoute ? '#' : href}
      aria-disabled={isDisabledRoute ? 'true' : undefined}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </RouterLink>
  );
}

export function ContentLink({
  link,
  className,
  children,
  onClick,
  ...rest
}: Omit<LinkProps, 'href' | 'external'> & {
  link: LinkType;
}) {
  return (
    <Link
      href={link.href}
      external={link.external}
      className={className}
      onClick={onClick}
      {...rest}
    >
      {children ?? link.label}
    </Link>
  );
}
