import { useEffect, useRef, type MouseEvent } from 'react';
import type { Project } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { RevealImage } from '@/motion/RevealImage';
import { DUR, EASE, REVEAL } from '@/motion/tokens';
import { useFallIn } from '@/motion/useFallIn';

export type WorkCardProps = {
  project: Project;
  slotIndex: number;
  /** Touch devices: the card has been tapped once and shows its "View work" CTA. */
  active?: boolean;
  /** Called on the first tap of an inactive card on touch devices. */
  onActivate?: () => void;
  className?: string;
};

/**
 * Tile aspect ratios measured from the design artboard (1920 wide):
 * tall 960x1413, stacked 960x471, banner 1920x800.
 */
const TILE_ASPECT = {
  tall: 'aspect-[960/1413] md:aspect-auto md:h-full',
  stacked: 'aspect-[960/471]',
  banner: 'aspect-[12/5]',
} as const;

const isTouchOnly = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

/**
 * Individual work tile (SPEC §7 #5, §8.5 & §8.6).
 * The image sits at its natural crop and only scales on hover (or on tap on touch devices).
 * Hover/active: image scale 1.05, overlay darkens slightly, the "View work" CTA fades in
 * and its line extends from 24px to 48px using transform only.
 */
export function WorkCard({
  project,
  slotIndex,
  active = false,
  onActivate,
  className = '',
}: WorkCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const hoverZoomRef = useRef<HTMLDivElement | null>(null);
  const hoverDarkRef = useRef<HTMLDivElement | null>(null);
  const lineStemRef = useRef<HTMLSpanElement | null>(null);
  const lineTipRef = useRef<SVGSVGElement | null>(null);
  const animRef = useRef<{ enter: () => void; leave: () => void } | null>(null);

  const landedRef = useFallIn(cardRef, {
    delay: slotIndex === 1 ? 0.12 : 0,
    captionSelector: '[data-work-caption]',
  });

  const isBanner = slotIndex === 4;
  const isTall = slotIndex === 0;
  const sizes = isBanner ? '100vw' : '(min-width: 768px) 50vw, 100vw';
  const aspect = isTall ? TILE_ASPECT.tall : isBanner ? TILE_ASPECT.banner : TILE_ASPECT.stacked;

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
        const tween = (on: boolean) => {
          gsap.to(zoomEl, {
            scale: on ? REVEAL.workHoverScale : 1,
            duration: REVEAL.workHoverDuration,
            ease: EASE.out,
            overwrite: 'auto',
          });
          gsap.to(darkEl, { opacity: on ? 1 : 0, duration: DUR.ui, ease: EASE.soft, overwrite: 'auto' });
          gsap.to(stemEl, { scaleX: on ? 2 : 1, duration: DUR.ui, ease: EASE.out, overwrite: 'auto' });
          gsap.to(tipEl, { x: on ? 24 : 0, duration: DUR.ui, ease: EASE.out, overwrite: 'auto' });
        };
        const enter = () => {
          if (landedRef.current) tween(true);
        };
        const leave = () => tween(false);
        animRef.current = { enter, leave };

        // Touch pointers fire enter/leave around every tap: those are driven by `active` instead.
        const onPointerEnter = (e: PointerEvent) => {
          if (e.pointerType !== 'touch') enter();
        };
        const onPointerLeave = (e: PointerEvent) => {
          if (e.pointerType !== 'touch') leave();
        };

        card.addEventListener('pointerenter', onPointerEnter);
        card.addEventListener('pointerleave', onPointerLeave);
        card.addEventListener('focusin', enter);
        card.addEventListener('focusout', leave);

        return () => {
          animRef.current = null;
          card.removeEventListener('pointerenter', onPointerEnter);
          card.removeEventListener('pointerleave', onPointerLeave);
          card.removeEventListener('focusin', enter);
          card.removeEventListener('focusout', leave);
        };
      });
    },
    { scope: cardRef },
  );

  // Touch devices: mirror the hover animation from the tapped/active state.
  useEffect(() => {
    if (!isTouchOnly()) return;
    if (active) animRef.current?.enter();
    else animRef.current?.leave();
  }, [active]);

  // First tap on a touch device reveals "View work"; the second tap follows the link.
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (active || !isTouchOnly()) return;
    e.preventDefault();
    onActivate?.();
  };

  return (
    <article
      ref={cardRef}
      data-work-card
      data-work-slot={slotIndex}
      data-active={active}
      className={`group relative bg-ink text-paper ${className}`.trim()}
    >
      <Link
        href={project.href}
        aria-label={`${project.client}: ${project.title}, View work`}
        className="relative block h-full w-full"
        onClick={handleClick}
      >
        <RevealImage noScale className={`relative h-full w-full ${aspect}`}>
          <div ref={hoverZoomRef} className="h-full w-full will-change-transform">
            <Img
              image={project.image}
              sizes={sizes}
              objectPosition={project.focus}
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

        {/* Bottom-left caption: Client: Title, then "View work" (hover/tap only) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:px-10 lg:py-9">
          <h3 data-work-caption className="text-tile-label leading-tight font-semibold text-paper">
            {project.client}: {project.title}
          </h3>
          <div className="mt-2.5 inline-flex translate-y-2 items-center gap-3 text-sub font-regular text-paper/95 opacity-0 transition-[opacity,translate,color] duration-500 ease-brand group-hover:translate-y-0 group-hover:text-maroon-400 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:text-maroon-400 group-focus-within:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:text-maroon-400 group-data-[active=true]:opacity-100">
            <span>View work</span>
            <span data-work-line aria-hidden="true" className="inline-flex items-center">
              {/* 24px (w-6) stem that scales 2x to 48px on hover using transform only */}
              <span
                ref={lineStemRef}
                className="inline-block h-[1px] w-6 origin-left bg-current will-change-transform"
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
