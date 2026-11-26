import { type RefObject } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { DUR, EASE, MOTIF_LAB } from './tokens';

export type UseMotifBloomOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  /** The visible motif <svg>; its `path` children (inside `patternSelector`) are the doodles. */
  baseRef: RefObject<SVGSVGElement | null>;
  /** The spotlight <svg>: a second copy masked by a radial gradient that follows the pointer. */
  brightRef: RefObject<SVGSVGElement | null>;
  patternSelector: string;
  /** Centre [x, y] of each doodle (precomputed) and the artwork size they are measured in. */
  centers: readonly (readonly [number, number])[];
  width: number;
  height: number;
  /** Start once true (the first-visit loader is done). */
  canPlay: boolean;
  skippedLoader: boolean;
  /** Per-doodle bloom + settle (default). Off: the base just fades in and only the spotlight remains. */
  bloom?: boolean;
  /** Resting opacity of the base layer (default MOTIF_LAB.restOpacity). */
  restOpacity?: number;
  /** Add the page's own tweens (headline, body) to the same timeline. */
  onTimeline?: (tl: gsap.core.Timeline, ctx: { isMobile: boolean }) => void;
  /** Reduced-motion fallback for the page's own elements. */
  onReduced?: () => void;
};

/**
 * Shared motif choreography (matches FooterMotifStage):
 * 1. Bloom (optional): every doodle scales 0.9 to 1 and fades in, delayed by its distance from the focal
 *    point, while the base peaks at MOTIF_LAB.bloomPeakOpacity and settles to restOpacity.
 * 2. Spotlight: the bright copy, masked by a radial gradient, follows the pointer (fine pointers only).
 */
export function useMotifBloom({
  sectionRef,
  baseRef,
  brightRef,
  patternSelector,
  centers,
  width,
  height,
  canPlay,
  skippedLoader,
  bloom = true,
  restOpacity = MOTIF_LAB.restOpacity,
  onTimeline,
  onReduced,
}: UseMotifBloomOptions) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const base = baseRef.current;
      const bright = brightRef.current;
      if (!section || !base || !bright || !canPlay) return;

      const paths = Array.from(base.querySelectorAll<SVGPathElement>(`${patternSelector} path`));
      const focalX = width / 2;
      const focalY = height * 0.55;
      const maxDist = Math.hypot(width, height) / 2;
      const centerOf = (i: number) => centers[i] ?? [focalX, focalY];
      const distOf = (i: number) => {
        const [cx, cy] = centerOf(i);
        return Math.hypot(cx - focalX, cy - focalY) / maxDist;
      };
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.set(base, { opacity: restOpacity });
        onReduced?.();
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile, fine: MEDIA_QUERIES.finePointer },
        (context) => {
          const { motionOk, isMobile, fine } = context.conditions ?? {};
          if (!motionOk) return;

          const tl = gsap.timeline({ delay: skippedLoader ? 0.05 : 0 });
          if (bloom) {
            tl.set(base, { opacity: MOTIF_LAB.bloomPeakOpacity }, 0);
            tl.from(
              paths,
              {
                opacity: 0,
                scale: 0.9,
                svgOrigin: (i: number) => centerOf(i).join(' '),
                duration: DUR.bloomPath,
                ease: EASE.out,
                delay: (i: number) => distOf(i) * MOTIF_LAB.bloomDistanceDelayFactor,
              },
              0,
            );
            tl.to(
              base,
              { opacity: restOpacity, duration: DUR.bloomSettle, ease: EASE.SineInOut },
              MOTIF_LAB.bloomSettleDelay,
            );
          } else {
            tl.to(base, { opacity: restOpacity, duration: DUR.heroMotif, ease: EASE.soft }, 0);
          }
          onTimeline?.(tl, { isMobile: !!isMobile });

          if (!fine) return undefined;

          const mx = gsap.quickTo(bright, '--x', { duration: DUR.spotlight, ease: EASE.soft });
          const my = gsap.quickTo(bright, '--y', { duration: DUR.spotlight, ease: EASE.soft });
          const onPointerMove = (e: PointerEvent) => {
            const r = section.getBoundingClientRect();
            mx(e.clientX - r.left);
            my(e.clientY - r.top);
          };
          const onPointerEnter = (e: PointerEvent) => {
            const r = section.getBoundingClientRect();
            gsap.set(bright, { '--x': e.clientX - r.left, '--y': e.clientY - r.top });
            gsap.to(bright, { opacity: MOTIF_LAB.spotOpacity, duration: DUR.ui, ease: EASE.soft });
          };
          const onPointerLeave = () => {
            gsap.to(bright, { opacity: 0, duration: DUR.ui, ease: EASE.soft });
          };
          section.addEventListener('pointermove', onPointerMove);
          section.addEventListener('pointerenter', onPointerEnter);
          section.addEventListener('pointerleave', onPointerLeave);
          return () => {
            section.removeEventListener('pointermove', onPointerMove);
            section.removeEventListener('pointerenter', onPointerEnter);
            section.removeEventListener('pointerleave', onPointerLeave);
          };
        },
      );
    },
    { scope: sectionRef, dependencies: [canPlay, skippedLoader] },
  );
}
