import { useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { DUR, EASE, MOTIF_LAB, REVEAL, SCROLL } from '@/motion/tokens';
import {
  FOOTER_MOTIF_H,
  FOOTER_MOTIF_PATHS,
  FOOTER_MOTIF_VIEWBOX,
  FOOTER_MOTIF_W,
} from './footerMotifPaths';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';

export type FooterMotifStageProps = {
  children: ReactNode;
};

/**
 * Shared crimson lower stage wrapping both CtaBand and Footer.
 * Implements the exact dual-SVG motif architecture from `MAAD McCANN_ footer motif motion lab.html`:
 * 1. Scroll-enter Bloom: each <path> scales & fades outward from the center delayed by radial distance `_d * 1.6`,
 *    while the base SVG blooms and settles to resting opacity.
 * 2. Interactive Spotlight: `#bright` <use href="#footer-motif-pattern" /> masked by a 240px radial gradient
 *    following `--x` and `--y` via `gsap.quickTo`.
 */
export function FooterMotifStage({ children }: FooterMotifStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const baseSvgRef = useRef<SVGSVGElement | null>(null);
  const brightSvgRef = useRef<SVGSVGElement | null>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const base = baseSvgRef.current;
      const bright = brightSvgRef.current;
      if (!stage || !base || !bright) return;

      const paths = Array.from(
        base.querySelectorAll<SVGPathElement>('#footer-motif-pattern path'),
      );

      // Precalculate radial distance from focal center [W/2, H*0.55] exactly as in Motion Lab HTML
      const focalX = FOOTER_MOTIF_W / 2;
      const focalY = FOOTER_MOTIF_H * 0.55;
      const maxDist = Math.hypot(FOOTER_MOTIF_W, FOOTER_MOTIF_H) / 2;
      const distMap = new Map<SVGPathElement, number>();

      paths.forEach((p) => {
        try {
          const b = p.getBBox();
          const d =
            Math.hypot(b.x + b.width / 2 - focalX, b.y + b.height / 2 - focalY) /
            maxDist;
          distMap.set(p, d);
        } catch {
          distMap.set(p, 0);
        }
      });

      const mm = gsap.matchMedia();

      // Reduced motion: set resting opacity immediately, enable static spotlight on hover
      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.set(base, { opacity: MOTIF_LAB.restOpacity });
      });

      // Normal motion: Bloom on scroll-enter + CTA bg parallax scrub + Spotlight on pointermove
      mm.add(MEDIA_QUERIES.motionOk, () => {
        gsap.set(base, { opacity: MOTIF_LAB.restOpacity });

        const ctaBg = stage.querySelector<HTMLElement>('[data-cta-bg]');
        if (ctaBg && window.matchMedia(MEDIA_QUERIES.desktop).matches) {
          gsap.fromTo(
            ctaBg,
            { yPercent: -REVEAL.ctaParallaxPercent, scale: REVEAL.ctaBgScale },
            {
              yPercent: REVEAL.ctaParallaxPercent,
              scale: REVEAL.ctaBgScale,
              ease: EASE.linear,
              scrollTrigger: {
                trigger: stage,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        }

        const st = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: SCROLL.start,
            once: true,
          },
        });

        st.set(base, { opacity: MOTIF_LAB.bloomPeakOpacity }, 0);
        st.from(
          paths,
          {
            opacity: 0,
            scale: 0.9,
            transformOrigin: '50% 50%',
            duration: DUR.bloomPath,
            ease: EASE.out,
            delay: (_i, target) =>
              (distMap.get(target as SVGPathElement) ?? 0) *
              MOTIF_LAB.bloomDistanceDelayFactor,
          },
          0,
        );
        st.to(
          base,
          {
            opacity: MOTIF_LAB.restOpacity,
            duration: DUR.bloomSettle,
            ease: EASE.SineInOut,
          },
          MOTIF_LAB.bloomSettleDelay,
        );

        // Pointer spotlight (Motion Lab lines 57-58)
        const mx = gsap.quickTo(bright, '--x', {
          duration: DUR.spotlight,
          ease: EASE.soft,
        });
        const my = gsap.quickTo(bright, '--y', {
          duration: DUR.spotlight,
          ease: EASE.soft,
        });

        const onPointerMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          mx(e.clientX - r.left);
          my(e.clientY - r.top);
        };

        const onPointerEnter = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          gsap.set(bright, {
            '--x': e.clientX - r.left,
            '--y': e.clientY - r.top,
          });
          gsap.to(bright, {
            opacity: MOTIF_LAB.spotOpacity,
            duration: DUR.ui,
            ease: EASE.soft,
          });
        };

        const onPointerLeave = () => {
          gsap.to(bright, {
            opacity: 0,
            duration: DUR.ui,
            ease: EASE.soft,
          });
        };

        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerenter', onPointerEnter);
        stage.addEventListener('pointerleave', onPointerLeave);

        return () => {
          stage.removeEventListener('pointermove', onPointerMove);
          stage.removeEventListener('pointerenter', onPointerEnter);
          stage.removeEventListener('pointerleave', onPointerLeave);
        };
      });
    },
    { scope: stageRef },
  );

  const brightMaskStyle: CSSProperties = {
    ['--x' as string]: 400,
    ['--y' as string]: 260,
    WebkitMaskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), black, transparent)`,
    maskImage: `radial-gradient(circle ${MOTIF_LAB.spotRadiusPx}px at calc(var(--x, 400) * 1px) calc(var(--y, 260) * 1px), black, transparent)`,
  };

  return (
    <div
      ref={stageRef}
      data-footer-motif-stage
      className="relative overflow-hidden bg-crimson-950"
    >
      {/* Continuous red metallic texture spanning both CTA Band and Footer */}
      <img
        src={heroBgSrc}
        alt=""
        width={1922}
        height={1674}
        loading="lazy"
        decoding="async"
        data-cta-bg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Base SVG motif (subtle dark crimson watermark matching Screenshot 14-36-34.png, blooms on scroll-enter) */}
      <svg
        ref={baseSvgRef}
        data-motif-base
        viewBox={FOOTER_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-crimson-990 opacity-[0.13] mix-blend-multiply"
      >
        <g id="footer-motif-pattern" fill="currentColor">
          {FOOTER_MOTIF_PATHS.map((d, idx) => (
            <path key={idx} d={d} />
          ))}
        </g>
      </svg>

      {/* Spotlight SVG motif (masked 240px radial glow that illuminates the pattern beneath the cursor) */}
      <svg
        ref={brightSvgRef}
        data-motif-bright
        viewBox={FOOTER_MOTIF_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={brightMaskStyle}
        className="pointer-events-none absolute inset-0 h-full w-full text-blush opacity-0"
      >
        <use href="#footer-motif-pattern" />
      </svg>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
