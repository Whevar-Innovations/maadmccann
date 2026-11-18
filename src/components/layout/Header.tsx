import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { ContentLink, Link } from '@/components/ui/Link';
import maadLogoWhiteSrc from '@/assets/svg/maad-logo-white.svg';

export type HeaderProps = {
  settings: SiteSettings;
};

/**
 * Site header (SPEC §7 #1).
 * Logo left, 8 nav links + white pill "Talk To Us" button right.
 * Overlays the hero on desktop; includes accessible full-screen menu on mobile.
 */
export function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header
      data-site-header
      className="fixed inset-x-0 top-0 z-40 transition-colors duration-300"
    >
      <div className="container-site flex h-20 items-center justify-between gap-6 lg:h-24">
        <Link
          href="/"
          aria-label="MAAD McCANN Home"
          data-header-item
          className="relative z-50 shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={maadLogoWhiteSrc}
            alt="MAAD McCANN"
            width={184}
            height={21}
            className="h-4 w-auto sm:h-5"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 lg:flex xl:gap-8"
        >
          <ul className="flex items-center gap-5 xl:gap-7">
            {settings.nav.map((item) => (
              <li key={item.href} data-header-item>
                <ContentLink
                  link={item}
                  className="text-small font-regular text-paper/90 transition-opacity hover:text-paper"
                />
              </li>
            ))}
          </ul>
        </nav>

        <div data-header-item className="hidden lg:block">
          <Button link={settings.navCta} size="sm" className="text-ink font-semibold" />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper lg:hidden"
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile full-screen navigation overlay */}
      {menuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-crimson-950 px-6 pt-28 pb-12 text-paper lg:hidden"
        >
          <nav aria-label="Mobile Primary">
            <ul className="space-y-4">
              {settings.nav.map((item) => (
                <li key={item.href}>
                  <ContentLink
                    link={item}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-showreel font-bold text-paper transition-opacity hover:opacity-80"
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Button
              link={settings.navCta}
              size="md"
              onClick={() => setMenuOpen(false)}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      )}
    </header>
  );
}
