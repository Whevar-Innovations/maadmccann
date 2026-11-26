import { useRef } from 'react';
import type { HomePage } from '@/content/types';
import { Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DIST, DUR, EASE, HERO_TIMELINE, STAGGER } from '@/motion/tokens';
import { AwardsTriangleLoop } from './AwardsTriangleLoop';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';

export type HeroProps = {
  hero: HomePage['hero'];
};

// Exact upright-A (#mA) and inverted-A (#mV) paths from `MAAD McCANN_ footer motif motion lab.html`
const MOTIF_A_PATH =
  'M 1496.82,936.11 L 1642.12,936.11 L 1734.46,722.38 L 2111.16,722.38 L 2209.2,936.11 L 2352.24,936.11 L 1916.82,0.88 L 1496.82,936.11 M 1788.61,597.57 L 1919.1,298.38 L 2055.88,597.57 L 1788.61,597.57';
const MOTIF_V_PATH =
  'M 1617.21,212.42 L 1240.48,212.42 L 1142.47,-1.31 L 999.43,-1.31 L 1434.85,933.89 L 1854.88,-1.31 L 1709.53,-1.31 L 1617.21,212.42 M 1563.08,337.21 L 1432.56,636.43 L 1295.78,337.21 L 1563.08,337.21';

/**
 * Hero section (SPEC §7 #2, §8.3, §8.4, matching Screenshot From 2026-11-18 14-54-05.png).
 * Zero-FOUC background motif: initial JSX has fillOpacity={0} and strokeOpacity={0}
 * so the motif never flashes on refresh before GSAP takes control.
 */
