import { useRef, type CSSProperties } from 'react';
import type { WorkPage } from '@/content/types';
import { gsap } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { useMotifBloom } from '@/motion/useMotifBloom';
import { DIST, DUR, EASE, MOTIF_LAB, STAGGER, WORK_HERO } from '@/motion/tokens';
import {
  WORK_MOTIF_CENTERS,
  WORK_MOTIF_H,
  WORK_MOTIF_PATHS,
  WORK_MOTIF_VIEWBOX,
  WORK_MOTIF_W,
} from './workMotifPaths';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';

/** How much of the dark copy shows through: enough for a soft edge, not a second pattern. */
const SHADOW_STRENGTH = 0.2;

export type WorkHeroProps = {
  hero: WorkPage['hero'];
};

/**
 * Our Work hero: metallic crimson with depth. The doodle motif is embossed twice: a dark copy
 * multiplied into the metal (the shadow) and a light copy on top (the raised edge), under a
 * vignette that darkens the corners. It runs the shared bloom + pointer spotlight
 * (useMotifBloom) after the first-visit loader, then the headline lines rise and the
 * subheading fades up.
 */
export function WorkHero({ hero }: WorkHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shadowSvgRef = useRef<SVGSVGElement | null>(null);
  const baseSvgRef = useRef<SVGSVGElement | null>(null);
  const brightSvgRef = useRef<SVGSVGElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useMotifBloom({
    sectionRef,
    baseRef: baseSvgRef,
    brightRef: brightSvgRef,
    alsoBloom: [shadowSvgRef],
    patternSelector: '#work-motif-pattern',
    centers: WORK_MOTIF_CENTERS,
    width: WORK_MOTIF_W,
    height: WORK_MOTIF_H,
    canPlay: isHeroReady,
    skippedLoader,
    onReduced: () => {
      const section = sectionRef.current;
      if (!section) return;
      gsap.fromTo(
        section.querySelectorAll('[data-work-line], [data-work-sub]'),
        { opacity: 0 },
        { opacity: 1, duration: DUR.ui, ease: EASE.soft },
      );
    },
    onTimeline: (tl, { isMobile }) => {
      const section = sectionRef.current;
      if (!section) return;
      const lines = section.querySelectorAll<HTMLElement>('[data-work-line]');
      const sub = section.querySelector<HTMLElement>('[data-work-sub]');
      const dist = isMobile ? DIST.rise / 2 : DIST.rise;
      tl.fromTo(
        lines,
        { y: dist, opacity: 0 },
        { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out, stagger: STAGGER.lines },
        0.15,
      );
      if (sub) {
        tl.fromTo(
          sub,
          { y: dist, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out },
          0.15 + WORK_HERO.subDelay + STAGGER.lines * lines.length,
        );
      }
    },
  });

  const brightMaskStyle: CSSProperties = {
    ['--x' as string]: 400,
    ['--y' as string]: 260,
    WebkitMaskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), black, transparent)`,
    maskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), black, transparent)`,
  };
  const pattern = (
    <g fillRule="evenodd" fill="currentColor" opacity={SHADOW_STRENGTH}>
      {WORK_MOTIF_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
  const svgClass = 'pointer-events-none absolute inset-0 h-full w-full';

  return (
    <section
      ref={sectionRef}
      aria-labelledby="work-hero-heading"
      className="relative isolate overflow-hidden bg-crimson-950 pt-36 pb-24 text-center text-paper md:pt-44 md:pb-32 lg:pt-52 lg:pb-36"
    >
      <img
        src={heroBgSrc}
        alt=""
        width={1922}
        height={1674}
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Depth shadow: the motif in dark crimson, multiplied into the metal, nudged down-right. */}
      <svg
        ref={shadowSvgRef}
        viewBox={WORK_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ translate: '0.25% 0.5%' }}
        className={`${svgClass} text-crimson-800 opacity-0 mix-blend-multiply`}
      >
        {pattern}
      </svg>

      {/* Raised edge: the motif in paper, hidden until the bloom starts (no flash under the loader). */}
      <svg
        ref={baseSvgRef}
        viewBox={WORK_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className={`${svgClass} text-paper opacity-0`}
      >
        <g id="work-motif-pattern" fillRule="evenodd" fill="currentColor">
          {WORK_MOTIF_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>

      {/* Spotlight copy: masked radial glow under the cursor. */}
      <svg
        ref={brightSvgRef}
        viewBox={WORK_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={brightMaskStyle}
        className={`${svgClass} text-blush opacity-0`}
      >
        <use href="#work-motif-pattern" />
      </svg>

      {/* Vignette: darker corners and bottom edge give the metal its depth. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-work-vignette" />

      <div className="container-site relative z-10">
        <h1 id="work-hero-heading" className="font-display text-cta font-bold tracking-display">
          {hero.headlineLines.map((line) => (
            <span key={line} data-work-line className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          data-work-sub
          className="mx-auto mt-6 max-w-[52ch] text-body font-medium text-balance md:mt-8"
        >
          {hero.subheading}
        </p>
      </div>
    </section>
  );
}
