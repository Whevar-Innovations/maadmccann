import { useRef } from 'react';
import type { CaseStudyPage } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { VideoFrame } from '@/components/ui/VideoFrame';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { isSharedTransitionActive } from '@/motion/PageTransition';
import { CASE_MEDIA, DUR, EASE, ENTRANCE } from '@/motion/tokens';

export type CaseMediaProps = {
  media: CaseStudyPage['media'];
  title: string;
};

/**
 * The case-study header frame: an inline video, or a hero image when the project has no film.
 * `data-shared-target` is where a clicked project tile's image settles (see motion/PageTransition).
 *
 * Motion:
 * - Entrance: the frame un-clips from the bottom while the poster settles from a zoom. Skipped when
 *   a tile image expanded into the frame (that transition is the entrance).
 * - Scroll "lean in" (desktop): the frame grows to the design's width over the first part of the
 *   scroll, capped at the viewport. It is 1 at scroll 0, so the tile expand lands on the true frame.
 * - Reduced motion: a plain fade; no scale.
 */
export function CaseMedia({ media, title }: CaseMediaProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useGSAP(
    () => {
      const root = ref.current;
      const grow = root?.querySelector<HTMLElement>('[data-case-grow]');
      const frame = root?.querySelector<HTMLElement>('[data-shared-target]');
      const zoom = root?.querySelector<HTMLElement>('[data-case-zoom]');
      if (!grow || !frame || !zoom) return;
      const shared = isSharedTransitionActive();
      const delay = CASE_MEDIA.enterDelay + (skippedLoader ? ENTRANCE.lead : 0);
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        if (shared) return;
        gsap.set(frame, { opacity: 0 });
        if (isHeroReady) gsap.to(frame, { opacity: 1, duration: DUR.ui, ease: EASE.soft, delay });
      });

      mm.add({ motionOk: MEDIA_QUERIES.motionOk, isDesktop: MEDIA_QUERIES.desktop }, (context) => {
        const { motionOk, isDesktop } = context.conditions ?? {};
        if (!motionOk) return;

        if (!shared) {
          gsap.set(frame, { clipPath: ENTRANCE.clipFrom });
          gsap.set(zoom, { scale: CASE_MEDIA.enterScale });
          if (isHeroReady) {
            gsap.to(frame, { clipPath: ENTRANCE.clipTo, duration: DUR.media, ease: EASE.inOut, delay });
            gsap.to(zoom, { scale: 1, duration: DUR.heroBg, ease: EASE.out, delay });
          }
        }

        if (!isDesktop) return;
        gsap.fromTo(
          grow,
          { scale: 1 },
          {
            // Never wider than the viewport (e.g. at 1440 the frame is already near full width).
            scale: () =>
              Math.max(1, Math.min(CASE_MEDIA.growScale, document.documentElement.clientWidth / grow.offsetWidth)),
            ease: EASE.linear,
            scrollTrigger: {
              start: 0,
              end: () => `+=${window.innerHeight * CASE_MEDIA.growVh}`,
              scrub: CASE_MEDIA.scrub,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: ref, dependencies: [isHeroReady, skippedLoader] },
  );

  return (
    <div ref={ref} className="container-site">
      <div data-case-grow className="mx-auto max-w-7xl will-change-transform">
        <div data-shared-target className="overflow-hidden">
          <div data-case-zoom className="will-change-transform">
            {media.kind === 'video' ? (
              <VideoFrame videoUrl={media.videoUrl} poster={media.poster} title={title} priority />
            ) : (
              <div className="aspect-video overflow-hidden bg-placeholder">
                <Img image={media.image} priority sizes="100vw" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
