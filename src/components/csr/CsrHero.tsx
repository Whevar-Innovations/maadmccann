import { useRef, type CSSProperties } from 'react';
import type { CsrPage } from '@/content/types';
import { gsap } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { useMotifBloom } from '@/motion/useMotifBloom';
import { DUR, EASE, MOTIF_LAB, STAGGER } from '@/motion/tokens';
import {
  CSR_MOTIF_CENTERS,
  CSR_MOTIF_H,
  CSR_MOTIF_PATHS,
  CSR_MOTIF_VIEWBOX,
  CSR_MOTIF_W,
} from './csrMotifPaths';

export type CsrHeroProps = { hero: CsrPage['hero'] };

/**
 * CSR hero banner: the What We Do treatment (charcoal glow, ash doodles) with the CSR motif.
 * Motion via useMotifBloom, as on What We Do: the doodles bloom out from the focal point and settle,
 * a cursor spotlight lights them on fine pointers, then the eyebrow and headline rise out of masks
 * and the body fades up. The motif SVGs carry data-page-parallax so they settle last on page entry.
 */
export function CsrHero({ hero }: CsrHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const baseSvgRef = useRef<SVGSVGElement | null>(null);
  const brightSvgRef = useRef<SVGSVGElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useMotifBloom({
    sectionRef,
    baseRef: baseSvgRef,
    brightRef: brightSvgRef,
    patternSelector: '#csr-motif-pattern',
    centers: CSR_MOTIF_CENTERS,
    width: CSR_MOTIF_W,
    height: CSR_MOTIF_H,
    canPlay: isHeroReady,
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
      aria-labelledby="csr-hero-heading"
      className="relative isolate flex min-h-[30rem] items-center overflow-hidden bg-wwd-ink pt-28 pb-20 text-paper sm:min-h-[34rem] lg:min-h-[max(35.2vw,26rem)] lg:pt-32 [@media(orientation:landscape)_and_(max-height:540px)]:min-h-svh [@media(orientation:landscape)_and_(max-height:540px)]:pt-24 [@media(orientation:landscape)_and_(max-height:540px)]:pb-10"
    >
      {/* Soft vignette like the design: lighter charcoal centre, darker edges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-wwd-glow" />

      {/* Base motif: hidden until the bloom starts (no flash under the loader) */}
      <svg
        ref={baseSvgRef}
        data-page-parallax
        viewBox={CSR_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-ash opacity-0"
      >
        <g id="csr-motif-pattern" fill="currentColor" fillRule="evenodd">
          {CSR_MOTIF_PATHS.map((d, idx) => (
            <path key={idx} d={d} />
          ))}
        </g>
      </svg>

      {/* Spotlight copy: masked radial glow under the cursor */}
      <svg
        ref={brightSvgRef}
        data-page-parallax
        viewBox={CSR_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={brightMaskStyle}
        className="pointer-events-none absolute inset-0 h-full w-full text-paper opacity-0"
      >
        <use href="#csr-motif-pattern" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 text-center sm:px-10">
        <p className="mb-4 overflow-hidden pb-[0.08em] font-display text-[clamp(1.1rem,1.615vw,2.2rem)] leading-[1.1] font-medium tracking-[0.045em] text-paper sm:mb-5 lg:mb-[1.6vw]">
          <span data-hero-line className="block will-change-transform">
            {hero.eyebrow}
          </span>
        </p>

        <h1
          id="csr-hero-heading"
          className="font-display text-[clamp(2.1rem,3.65vw,5.05rem)] leading-[1.05] font-bold tracking-[-0.01em] text-paper"
        >
          {hero.headlineLines.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block text-balance will-change-transform">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="mx-auto mt-5 max-w-[62ch] text-[clamp(0.95rem,1.2vw,1.65rem)] leading-[1.45] font-semibold text-paper/90 sm:mt-6 lg:mt-[1.1vw] lg:max-w-none">
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
