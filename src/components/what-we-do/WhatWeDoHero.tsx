import { useRef, type CSSProperties } from 'react';
import type { WhatWeDoPage } from '@/content/types';
import { gsap } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { useMotifBloom } from '@/motion/useMotifBloom';
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

  useMotifBloom({
    sectionRef,
    baseRef: baseSvgRef,
    brightRef: brightSvgRef,
    patternSelector: '#header-motif-pattern',
    centers: HEADER_MOTIF_CENTERS,
    width: HEADER_MOTIF_W,
    height: HEADER_MOTIF_H,
    canPlay,
    skippedLoader,
    onReduced: () => {
      const section = sectionRef.current;
      if (!section) return;
      gsap.fromTo(
        section.querySelectorAll('[data-hero-line], [data-hero-body]'),
        { opacity: 0 },
        { opacity: 1, duration: DUR.ui },
      );
    },
    // Headline: masked line rise, body fades up.
    onTimeline: (tl, { isMobile }) => {
      const section = sectionRef.current;
      if (!section) return;
      const lines = section.querySelectorAll<HTMLElement>('[data-hero-line]');
      const body = section.querySelectorAll<HTMLElement>('[data-hero-body]');
      tl.fromTo(
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
    },
  });

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
        data-page-parallax
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
        data-page-parallax
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
