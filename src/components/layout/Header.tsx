import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SiteSettings } from '@/content/types';
import darkMotifBgSrc from '@/assets/img/dark-motif-bg.webp';
import maadLogoWhiteSrc from '@/assets/svg/maad-logo-white.svg';
import { Button } from '@/components/ui/Button';
import { ContentLink, Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { Magnetic } from '@/motion/Magnetic';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { DIST, DUR, EASE, STAGGER } from '@/motion/tokens';

export type HeaderProps = {
  settings: SiteSettings;
};

/**
 * Site header (SPEC §7 #1 & §8.6).
 * - Logo left, 8 nav links centered (disabled per route constraints, home active), white pill "Talk To Us" button right.
 * - Transparent at top, then ink at 80% blur after 80px scroll.
 * - Hides on scroll down, shows on scroll up (0.4s power3.out).
 * - Mobile drawer: 100% opaque solid dark blackish (#0E0E10) with embossed line-art motif matching Screenshot 15-52-54.png.
 * - Header hides when drawer opens, preventing duplicate logo/button ghosting.
 */
export function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
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

  // Mobile drawer entrance animation (SPEC §7 #1)
  useGSAP(
    () => {
      if (!menuOpen || !drawerRef.current) return;
      const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;

      const drawer = drawerRef.current;
      const items = drawer.querySelectorAll<HTMLElement>('[data-mobile-nav-item]');

      if (reduced) {
        gsap.fromTo(drawer, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        return;
      }

      const tl = gsap.timeline();
      tl.fromTo(
        drawer,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.45,
          ease: EASE.inOut,
        },
      );
      if (items.length > 0) {
        tl.fromTo(
          items,
          { y: DIST.rise * 0.4, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: STAGGER.items * 0.5,
            ease: EASE.out,
          },
          '-=0.2',
        );
      }
    },
    { scope: drawerRef, dependencies: [menuOpen] },
  );

  return (
    <>
      <header
        ref={headerRef}
        data-site-header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,opacity] duration-300 will-change-transform ${
          menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${
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

          {/* Desktop navigation (routes disabled per project constraints) */}
          <nav aria-label="Primary" className="hidden items-center lg:flex">
            <ul className="flex items-center gap-6 xl:gap-8">
              {settings.nav.map((item) => (
                <li key={item.href} data-header-item>
                  <ContentLink
                    link={item}
                    className="group relative inline-block py-1 text-small font-medium text-paper/95 cursor-default transition-colors duration-300 hover:text-gold-500 focus-visible:text-gold-500"
                  >
                    <span>{item.label}</span>
                    {/* Underline indicator */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 bg-gold-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </ContentLink>
                </li>
              ))}
            </ul>
          </nav>

          <div data-header-item className="hidden lg:block">
            <Magnetic>
              <Button
                link={{ label: settings.navCta.label, href: '#footer' }}
                size="sm"
                className="px-7 py-2.5 font-bold text-ink"
              />
            </Magnetic>
          </div>

          {/* Mobile menu hamburger button */}
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
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Portaled full-height 100% opaque dark blackish mobile drawer */}
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[9950] flex h-dvh min-h-svh w-screen flex-col justify-between overflow-y-auto bg-[#0E0E10] text-paper lg:hidden"
          >
            {/* Subtle embossed dark motif background matching Screenshot 15-52-54.png */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
              style={{ backgroundImage: `url(${darkMotifBgSrc})` }}
            />

            {/* Top drawer bar: single logo + close button matching header h-20 px-6 sm:px-10 */}
            <div className="relative z-10 flex h-20 w-full shrink-0 items-center justify-between px-6 sm:px-10">
              <Link
                href="/"
                aria-label="MAAD McCANN Home"
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

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:border-paper hover:bg-paper/10"
              >
                <span className="sr-only">Close navigation menu</span>
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Nav list */}
            <nav aria-label="Mobile Primary" className="relative z-10 my-auto px-6 py-6 sm:px-10">
              <ul className="space-y-3.5 sm:space-y-4">
                {settings.nav.map((item, idx) => (
                  <li key={item.href} data-mobile-nav-item className="overflow-hidden">
                    <ContentLink
                      link={item}
                      className="group flex items-baseline gap-4 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-paper transition-colors hover:text-paper"
                    >
                      <span className="font-mono text-xs text-paper/40 font-normal">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{item.label}</span>
                    </ContentLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Drawer bottom: CTA + brand details */}
            <div
              data-mobile-nav-item
              className="relative z-10 space-y-6 border-t border-paper/10 px-6 pt-6 pb-8 sm:px-10"
            >
              <Button
                link={{ label: settings.navCta.label, href: '#footer' }}
                size="md"
                onClick={() => setMenuOpen(false)}
                className="w-full justify-center bg-paper text-ink font-bold hover:bg-paper/90"
              />

              <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-paper/60 uppercase">
                <span>KAMPALA, UGANDA</span>
                <span>TRUTH WELL TOLD</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
