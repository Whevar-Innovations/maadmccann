import { type RefObject } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { useLoaderState } from './LoaderProvider';
import { DIST, DUR, ENTRANCE, EASE, STAGGER } from './tokens';

export type UseHeroEntranceOptions = {
  /** Elements inside the scope to animate (CSS selector). */
  targets: string;
  /** `rise`: translate up + fade (staggered). `clip`: un-clip from the bottom. */
  kind?: 'rise' | 'clip';
  /** Seconds, added to the loader lead-in. */
  delay?: number;
  /** Skip the entrance (e.g. when another transition owns this moment). Evaluated when it runs. */
  skip?: () => boolean;
};

/**
 * Entrance for above-the-fold items that must not play under the first-visit loader. The hidden
 * start state is applied immediately (no flash), and the tween runs once the hero is ready.
 * Reduced motion: opacity fade only. Mobile halves the rise distance.
 */
export function useHeroEntrance(
  scopeRef: RefObject<HTMLElement | null>,
  { targets, kind = 'rise', delay = 0, skip }: UseHeroEntranceOptions,
) {
  const { isHeroReady, skippedLoader } = useLoaderState();

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;
      const items = scope.querySelectorAll<HTMLElement>(targets);
      if (items.length === 0 || skip?.()) return;
      const start = delay + (skippedLoader ? ENTRANCE.lead : 0);

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.set(items, { opacity: 0 });
        if (isHeroReady) gsap.to(items, { opacity: 1, duration: DUR.ui, ease: EASE.soft, delay: start });
      });

      mm.add({ motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile }, (context) => {
        const { motionOk, isMobile } = context.conditions ?? {};
        if (!motionOk) return;
        if (kind === 'clip') {
          gsap.set(items, { clipPath: ENTRANCE.clipFrom });
          if (isHeroReady) {
            gsap.to(items, {
              clipPath: ENTRANCE.clipTo,
              duration: DUR.media,
              ease: EASE.inOut,
              delay: start,
            });
          }
          return;
        }
        gsap.set(items, { y: isMobile ? DIST.rise / 2 : DIST.rise, opacity: 0 });
        if (isHeroReady) {
          gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: DUR.text,
            ease: EASE.out,
            stagger: STAGGER.items,
            delay: start,
          });
        }
      });
    },
    { scope: scopeRef, dependencies: [isHeroReady, skippedLoader] },
  );
}
