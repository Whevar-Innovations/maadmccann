import { useRef, type RefObject } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { DUR, EASE, REVEAL } from './tokens';

export type UseFallInOptions = {
  /** Extra delay so tiles entering together land in reading order. */
  delay?: number;
  /** Selector (inside the element) for caption pieces that fade up after landing. */
  captionSelector?: string;
};

/**
 * "Fall into grid" entry (matches befreaky.co): the tile scales up from ~0.72
 * while fading in and rising slightly, settling into its slot, then its caption rises in. Returns a ref that is
 * true once the tile has landed (used to gate hover effects).
 */
export function useFallIn<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { delay = 0, captionSelector }: UseFallInOptions = {},
) {
  const landedRef = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const captions = captionSelector
        ? Array.from(el.querySelectorAll(captionSelector))
        : [];
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        landedRef.current = true;
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isDesktop: MEDIA_QUERIES.desktop },
        (context) => {
          const { motionOk, isDesktop } = context.conditions ?? {};
          if (!motionOk) return;
          landedRef.current = false;

          gsap.set(el, {
            y: isDesktop ? REVEAL.fallY : REVEAL.fallYMobile,
            scale: REVEAL.fallScale,
            opacity: 0,
            transformOrigin: '50% 60%',
          });
          gsap.set(captions, { y: 18, opacity: 0 });

          const tl = gsap.timeline({
            delay,
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
            onComplete: () => {
              landedRef.current = true;
              gsap.set(el, { clearProps: 'transform,opacity' });
            },
          });
          tl.to(el, {
            y: 0,
            scale: 1,
            duration: REVEAL.fallDuration,
            ease: EASE.out,
          }).to(
            el,
            { opacity: 1, duration: REVEAL.fallDuration * 0.45, ease: EASE.soft },
            0,
          );
          if (captions.length) {
            tl.to(
              captions,
              { y: 0, opacity: 1, duration: DUR.text * 0.7, ease: EASE.out, stagger: 0.12 },
              REVEAL.fallCaptionDelay + 0.4,
            );
          }
        },
      );
    },
    { scope: ref, dependencies: [delay, captionSelector] },
  );

  return landedRef;
}
