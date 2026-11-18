import { useEffect, useRef, useState } from 'react';
import type { SiteSettings } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { ContentLink, Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { DUR, EASE } from '@/motion/tokens';
import maadLogoWhiteSrc from '@/assets/svg/maad-logo-white.svg';

export type HeaderProps = {
  settings: SiteSettings;
};

/**
 * Site header (SPEC §7 #1 & §8.6, matching Screenshot From 2026-11-18 14-36-17.png).
 * - Logo left, 8 nav links centered, white pill "Talk To Us" button right.
 * - Transparent at top, then ink at 80% blur after 80px scroll.
 * - Hides on scroll down, shows on scroll up (0.4s power3.out).
 */
export function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const hiddenRef = useRef(false);
  const { stopScroll, startScroll } = useSmoothScroll();

  useEffect(() => {
    if (!menuOpen) return;
    stopScroll();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      startScroll();
    };
  }, [menuOpen, stopScroll, startScroll]);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;

      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolledPastThreshold(y > 80);

          if (menuOpen) return;

          const shouldHide = y > 120 && self.direction === 1;
          if (shouldHide !== hiddenRef.current) {
            hiddenRef.current = shouldHide;
            gsap.to(header, {
              yPercent: shouldHide ? -100 : 0,
              duration: reduced ? 0.01 : DUR.ui,
              ease: EASE.soft,
              overwrite: 'auto',
            });
          }
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: headerRef, dependencies: [menuOpen] },
  );

  return (
    <header
      ref={headerRef}
      data-site-header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 will-change-transform ${
        scrolledPastThreshold && !menuOpen
          ? 'bg-ink/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1760px] items-center justify-between gap-6 px-6 sm:px-10 lg:h-28 lg:px-16">
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
            width={215}
            height={25}
            className="h-5 w-auto sm:h-6"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center lg:flex"
        >
          <ul className="flex items-center gap-6 xl:gap-8">
            {settings.nav.map((item) => (
              <li key={item.href} data-header-item>
                <ContentLink
                  link={item}
                  className="text-small font-medium text-paper/95 transition-opacity hover:opacity-75"
                />
              </li>
            ))}
          </ul>
        </nav>

        <div data-header-item className="hidden lg:block">
          <Button
            link={settings.navCta}
            size="sm"
            className="px-7 py-2.5 font-bold text-ink"
          />
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