export function Hero({ hero }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !isHeroReady) return;

      const bg = section.querySelector<HTMLElement>('[data-hero-bg]');
      const motifA = section.querySelector<SVGPathElement>('#mA');
      const motifV = section.querySelector<SVGPathElement>('#mV');
      const lines = section.querySelectorAll<HTMLElement>('[data-hero-line]');
      const ghost = section.querySelector<HTMLElement>('[data-hero-ghost]');
      const subheading = section.querySelector<HTMLElement>('[data-hero-subheading]');
      const cta = section.querySelector<HTMLElement>('[data-hero-cta]');
      const headerItems = document.querySelectorAll<HTMLElement>('[data-header-item]');

      const trophyEntrances =
        section.querySelectorAll<HTMLElement>('[data-trophy-entrance]');
      const trophyParallaxes =
        section.querySelectorAll<HTMLElement>('[data-trophy-parallax]');
      const trophyFloats =
        section.querySelectorAll<HTMLElement>('[data-trophy-float]');
      const trophyShadows =
        section.querySelectorAll<HTMLElement>('[data-trophy-shadow]');
      const glow = section.querySelector<HTMLElement>('[data-trophies-glow]');

      // Rest position of the ghost text (owned by GSAP; the element must be block-level to transform).
      if (ghost) gsap.set(ghost, { yPercent: 0 });

      const mm = gsap.matchMedia();

      // Reduced motion: immediate resting state, no loops or parallax (SPEC §8.9)
      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        if (motifA && motifV) {
          gsap.set([motifA, motifV], {
            fillOpacity: 0.36,
            strokeOpacity: 0,
            x: 0,
            y: 0,
          });
        }
        gsap.fromTo(
          [lines, subheading, cta, trophyEntrances, ghost],
          { opacity: 0 },
          { opacity: 1, duration: DUR.ui, ease: EASE.soft },
        );
      });

      // Normal motion: Master Hero Timeline or Refresh Settle
      mm.add(
        {
          isDesktop: MEDIA_QUERIES.desktop,
          isMobile: MEDIA_QUERIES.mobile,
          isFinePointer: MEDIA_QUERIES.finePointer,
          motionOk: MEDIA_QUERIES.motionOk,
        },
        (context) => {
          const { isMobile, isFinePointer, motionOk } = context.conditions ?? {};
          if (!motionOk) return;

          const distFactor = isMobile ? 0.5 : 1;

          // Helper to trigger natural idle loops
          const startIdleLoops = () => {
            trophyFloats.forEach((floatEl, index) => {
              const dur = HERO_TIMELINE.trophyFloatDurs[index] ?? 3.8;
              const delay = HERO_TIMELINE.trophyFloatDelays[index] ?? 0;

              gsap.to(floatEl, {
                y: HERO_TIMELINE.trophyFloatY * distFactor,
                duration: dur,
                delay,
                ease: EASE.float,
                yoyo: true,
                repeat: -1,
              });

              const shadowEl = trophyShadows[index];
              if (shadowEl && !isMobile) {
                gsap.to(shadowEl, {
                  scaleX: 0.93,
                  opacity: 0.55,
                  duration: dur,
                  delay,
                  ease: EASE.float,
                  yoyo: true,
                  repeat: -1,
                });
              }
            });

            if (isMobile) return;

            // Motif #mA and #mV opposing slow float (Motion Lab line 64)
            if (motifA && motifV) {
              gsap.to(motifA, {
                y: -HERO_TIMELINE.motifFloatY,
                duration: HERO_TIMELINE.motifFloatDurs[0],
                ease: EASE.float,
                yoyo: true,
                repeat: -1,
              });
              gsap.to(motifV, {
                y: HERO_TIMELINE.motifFloatY,
                duration: HERO_TIMELINE.motifFloatDurs[1],
                ease: EASE.float,
                yoyo: true,
                repeat: -1,
              });
            }

            // Gold glow pulse (opacity 0.55 <-> 0.85 over 5s)
            if (glow) {
              gsap.fromTo(
                glow,
                { opacity: 0.55 },
                {
                  opacity: 0.85,
                  duration: HERO_TIMELINE.glowDur,
                  ease: EASE.float,
                  yoyo: true,
                  repeat: -1,
                },
              );
            }
          };

          // Full entrance choreography plays on every load. When the loader was skipped
          // (already shown this session) there is no panel wipe, so use a short lead-in.
          {
            // --- FIRST VISIT SCENARIO (plays timed with loader exit) ---
            const tl = gsap.timeline({
              defaults: { ease: EASE.out },
              delay: skippedLoader ? HERO_TIMELINE.skippedLoaderLead : 0,
            });

            // t = 0.0: Background scale 1.08 -> 1 (1.8s)
            if (bg) {
              tl.fromTo(
                bg,
                { scale: 1.08 },
                { scale: 1, duration: HERO_TIMELINE.idleStart },
                HERO_TIMELINE.bgStart,
              );
            }

            // t = 0.1: Upright A (#mA) & Inverted A (#mV) from Motion Lab
            if (motifA && motifV) {
              const av = [motifA, motifV];
              gsap.set(av, {
                fillOpacity: 0,
                stroke: 'var(--color-paper)',
                strokeOpacity: 0.4,
                strokeWidth: 2.5,
                strokeDasharray: '1 1',
                strokeDashoffset: 1,
              });
              tl.fromTo(
                motifA,
                { x: HERO_TIMELINE.motifFromX * distFactor },
                { x: 0, duration: HERO_TIMELINE.motifSlideDur },
                HERO_TIMELINE.motifStart,
              )
                .fromTo(
                  motifV,
                  { x: HERO_TIMELINE.motifFromX * distFactor },
                  { x: 0, duration: HERO_TIMELINE.motifSlideDur },
                  HERO_TIMELINE.motifStart + HERO_TIMELINE.motifVLag,
                )
                .to(
                  av,
                  {
                    strokeDashoffset: 0,
                    duration: HERO_TIMELINE.motifDrawDur,
                    ease: EASE.SineInOut,
                  },
                  HERO_TIMELINE.motifStart,
                )
                .to(
                  av,
                  {
                    fillOpacity: 0.36,
                    strokeOpacity: 0,
                    duration: DUR.text,
                    ease: EASE.soft,
                  },
                  HERO_TIMELINE.motifStart + HERO_TIMELINE.motifFillAt,
                );
            }

            // t = 0.15: Headline lines (xPercent 40 -> 0, stagger 0.1, dur 1.2)
            if (lines.length > 0) {
              tl.fromTo(
                lines,
                { xPercent: HERO_TIMELINE.headlineFromXPercent * distFactor, opacity: 0 },
                {
                  xPercent: 0,
                  opacity: 1,
                  duration: DUR.hero,
                  stagger: STAGGER.lines,
                },
                HERO_TIMELINE.headlineStart,
              );
            }

            // t = 0.2: Ghost text TRUTH WELL TOLD rises from bottom (yPercent 100 -> 8, power4.out, dur 1.5)
            if (ghost) {
              tl.fromTo(
                ghost,
                { yPercent: DIST.maskFrom },
                {
                  yPercent: 8,
                  duration: DUR.heroGhost,
                  ease: EASE.ghostOut,
                },
                HERO_TIMELINE.ghostStart,
              );
            }

            // t = 0.4: Trophies entrance [back-left, back-right, front], stagger 0.18, dur 1.2
            trophyEntrances.forEach((el, index) => {
              const isFront = index === 2;
              tl.fromTo(
                el,
                {
                  y: DIST.trophyRise * distFactor,
                  scale: 0.94,
                  opacity: 0,
                },
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  duration: DUR.hero,
                  ease: isFront ? EASE.pop : EASE.out,
                },
                HERO_TIMELINE.trophiesStart + index * STAGGER.trophies,
              );
            });

            // t = 0.5: Subheading (x 60 -> 0, opacity 0 -> 1, dur 1.0)
            if (subheading) {
              tl.fromTo(
                subheading,
                { x: DIST.slide * distFactor, opacity: 0 },
                { x: 0, opacity: 1, duration: DUR.text },
                HERO_TIMELINE.subheadingStart,
              );
            }

            // t = 0.65: VIEW OUR WORK (y 16 -> 0, opacity 0 -> 1, dur 0.8)
            if (cta) {
              tl.fromTo(
                cta,
                { y: (DIST.rise / 2) * distFactor, opacity: 0 },
                { y: 0, opacity: 1, duration: DUR.heroCta },
                HERO_TIMELINE.ctaStart,
              );
            }

            // t = 0.8: Header (logo, links, button) y -12 -> 0, opacity 0 -> 1, stagger 0.05, dur 0.8
            if (headerItems.length > 0) {
              tl.fromTo(
                headerItems,
                { y: HERO_TIMELINE.headerFromY, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: DUR.headerIn,
                  stagger: STAGGER.header,
                },
                HERO_TIMELINE.headerStart,
              );
            }

            // t = 1.8: Start idle loops
            tl.add(startIdleLoops, HERO_TIMELINE.idleStart);
          }

          // Desktop fine-pointer parallax: trophies move opposite to cursor (back +-8px, front +-14px)
          if (isFinePointer && !isMobile && trophyParallaxes.length > 0) {
            const setters = Array.from(trophyParallaxes).map((el, index) => {
              const maxShift =
                index === 2 ? DIST.parallaxFront : DIST.parallaxBack;
              return {
                maxShift,
                xTo: gsap.quickTo(el, 'x', {
                  duration: DUR.spotlight,
                  ease: EASE.soft,
                }),
                yTo: gsap.quickTo(el, 'y', {
                  duration: DUR.spotlight,
                  ease: EASE.soft,
                }),
              };
            });

            const onPointerMove = (e: PointerEvent) => {
              const rect = section.getBoundingClientRect();
              const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
              const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
              setters.forEach(({ maxShift, xTo, yTo }) => {
                xTo(-nx * maxShift);
                yTo(-ny * maxShift);
              });
            };

            section.addEventListener('pointermove', onPointerMove);
            return () => {
              section.removeEventListener('pointermove', onPointerMove);
            };
          }

          return undefined;
        },
      );
    },
    { scope: sectionRef, dependencies: [isHeroReady, skippedLoader] },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      data-hero-section
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-crimson-950 pt-24 text-paper lg:pt-28"
    >
      {/* Background metallic red image */}
      <img
        src={heroBgSrc}
        alt=""
        width={1922}
        height={1674}
        fetchPriority="high"
        decoding="async"
        data-hero-bg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top will-change-transform"
      />

      {/* Upright A (#mA) and Inverted A (#mV) motif from Motion Lab (Zero FOUC initial attributes) */}
      <svg
        id="avsvg"
        data-hero-motif
        data-page-parallax
        viewBox="983.03 0 936.97 933.88"
        preserveAspectRatio="xMaxYMin meet"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 z-10 h-[72%] w-auto max-w-[78%] mix-blend-multiply select-none md:h-[82%] md:max-w-[52%]"
      >
        <path
          id="mA"
          pathLength={1}
          className="fill-ink-soft stroke-paper"
          fillOpacity={0}
          strokeOpacity={0}
          strokeWidth={2.5}
          strokeDasharray="1 1"
          strokeDashoffset={1}
          d={MOTIF_A_PATH}
        />
        <path
          id="mV"
          pathLength={1}
          className="fill-ink-soft stroke-paper"
          fillOpacity={0}
          strokeOpacity={0}
          strokeWidth={2.5}
          strokeDasharray="1 1"
          strokeDashoffset={1}
          d={MOTIF_V_PATH}
        />
      </svg>

      {/* Main hero content grid */}
      <div className="relative z-20 mx-auto mt-auto grid w-full max-w-hero items-center gap-10 px-6 pt-6 pb-4 sm:px-12 md:grid-cols-12 lg:gap-4 lg:pt-10 lg:pb-6 lg:pl-[9.5%] lg:pr-[3.5%]">
        {/* Left column: Headline, subheading, VIEW OUR WORK link */}
        <div className="space-y-6 md:col-span-6 lg:col-span-5 lg:space-y-7">
          <h1
            id="hero-heading"
            data-hero-headline
            className="font-display text-[clamp(2.5rem,4.9vw,7.84rem)] leading-[0.94] font-bold tracking-[-0.025em] text-paper uppercase"
          >
            {hero.headlineLines.map((line) => (
              <span key={line} className="block overflow-y-clip py-0.5">
                <span
                  data-hero-line
                  className="block whitespace-nowrap will-change-transform"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-subheading
            className="max-w-[clamp(32rem,26.6667vw,42.6667rem)] text-body font-medium text-paper/85 will-change-transform"
          >
            {hero.subheading}
          </p>

          <div data-hero-cta className="pt-1 will-change-transform">
            <Link
              href={hero.cta.href}
              className="group inline-flex items-center gap-3 text-accent font-semibold tracking-wider text-paper uppercase transition-colors duration-300 hover:text-maroon-200 focus-visible:text-maroon-200"
            >
              <span>{hero.cta.label}</span>
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 transition-[translate,background-color,border-color,color] duration-300 ease-out group-hover:translate-x-1 group-hover:border-paper group-hover:bg-paper group-hover:text-crimson-800 group-focus-visible:translate-x-1 group-focus-visible:border-paper group-focus-visible:bg-paper group-focus-visible:text-crimson-800"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l6-6-6-6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Right column: 3 Silverback Awards trophies in triangle formation */}
        <div data-page-parallax className="flex justify-center md:col-span-6 lg:col-span-7 lg:justify-end">
          <AwardsTriangleLoop
            images={hero.awards.map((award) => award.image)}
            play={isHeroReady}
            bob={false}
          />
        </div>
      </div>

      {/* Oversized background ghost typography TRUTH WELL TOLD */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-10 w-full select-none overflow-hidden text-center"
      >
        <span
          data-hero-ghost
          className="mx-auto block w-full max-w-ghost text-center font-display text-[clamp(2.8rem,9.5vw,15.2rem)] leading-[0.84] font-bold tracking-[-0.025em] whitespace-nowrap text-crimson-975/50 uppercase mix-blend-multiply will-change-transform"
        >
          {hero.ghostText}
        </span>
      </div>
    </section>
  );
}
