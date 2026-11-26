import { useRef, type ReactNode } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { DUR, EASE, REVEAL, SCROLL } from './tokens';

export type RevealImageProps = {
  children: ReactNode;
  parallax?: boolean;
  /** Skip the inner 1.06 -> 1 entry zoom so the image never shows cropped at rest. */
  noScale?: boolean;
  className?: string;
  innerClassName?: string;
  /** Marks the wrapper as the shared element of a tile-to-page transition (see PageTransition). */
  sharedImage?: boolean;
};

/**
 * <RevealImage> primitive (SPEC §8.5).
 * Wrapper clip-path: inset(10% 0 0 0) -> inset(0) and opacity 0 -> 1 (1.2s),
 * inner image scale 1.15 -> 1 (1.6s).
 * Optional `parallax` prop adds a scrubbed image drift of yPercent -8 -> 8 on desktop.
 */
export function RevealImage({
  children,
  parallax = false,
  noScale = false,
  className = '',
  innerClassName = '',
  sharedImage = false,
}: RevealImageProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);
  const driftRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const scaleEl = scaleRef.current;
      const driftEl = driftRef.current;
      if (!wrap || !scaleEl || !driftEl) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          wrap,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            ease: EASE.soft,
            scrollTrigger: {
              trigger: wrap,
              start: SCROLL.start,
              once: true,
            },
          },
        );
      });

      mm.add(
        {
          motionOk: MEDIA_QUERIES.motionOk,
          isDesktop: MEDIA_QUERIES.desktop,
        },
        (context) => {
          const { motionOk, isDesktop } = context.conditions ?? {};
          if (!motionOk) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrap,
              start: SCROLL.start,
              once: true,
            },
          });

          tl.fromTo(
            wrap,
            {
              clipPath: 'inset(10% 0% 0% 0%)',
              opacity: 0,
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: REVEAL.imageClipDuration,
              ease: EASE.out,
            },
            0,
          );

          if (!noScale) {
            tl.fromTo(
              scaleEl,
              { scale: REVEAL.imageScaleFrom },
              {
                scale: 1,
                duration: REVEAL.imageScaleDuration,
                ease: EASE.out,
              },
              0,
            );
          }

          if (parallax && isDesktop) {
            gsap.fromTo(
              driftEl,
              { yPercent: -REVEAL.parallaxPercent },
              {
                yPercent: REVEAL.parallaxPercent,
                ease: EASE.linear,
                scrollTrigger: {
                  trigger: wrap,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );
          }
        },
      );
    },
    { scope: wrapRef, dependencies: [parallax, noScale] },
  );

  return (
    <div
      ref={wrapRef}
      data-shared-image={sharedImage ? '' : undefined}
      className={`overflow-hidden will-change-[clip-path,opacity] ${className}`.trim()}
    >
      <div
        ref={scaleRef}
        className={`h-full w-full will-change-transform ${innerClassName}`.trim()}
      >
        <div
          ref={driftRef}
          className={`h-full w-full will-change-transform ${
            parallax ? 'md:scale-[1.06]' : ''
          }`.trim()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
