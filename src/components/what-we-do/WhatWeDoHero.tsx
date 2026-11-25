import { useRef, type CSSProperties } from 'react';
import type { WhatWeDoPage } from '@/content/types';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, MOTIF_LAB, STAGGER } from '@/motion/tokens';
import {
  HEADER_MOTIF_CENTERS,
  HEADER_MOTIF_H,
  HEADER_MOTIF_PATHS,
  HEADER_MOTIF_VIEWBOX,
  HEADER_MOTIF_W,
} from './headerMotifPaths';

/**
 * What We Do hero banner. The doodle motif runs the same dual-SVG motion as the footer's
 * FooterMotifStage, with the same MOTIF_LAB tokens:
 * 1. Bloom: every doodle scales 0.9 -> 1 and fades in, delayed by its distance from the focal
 *    point (x 1.6s), while the base SVG peaks at 0.34 opacity and settles back to 0.14.
 * 2. Spotlight: a second copy (<use>) masked by a 240px radial gradient that follows the pointer.
 * Differences from the footer are only what the banner needs: the bloom plays as the page is entered
 * (after the first-visit loader) instead of on scroll-enter, and the lines are light grey on
 * charcoal instead of dark on crimson. Everything is clipped to the banner.
 */
export type WhatWeDoHeroProps = { hero: WhatWeDoPage['hero'] };

export function WhatWeDoHero({ hero }: WhatWeDoHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const baseSvgRef = useRef<SVGSVGElement | null>(null);
  const brightSvgRef = useRef<SVGSVGElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();
  // First visit: wait for the loader to clear. In-site navigation: play as soon as the page enters.
  const canPlay = isHeroReady;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const base = baseSvgRef.current;
      const bright = brightSvgRef.current;
      if (!section || !base || !bright || !canPlay) return;

      const lines = section.querySelectorAll<HTMLElement>('[data-hero-line]');
      const body = section.querySelectorAll<HTMLElement>('[data-hero-body]');
      const paths = Array.from(base.querySelectorAll<SVGPathElement>('#header-motif-pattern path'));

      // Radial distance from the focal point [W/2, H*0.55], as the footer computes it, but from
      // precomputed centres: no getBBox() layout reads while the page mounts.
      const focalX = HEADER_MOTIF_W / 2;
      const focalY = HEADER_MOTIF_H * 0.55;
      const maxDist = Math.hypot(HEADER_MOTIF_W, HEADER_MOTIF_H) / 2;
      const centerOf = (i: number) => HEADER_MOTIF_CENTERS[i] ?? [focalX, focalY];
      const distOf = (i: number) => {
        const [cx, cy] = centerOf(i);
        return Math.hypot(cx - focalX, cy - focalY) / maxDist;
      };

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.set(base, { opacity: MOTIF_LAB.restOpacity });
        gsap.fromTo([lines, body], { opacity: 0 }, { opacity: 1, duration: DUR.ui });
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;

          // --- Bloom (identical to FooterMotifStage) ---
          const st = gsap.timeline({ delay: skippedLoader ? 0.05 : 0 });
          st.set(base, { opacity: MOTIF_LAB.bloomPeakOpacity }, 0);
          st.from(
            paths,
            {
              opacity: 0,
              scale: 0.9,
              // Same visual as transformOrigin '50% 50%', without GSAP measuring each path.
              svgOrigin: (i: number) => centerOf(i).join(' '),
              duration: DUR.bloomPath,
              ease: EASE.out,
              delay: (i: number) => distOf(i) * MOTIF_LAB.bloomDistanceDelayFactor,
            },
            0,
          );
          st.to(
            base,
            { opacity: MOTIF_LAB.restOpacity, duration: DUR.bloomSettle, ease: EASE.SineInOut },
            MOTIF_LAB.bloomSettleDelay,
          );

          // --- Headline: masked line rise, body fades up ---
          st.fromTo(
            lines,
            { yPercent: 105 },
            { yPercent: 0, duration: DUR.hero, stagger: STAGGER.lines, ease: EASE.out },
            0.15,
          ).fromTo(
            body,
            { y: isMobile ? 12 : 24, opacity: 0 },
            { y: 0, opacity: 1, duration: DUR.text, stagger: STAGGER.lines, ease: EASE.out },
            0.5,
          );

          // --- Pointer spotlight (identical to FooterMotifStage) ---
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

  const brightMaskStyle: CSSProperties = {
    ['--x' as string]: 400,
    ['--y' as string]: 260,
    WebkitMaskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), black, transparent)`,
    maskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), black, transparent)`,
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="wwd-hero-heading"
      className="relative isolate flex min-h-[34rem] items-center overflow-hidden bg-wwd-ink pt-28 pb-20 text-paper sm:min-h-[38rem] lg:min-h-[42rem] lg:pt-32 [@media(orientation:landscape)_and_(max-height:540px)]:min-h-svh [@media(orientation:landscape)_and_(max-height:540px)]:pt-24 [@media(orientation:landscape)_and_(max-height:540px)]:pb-10"
    >
      {/* Soft vignette like the design: lighter charcoal centre, darker edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-wwd-glow"
      />

      {/* Base motif: hidden until the bloom starts (no flash under the loader) */}
      <svg
        ref={baseSvgRef}
        viewBox={HEADER_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-ash opacity-0"
      >
        <g id="header-motif-pattern" fill="currentColor" fillRule="evenodd">
          {HEADER_MOTIF_PATHS.map((d, idx) => (
            <path key={idx} d={d} />
          ))}
        </g>
      </svg>

      {/* Spotlight copy: masked 240px radial glow under the cursor */}
      <svg
        ref={brightSvgRef}
        viewBox={HEADER_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={brightMaskStyle}
        className="pointer-events-none absolute inset-0 h-full w-full text-paper opacity-0"
      >
        <use href="#header-motif-pattern" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 text-center sm:px-10">
        <h1
          id="wwd-hero-heading"
          className="font-display text-[clamp(2.1rem,4.3vw,5.2rem)] leading-[1.02] font-bold tracking-[-0.03em] text-paper"
        >
          {hero.headlineLines.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block text-balance will-change-transform">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="mx-auto mt-6 max-w-[62ch] text-[clamp(0.95rem,1.05vw,1.3rem)] leading-snug font-medium text-paper/90 sm:mt-7 lg:max-w-none">
          {hero.bodyLines.map((line) => (
            <span key={line} data-hero-body className="block sm:inline lg:block">
              {line}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
