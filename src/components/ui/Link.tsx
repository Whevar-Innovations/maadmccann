import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router';
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

/** Routes that exist so far. Every other internal link renders disabled until its page ships. */
const ENABLED_ROUTES = new Set(['/', '/what-we-do', '/csr', '/the-maad-ones', '/blog']);
/** Sections whose child pages exist too (e.g. /blog/:slug). */
const ENABLED_PREFIXES = ['/blog/'];

function pathOf(href: string): string {
  const path = (href.split('#')[0] ?? '').split('?')[0] ?? '';
  return path === '' ? '/' : path.replace(/(.)\/$/, '$1');
}

const isEnabledPath = (path: string) =>
  ENABLED_ROUTES.has(path) || ENABLED_PREFIXES.some((prefix) => path.startsWith(prefix));

/**
 * Router-aware link primitive.
 * Only routes in ENABLED_ROUTES (plus hash, external, mailto/tel links) are navigable;
 * the rest render with aria-disabled and do nothing on click.
 * The link to the current page gets aria-current="page".
 */
export function Link({ href, external, children, className, onClick, ...rest }: LinkProps) {
  const { navigateWithTransition } = usePageTransition();
  const { pathname } = useLocation();
  const isNative = isNativeHref(href, external);
  const isDisabledRoute = !isNative && !isEnabledPath(pathOf(href));
  const isCurrent = !isNative && !href.includes('#') && pathOf(href) === pathOf(pathname);
  // The section link (e.g. "Blog") while on one of its child pages (/blog/:slug).
  const isCurrentSection =
    !isNative &&
    !isCurrent &&
    !href.includes('#') &&
    pathOf(href) !== '/' &&
    pathOf(pathname).startsWith(`${pathOf(href)}/`);

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
      aria-current={isCurrent ? 'page' : isCurrentSection ? 'true' : undefined}
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
