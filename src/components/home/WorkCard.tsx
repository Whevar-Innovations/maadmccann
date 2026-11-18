import { useRef } from 'react';
import type { Project } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { RevealImage } from '@/motion/RevealImage';
import { DUR, EASE, REVEAL } from '@/motion/tokens';

export type WorkCardProps = {
  project: Project;
  slotIndex: number;
  className?: string;
};

/**
 * Individual work tile (SPEC §7 #5, §8.5 & §8.6).
 * - Uses <RevealImage parallax> for scroll reveal + scrubbed image drift.
 * - Hover interaction (§8.6): image scale 1.05 (0.8s EASE.out), overlay darkens slightly,
 *   and the `——` line extends from 24px to 48px using transform (scaleX + x) only.
 */
export function WorkCard({ project, slotIndex, className = '' }: WorkCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const hoverZoomRef = useRef<HTMLDivElement | null>(null);
  const hoverDarkRef = useRef<HTMLDivElement | null>(null);
  const lineStemRef = useRef<HTMLSpanElement | null>(null);
  const lineTipRef = useRef<SVGSVGElement | null>(null);

  const isBanner = slotIndex === 4;
  const isTall = slotIndex === 0;
  const sizes = isBanner ? '100vw' : '(min-width: 768px) 50vw, 100vw';

  useGSAP(
    () => {
      const card = cardRef.current;
      const zoomEl = hoverZoomRef.current;
      const darkEl = hoverDarkRef.current;
      const stemEl = lineStemRef.current;
      const tipEl = lineTipRef.current;
      if (!card || !zoomEl || !darkEl || !stemEl || !tipEl) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.motionOk, () => {
        const onEnter = () => {
          gsap.to(zoomEl, {
            scale: REVEAL.workHoverScale,
            duration: REVEAL.workHoverDuration,
            ease: EASE.out,
            overwrite: 'auto',
          });
          gsap.to(darkEl, {
            opacity: 1,
            duration: DUR.ui,
            ease: EASE.soft,
            overwrite: 'auto',
          });
          gsap.to(stemEl, {
            scaleX: 2,
            duration: DUR.ui,
            ease: EASE.out,
            overwrite: 'auto',
          });
          gsap.to(tipEl, {
            x: 24,
            duration: DUR.ui,
            ease: EASE.out,
            overwrite: 'auto',
          });
        };

        const onLeave = () => {
          gsap.to(zoomEl, {
            scale: 1,
            duration: REVEAL.workHoverDuration,
            ease: EASE.out,
            overwrite: 'auto',
          });
          gsap.to(darkEl, {
            opacity: 0,
            duration: DUR.ui,
            ease: EASE.soft,
            overwrite: 'auto',
          });
          gsap.to(stemEl, {
            scaleX: 1,
            duration: DUR.ui,
            ease: EASE.out,
            overwrite: 'auto',
          });
          gsap.to(tipEl, {
            x: 0,
            duration: DUR.ui,
            ease: EASE.out,
            overwrite: 'auto',
          });
        };

        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointerleave', onLeave);
        card.addEventListener('focusin', onEnter);
        card.addEventListener('focusout', onLeave);

        return () => {
          card.removeEventListener('pointerenter', onEnter);
          card.removeEventListener('pointerleave', onLeave);
          card.removeEventListener('focusin', onEnter);
          card.removeEventListener('focusout', onLeave);
        };
      });
    },
    { scope: cardRef },
  );

  return (
    <article
      ref={cardRef}
      data-work-card
      data-work-slot={slotIndex}
      className={`group relative overflow-hidden bg-ink text-paper ${className}`.trim()}
    >
      <Link
        href={project.href}
        aria-label={`${project.client}: ${project.title} — View work`}
        className="relative block h-full w-full"
      >
        <RevealImage
          parallax
          className={`relative h-full w-full ${
            isTall
              ? 'aspect-[3/4] md:aspect-auto md:h-full'
              : isBanner
                ? 'aspect-[16/9] md:aspect-[2.38/1]'
                : 'aspect-[16/9]'
          }`}
        >
          <div ref={hoverZoomRef} className="h-full w-full will-change-transform">
            <Img
              image={project.image}
              sizes={sizes}
              className="h-full w-full object-cover"
            />
          </div>
        </RevealImage>

        {/* Bottom dark gradient overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        />

        {/* Extra hover darkening layer (opacity animated via GSAP) */}
        <div
          ref={hoverDarkRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/25 opacity-0"
        />

        {/* Bottom-left caption: Client: Title + View work ——> */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:px-10 lg:py-9">
          <h3 className="text-tile-label leading-tight font-semibold text-paper">
            {project.client}: {project.title}
          </h3>
          <div className="mt-2.5 inline-flex items-center gap-3 text-sub font-regular text-paper/95">
            <span>View work</span>
            <span
              data-work-line
              aria-hidden="true"
              className="inline-flex items-center"
            >
              {/* 24px (w-6) stem that scales 2x to 48px on hover using transform only */}
              <span
                ref={lineStemRef}
                className="inline-block h-[1px] w-6 origin-left bg-paper/90 will-change-transform"
              />
              <svg
                ref={lineTipRef}
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="-ml-1.5 will-change-transform"
              >
                <path d="m4 2 4.5 4L4 10" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
