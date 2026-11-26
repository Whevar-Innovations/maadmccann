import { useRef } from 'react';
import type { WorkProject } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { RevealImage } from '@/motion/RevealImage';
import { useFallIn } from '@/motion/useFallIn';
import { EASE, REVEAL } from '@/motion/tokens';

export type ProjectCardProps = {
  project: WorkProject;
  /** Position in the grid: staggers the fall-in across a row. */
  index: number;
};

const SIZES = '(min-width: 1024px) 400px, (min-width: 768px) 45vw, 100vw';

/** Cards fill service red on hover (fine pointers), or on keyboard focus when linked, like the blog cards. */
const HOVER_PANEL =
  'transition-colors duration-500 ease-brand hover:bg-service-red has-focus-visible:bg-service-red';
const HOVER_TEXT =
  'transition-colors duration-500 ease-brand group-hover:text-paper group-has-focus-visible:text-paper';

/**
 * Our Work grid card: image over a light caption panel (title, then client in red).
 * Every card's panel turns service red with white type on hover (same as the blog cards).
 * Cards with a case study also link to it, zoom the image and fill on keyboard focus; the rest are
 * not links, so they keep the default cursor.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  // Same "fall into grid" entry as the homepage work tiles.
  useFallIn(cardRef, { delay: (index % 3) * 0.08 });

  useGSAP(
    () => {
      const card = cardRef.current;
      const zoom = card?.querySelector<HTMLElement>('[data-card-zoom]');
      if (!card || !zoom || !project.hasCaseStudy) return;

      const mm = gsap.matchMedia();
      mm.add(`${MEDIA_QUERIES.motionOk} and (hover: hover)`, () => {
        const to = (on: boolean) =>
          gsap.to(zoom, {
            scale: on ? REVEAL.workHoverScale : 1,
            duration: REVEAL.workHoverDuration,
            ease: EASE.out,
            overwrite: 'auto',
          });
        const enter = () => to(true);
        const leave = () => to(false);
        card.addEventListener('pointerenter', enter);
        card.addEventListener('pointerleave', leave);
        card.addEventListener('focusin', enter);
        card.addEventListener('focusout', leave);
        return () => {
          card.removeEventListener('pointerenter', enter);
          card.removeEventListener('pointerleave', leave);
          card.removeEventListener('focusin', enter);
          card.removeEventListener('focusout', leave);
        };
      });
    },
    { scope: cardRef, dependencies: [project.hasCaseStudy] },
  );

  const body = (
    <>
      <RevealImage noScale sharedImage className="aspect-[802/443] rounded-xl bg-placeholder">
        <div data-card-zoom className="h-full w-full will-change-transform">
          <Img
            image={project.image}
            sizes={SIZES}
            objectPosition={project.focus}
            className="h-full w-full object-cover"
          />
        </div>
      </RevealImage>
      <div className="px-2 pt-3 pb-2.5">
        <h3 className={`text-connect leading-snug font-semibold text-ink ${HOVER_TEXT}`}>{project.title}</h3>
        <p className={`text-small text-impact-red ${HOVER_TEXT}`}>{project.client}</p>
      </div>
    </>
  );

  return (
    <article
      ref={cardRef}
      data-work-card
      className={`group rounded-2xl bg-tile-grey p-1.5 ${HOVER_PANEL}`}
    >
      {project.hasCaseStudy ? (
        <Link
          href={project.href}
          aria-label={`${project.title}, ${project.client}`}
          className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-red"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </article>
  );
}
