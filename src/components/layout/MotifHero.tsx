import { useRef, type CSSProperties } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, MOTIF_LAB, STAGGER } from '@/motion/tokens';

/** A vectorised doodle motif: one path per doodle plus its precomputed bounding-box centre. */
export type MotifData = {
  w: number;
  h: number;
  viewBox: string;
  paths: readonly string[];
  centers: readonly (readonly [number, number])[];
};

export type MotifHeroProps = {
  /** Unique per page: prefixes the heading id and the SVG pattern id. */
  id: string;
  motif: MotifData;
  /** Optional small line above the headline (e.g. "Corporate Social Responsibility"). */
  eyebrow?: string;
  headlineLines: readonly string[];
  bodyLines: readonly string[];
  /** Font size / spacing for the headline (the shared hero sets weight, colour and line masks). */
  headlineClassName?: string;
  /** Font size / weight / spacing for the body paragraph. */
  bodyClassName?: string;
  /** Banner min-heights per breakpoint. */
  heightClassName?: string;
};

/**
 * Charcoal page-header banner with an animated doodle motif (What We Do, CSR).
 * The motif runs the same dual-SVG motion as the footer's FooterMotifStage, with the same MOTIF_LAB tokens:
 * 1. Bloom: every doodle scales 0.9 -> 1 and fades in, delayed by its distance from the focal
 *    point (x 1.6s), while the base SVG peaks at 0.34 opacity and settles back to 0.14.
 * 2. Spotlight: a second copy (<use>) masked by a 240px radial gradient that follows the pointer.
 * Differences from the footer are only what the banner needs: the bloom plays as the page is entered
 * (after the first-visit loader) instead of on scroll-enter, and the lines are light grey on
 * charcoal instead of dark on crimson. Everything is clipped to the banner.
 */
export function MotifHero({
  id,
  motif,
  eyebrow,
  headlineLines,
  bodyLines,
  headlineClassName = 'text-[clamp(2.1rem,4.3vw,5.2rem)] leading-[1.02] tracking-[-0.03em]',
  bodyClassName = 'mt-6 max-w-[62ch] text-[clamp(0.95rem,1.05vw,1.3rem)] leading-snug font-medium sm:mt-7 lg:max-w-none',
  heightClassName = 'min-h-[34rem] sm:min-h-[38rem] lg:min-h-[42rem]',
}: MotifHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const baseSvgRef = useRef<SVGSVGElement | null>(null);
  const brightSvgRef = useRef<SVGSVGElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();
  // First visit: wait for the loader to clear. In-site navigation: play as soon as the page enters.
  const canPlay = isHeroReady;
  const headingId = `${id}-heading`;
  const patternId = `${id}-motif-pattern`;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const base = baseSvgRef.current;
      const bright = brightSvgRef.current;
      if (!section || !base || !bright || !canPlay) return;

      const lines = section.querySelectorAll<HTMLElement>('[data-hero-line]');
      const body = section.querySelectorAll<HTMLElement>('[data-hero-body]');
      const paths = Array.from(base.querySelectorAll<SVGPathElement>(`#${patternId} path`));

      // Radial distance from the focal point [W/2, H*0.55], as the footer computes it, but from
      // precomputed centres: no getBBox() layout reads while the page mounts.
      const focalX = motif.w / 2;
      const focalY = motif.h * 0.55;
      const maxDist = Math.hypot(motif.w, motif.h) / 2;
      const centerOf = (i: number) => motif.centers[i] ?? [focalX, focalY];
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
    { scope: sectionRef, dependencies: [canPlay, skippedLoader, motif, patternId] },
  );

  const brightMaskStyle: CSSProperties = {
    ['--x' as string]: 400,
    ['--y' as string]: 260,
    WebkitMaskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), #000, transparent)`,
    maskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), #000, transparent)`,
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className={`relative isolate flex ${heightClassName} items-center overflow-hidden bg-[#121312] pt-28 pb-20 text-paper lg:pt-32 [@media(orientation:landscape)_and_(max-height:540px)]:min-h-svh [@media(orientation:landscape)_and_(max-height:540px)]:pt-24 [@media(orientation:landscape)_and_(max-height:540px)]:pb-10`}
    >
      {/* Soft vignette like the design: lighter charcoal centre, darker edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,#2a2b2a_0%,#161716_55%,#0b0c0b_100%)]"
      />

      {/* Base motif: hidden until the bloom starts (no flash under the loader) */}
      <svg
        ref={baseSvgRef}
        viewBox={motif.viewBox}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-[#a3a5a4] opacity-0"
      >
        <g id={patternId} fill="currentColor" fillRule="evenodd">
          {motif.paths.map((d, idx) => (
            <path key={idx} d={d} />
          ))}
        </g>
      </svg>

      {/* Spotlight copy: masked 240px radial glow under the cursor */}
      <svg
        ref={brightSvgRef}
        viewBox={motif.viewBox}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={brightMaskStyle}
        className="pointer-events-none absolute inset-0 h-full w-full text-paper opacity-0"
      >
        <use href={`#${patternId}`} />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 text-center sm:px-10">
        {eyebrow && (
          <p className="mb-4 overflow-hidden pb-[0.08em] font-display text-[clamp(1.1rem,1.615vw,2.2rem)] leading-[1.1] font-medium tracking-[0.045em] text-paper sm:mb-5 lg:mb-[1.6vw]">
            <span data-hero-line className="block will-change-transform">
              {eyebrow}
            </span>
          </p>
        )}

        <h1
          id={headingId}
          className={`font-display font-bold text-paper ${headlineClassName}`}
        >
          {headlineLines.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block text-balance will-change-transform">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className={`mx-auto text-paper/90 ${bodyClassName}`}>
          {bodyLines.map((line) => (
            <span key={line} data-hero-body className="block sm:inline lg:block">
              {line}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
