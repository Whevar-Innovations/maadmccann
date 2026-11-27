import { useRef, type CSSProperties } from 'react';
import { gsap } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { useMotifBloom } from '@/motion/useMotifBloom';
import { DIST, DUR, EASE, MOTIF_LAB, STAGGER } from '@/motion/tokens';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';

/** A traced motif: one evenodd path per doodle, plus each doodle's centre (for the bloom). */
export type HeroMotif = {
  /** Unique per page: the base SVG's pattern group id, reused by the spotlight copy. */
  patternId: string;
  paths: readonly string[];
  centers: readonly (readonly [number, number])[];
  width: number;
  height: number;
  viewBox: string;
};

export type MotifHeroProps = {
  /** id of the <h1>, for the section's aria-labelledby. */
  headingId: string;
  headlineLines: string[];
  subheading: string;
  motif: HeroMotif;
  /** Per-doodle bloom from the focal point (What We Do style), or a plain fade-in. */
  bloom: boolean;
  /** Resting opacity of the soft-light motif strokes. */
  restOpacity: number;
  /** Extra delay before the subheading rises, after the headline lines. */
  subDelay: number;
  /**
   * `crimson` (default): the metallic crimson image, motif as soft-light paper strokes.
   * `ink`: near-black ground, motif as plain paper strokes at `restOpacity` (Contact Us).
   */
  surface?: 'crimson' | 'ink';
};

/**
 * Banner hero on the metallic crimson image with a page's doodle motif laid on as tone-on-tone
 * strokes (soft-light paper), so the metal's own lighting shows through (or, on the `ink` surface, as plain strokes on near-black). Used by Our Work,
 * Our Partners, Blog and Contact Us. Motion: the motif blooms or fades in (useMotifBloom) with a cursor spotlight on
 * fine pointers; the headline lines rise and the subheading follows. The motif SVGs carry
 * data-page-parallax, so they settle last when the page slides in.
 */
export function MotifHero({
  headingId,
  headlineLines,
  subheading,
  motif,
  bloom,
  restOpacity,
  subDelay,
  surface = 'crimson',
}: MotifHeroProps) {
  const isInk = surface === 'ink';
  const sectionRef = useRef<HTMLElement | null>(null);
  const baseSvgRef = useRef<SVGSVGElement | null>(null);
  const brightSvgRef = useRef<SVGSVGElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useMotifBloom({
    sectionRef,
    baseRef: baseSvgRef,
    brightRef: brightSvgRef,
    bloom,
    restOpacity,
    patternSelector: `#${motif.patternId}`,
    centers: motif.centers,
    width: motif.width,
    height: motif.height,
    canPlay: isHeroReady,
    skippedLoader,
    onReduced: () => {
      const section = sectionRef.current;
      if (!section) return;
      gsap.fromTo(
        section.querySelectorAll('[data-hero-line], [data-hero-sub]'),
        { opacity: 0 },
        { opacity: 1, duration: DUR.ui, ease: EASE.soft },
      );
    },
    onTimeline: (tl, { isMobile }) => {
      const section = sectionRef.current;
      if (!section) return;
      const lines = section.querySelectorAll<HTMLElement>('[data-hero-line]');
      const sub = section.querySelector<HTMLElement>('[data-hero-sub]');
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
          0.15 + subDelay + STAGGER.lines * lines.length,
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
      aria-labelledby={headingId}
      className={`relative isolate overflow-hidden pt-36 pb-24 text-center text-paper md:pt-[14vw] md:pb-[9.3vw] ${isInk ? 'bg-ink' : 'bg-crimson-950'}`}
    >
      {isInk ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink-glow" />
      ) : (
        <img
          src={heroBgSrc}
          alt=""
          width={1922}
          height={1674}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_15%]"
        />
      )}

      {/* Motif: tone-on-tone paper strokes over the metal (or plain strokes on ink), hidden until the hero is ready (no flash under the loader). */}
      <svg
        ref={baseSvgRef}
        data-page-parallax
        viewBox={motif.viewBox}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className={`${svgClass} text-paper opacity-0 ${isInk ? '' : 'mix-blend-soft-light'}`}
      >
        <g id={motif.patternId} fillRule="evenodd" fill="currentColor">
          {motif.paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>

      {/* Spotlight copy: masked radial glow under the cursor. */}
      <svg
        ref={brightSvgRef}
        data-page-parallax
        viewBox={motif.viewBox}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={brightMaskStyle}
        className={`${svgClass} opacity-0 ${isInk ? 'text-paper' : 'text-blush'}`}
      >
        <use href={`#${motif.patternId}`} />
      </svg>

      <div className="container-site relative z-10">
        <h1 id={headingId} className="font-display text-banner font-bold tracking-display">
          {headlineLines.map((line) => (
            <span key={line} data-hero-line className="block">
              {line}
            </span>
          ))}
        </h1>
        <p data-hero-sub className="mx-auto mt-6 max-w-[clamp(50rem,41.6667vw,66.6667rem)] text-sub font-medium md:mt-8">
          {subheading}
        </p>
      </div>
    </section>
  );
}
