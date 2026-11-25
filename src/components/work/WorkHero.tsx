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

export type WorkHeroProps = {
  hero: WorkPage['hero'];
};

/**
 * Our Work hero: the metallic crimson image with the doodle motif laid on as tone-on-tone strokes
 * (paper at MOTIF_LAB.restOpacity) so the metal's own lighting shows through. Motion matches
 * What We Do minus the bloom: the motif fades in and a cursor spotlight lights the doodles
 * (useMotifBloom with bloom off); the headline lines rise and the subheading fades up.
 */
export function WorkHero({ hero }: WorkHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const baseSvgRef = useRef<SVGSVGElement | null>(null);
  const brightSvgRef = useRef<SVGSVGElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useMotifBloom({
    sectionRef,
    baseRef: baseSvgRef,
    brightRef: brightSvgRef,
    bloom: false,
    restOpacity: WORK_HERO.motifOpacity,
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
  const svgClass = 'pointer-events-none absolute inset-0 h-full w-full';

  return (
    <section
      ref={sectionRef}
      aria-labelledby="work-hero-heading"
      className="relative isolate overflow-hidden bg-crimson-950 pt-36 pb-24 text-center text-paper md:pt-[14vw] md:pb-[9.3vw]"
    >
      <img
        src={heroBgSrc}
        alt=""
        width={1922}
        height={1674}
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_15%]"
      />

      {/* Motif: tone-on-tone paper strokes over the metal, hidden until the hero is ready (no flash under the loader). */}
      <svg
        ref={baseSvgRef}
        viewBox={WORK_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className={`${svgClass} text-paper opacity-0 mix-blend-soft-light`}
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
          className="mx-auto mt-6 max-w-[44rem] text-body font-medium md:mt-8"
        >
          {hero.subheading}
        </p>
      </div>
    </section>
  );
}
