import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import type { Link as LinkType } from '@/content/types';

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
 * Router-aware link primitive. Uses React Router <Link> for internal routes
 * and native <a> for hash/external/mailto/tel links.
 */
export function Link({ href, external, children, className, ...rest }: LinkProps) {
  if (isNativeHref(href, external)) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} className={className} {...rest}>
      {children}
    </RouterLink>
  );
}

export function ContentLink({
  link,
  className,
  children,
  ...rest
}: Omit<LinkProps, 'href' | 'external'> & { link: LinkType }) {
  return (
    <Link href={link.href} external={link.external} className={className} {...rest}>
      {children ?? link.label}
    </Link>
  );
}
