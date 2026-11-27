import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { BACK_TO_TOP, DIST, DUR, EASE } from '@/motion/tokens';

/**
 * Site-wide "back to top" button.
 * - Fixed bottom-right, portaled to document.body so no transformed page wrapper affects it.
 * - Hidden (autoAlpha 0, out of the tab order) until the page has scrolled past one viewport,
 *   then rises in. Reduced motion: plain opacity fade.
 * - Scrolls through Lenis (instant under reduced motion), then moves focus to #main so keyboard
 *   users continue from the top of the page.
 */
export function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { scrollToTop } = useSmoothScroll();

  useGSAP(
    () => {
      const el = buttonRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      // matchMedia only runs this callback while at least one condition matches, so list both
      // motion states: one of them is always true.
      mm.add(
        {
          reduced: MEDIA_QUERIES.reducedMotion,
          motionOk: MEDIA_QUERIES.motionOk,
          mobile: MEDIA_QUERIES.mobile,
        },
        (context) => {
          const { reduced, mobile } = context.conditions ?? {};
          const hiddenY = reduced ? 0 : DIST.rise * (mobile ? 0.5 : 1);

          gsap.set(el, { autoAlpha: 0, y: hiddenY });

          ScrollTrigger.create({
            start: () => window.innerHeight * BACK_TO_TOP.showAfterVh,
            end: 'max',
            onToggle: (self) => {
              gsap.to(el, {
                autoAlpha: self.isActive ? 1 : 0,
                y: self.isActive ? 0 : hiddenY,
                duration: DUR.ui,
                ease: EASE.soft,
                overwrite: true,
              });
            },
          });
        },
      );
    },
    { scope: buttonRef },
  );

  const handleClick = () => {
    const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;
    scrollToTop({ smooth: !reduced });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return createPortal(
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className="invisible fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-30 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-crimson-950/90 text-paper opacity-0 shadow-pill ring-1 ring-paper/25 transition-colors duration-300 hover:bg-paper hover:text-crimson-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-impact-red md:right-8 md:bottom-8 md:h-14 md:w-14"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-none stroke-current md:h-6 md:w-6"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>,
    document.body,
  );
}
