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

/**
 * Routes that exist so far. Every other internal link renders disabled until its page ships.
 * Entries with a `:param` segment match any single segment there ('/work/:slug' matches '/work/gotv').
 */
const ENABLED_ROUTES = new Set(['/', '/what-we-do', '/the-maad-ones', '/work', '/work/:slug', '/partners']);

const patternOf = (route: string) => new RegExp(`^${route.replace(/:[^/]+/g, '[^/]+')}$`);

const ROUTE_PATTERNS = [...ENABLED_ROUTES].filter((route) => route.includes(':')).map(patternOf);

const isEnabledRoute = (path: string) =>
  ENABLED_ROUTES.has(path) || ROUTE_PATTERNS.some((pattern) => pattern.test(path));

/**
 * Routes whose page has a `[data-shared-target]` frame: a tile image in the link
 * (`[data-shared-image]`) expands into it instead of the generic page transition.
 */
const SHARED_ROUTES = new Set(['/work/:slug']);
const SHARED_PATTERNS = [...SHARED_ROUTES].map(patternOf);
const isSharedRoute = (path: string) => SHARED_PATTERNS.some((pattern) => pattern.test(path));

function pathOf(href: string): string {
  const path = (href.split('#')[0] ?? '').split('?')[0] ?? '';
  return path === '' ? '/' : path.replace(/(.)\/$/, '$1');
}

/**
 * Router-aware link primitive.
 * Only routes in ENABLED_ROUTES (plus hash, external, mailto/tel links) are navigable;
 * the rest render with aria-disabled and do nothing on click.
 * The link to the current page gets aria-current="page"; the link to its parent section (e.g.
 * "/work" on a "/work/:slug" case study) gets aria-current="true", so the nav still shows where you are.
 */
export function Link({ href, external, children, className, onClick, ...rest }: LinkProps) {
  const { navigateWithTransition } = usePageTransition();
  const { pathname } = useLocation();
  const isNative = isNativeHref(href, external);
  const isDisabledRoute = !isNative && !isEnabledRoute(pathOf(href));
  const linkPath = pathOf(href);
  const isCurrent = !isNative && !href.includes('#') && linkPath === pathOf(pathname);
  const isSection =
    !isNative && !isCurrent && !href.includes('#') && linkPath !== '/' && pathOf(pathname).startsWith(`${linkPath}/`);

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
    navigateWithTransition(href, {
      trigger: e.currentTarget,
      shared: isSharedRoute(pathOf(href)),
    });
  };

  return (
    <RouterLink
      to={isDisabledRoute ? '#' : href}
      aria-disabled={isDisabledRoute ? 'true' : undefined}
      aria-current={isCurrent ? 'page' : isSection ? 'true' : undefined}
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
