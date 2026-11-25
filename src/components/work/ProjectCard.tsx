import { useRef } from 'react';
import type { WorkProject } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { EASE, REVEAL } from '@/motion/tokens';

export type ProjectCardProps = {
  project: WorkProject;
};

const SIZES = '(min-width: 1024px) 400px, (min-width: 768px) 45vw, 100vw';

/**
 * Our Work grid card: image over a light caption panel (title, then client in red).
 * Cards with a case study link to it and zoom the image on hover; the rest are inert.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);

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
      <div className="aspect-[802/443] overflow-hidden rounded-xl bg-placeholder">
        <div data-card-zoom className="h-full w-full will-change-transform">
          <Img
            image={project.image}
            sizes={SIZES}
            objectPosition={project.focus}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="px-2 pt-3 pb-2.5">
        <h3 className="text-connect leading-snug font-semibold text-ink">{project.title}</h3>
        <p className="text-small text-impact-red">{project.client}</p>
      </div>
    </>
  );

  return (
    <article
      ref={cardRef}
      data-work-card
      className="rounded-2xl bg-tile-grey p-1.5"
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
