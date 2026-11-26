import type { RefObject } from 'react';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { DUR, EASE, SCROLL } from '@/motion/tokens';

/**
 * Scroll entrance for the CSR campaign panels, matching the What We Do ServiceCard motion:
 * 1. The panel rises and un-clips upward from its bottom edge.
 * 2. `[data-pop]` children (campaign logos) scale in with a soft overshoot.
 * 3. `[data-reveal]` children rise and fade in, staggered, as they scroll into view.
 * 4. `[data-poster]` frames wipe open from the top while their `[data-poster-img]` settles from a slight zoom.
 * Reduced motion: plain fade.
 */
export function usePanelReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const panel = ref.current;
      if (!panel) return;
      const reveals = panel.querySelectorAll<HTMLElement>('[data-reveal]');
      const pops = panel.querySelectorAll<HTMLElement>('[data-pop]');
      const posters = panel.querySelectorAll<HTMLElement>('[data-poster]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          panel,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            scrollTrigger: { trigger: panel, start: SCROLL.start, once: true },
          },
        );
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;
          const k = isMobile ? 0.5 : 1;

          gsap.fromTo(
            panel,
            { y: 56 * k, opacity: 0, clipPath: 'inset(12% 0% 0% 0%)' },
            {
              y: 0,
              opacity: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              ease: EASE.out,
              clearProps: 'clipPath',
              scrollTrigger: { trigger: panel, start: 'top 88%', once: true },
            },
          );

          // Inner content reveals as each block actually scrolls into view (panels stack tall on
          // phones), batched so neighbours that enter together still stagger.
          const batches: ScrollTrigger[] = [];
          if (pops.length) {
            gsap.set(pops, { scale: 0.85, opacity: 0 });
            batches.push(
              ...ScrollTrigger.batch(pops, {
                start: 'top 92%',
                once: true,
                onEnter: (els) =>
                  gsap.to(els, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.9,
                    delay: 0.25,
                    ease: EASE.pop,
                  }),
              }),
            );
          }
          if (reveals.length) {
            gsap.set(reveals, { y: 26 * k, opacity: 0 });
            batches.push(
              ...ScrollTrigger.batch(reveals, {
                start: 'top 92%',
                once: true,
                onEnter: (els) =>
                  gsap.to(els, {
                    y: 0,
                    opacity: 1,
                    duration: DUR.text,
                    stagger: 0.07,
                    delay: 0.3,
                    ease: EASE.out,
                  }),
              }),
            );
          }
          posters.forEach((frame) => {
            const image = frame.querySelector<HTMLElement>('[data-poster-img]');
            const tl = gsap.timeline({
              delay: 0.2,
              scrollTrigger: { trigger: frame, start: 'top 90%', once: true },
            });
            tl.fromTo(
              frame,
              { clipPath: 'inset(0% 0% 100% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: DUR.heroBg * 0.75,
                ease: EASE.inOut,
                clearProps: 'clipPath',
              },
              0,
            );
            if (image) {
              tl.fromTo(
                image,
                { scale: 1.12 },
                { scale: 1, duration: DUR.heroBg, ease: EASE.out, clearProps: 'transform' },
                0,
              );
            }
          });
          return () => batches.forEach((b) => b.kill());
        },
      );
    },
    { scope: ref },
  );
}
