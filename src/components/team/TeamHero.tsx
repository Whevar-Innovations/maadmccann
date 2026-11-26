import { useRef } from 'react';
import type { ImageAsset } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, TEAM_HERO } from '@/motion/tokens';

/**
 * The MAAD Ones header image: the full team photo, edge to edge, under the transparent site header.
 * Entrance (after the first-visit loader): the photo un-clips from the top while easing from a
 * slight zoom. Desktop adds a gentle scroll parallax. A top scrim keeps the white nav legible
 * over the light mural.
 * Crops: mobile keeps nearly the whole group; wider screens trim the ceiling, like the design.
 */
export type TeamHeroProps = { image: ImageAsset };

export function TeamHero({ image }: TeamHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !isHeroReady) return;
      const frame = section.querySelector<HTMLElement>('[data-hero-frame]');
      const zoom = section.querySelector<HTMLElement>('[data-hero-zoom]');
      const drift = section.querySelector<HTMLElement>('[data-hero-drift]');
      if (!frame || !zoom || !drift) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(frame, { opacity: 0 }, { opacity: 1, duration: DUR.ui });
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isDesktop: MEDIA_QUERIES.desktop },
        (context) => {
          const { motionOk, isDesktop } = context.conditions ?? {};
          if (!motionOk) return;

          const tl = gsap.timeline({ delay: skippedLoader ? 0.05 : 0 });
          tl.fromTo(
            frame,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.heroBg, ease: EASE.inOut },
            0,
          ).fromTo(
            zoom,
            { scale: 1.18 },
            { scale: 1, duration: DUR.heroBg + 0.6, ease: EASE.out },
            0,
          );

          if (isDesktop) {
            gsap.fromTo(
              drift,
              { yPercent: 0 },
              {
                yPercent: TEAM_HERO.driftYPercent,
                ease: EASE.linear,
                scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
              },
            );
          }
        },
      );
    },
    { scope: sectionRef, dependencies: [isHeroReady, skippedLoader] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="The MAAD McCANN team"
      className="relative isolate overflow-hidden bg-ink"
    >
      <div
        data-hero-frame
        className="relative aspect-[5/3] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-[2.6/1] lg:max-h-[88svh] lg:min-h-[30rem] [@media(orientation:landscape)_and_(max-height:540px)]:aspect-auto [@media(orientation:landscape)_and_(max-height:540px)]:h-svh"
      >
        <div data-hero-drift data-page-parallax className="absolute inset-0 will-change-transform">
          <div data-hero-zoom className="h-full w-full will-change-transform">
            <Img
              image={image}
              sizes="100vw"
              priority
              className="h-full w-full object-cover object-[50%_60%] sm:object-[50%_72%] lg:object-[50%_78%]"
            />
          </div>
        </div>

        {/* Header scrim: white nav over the light mural */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/25 to-transparent sm:h-40"
        />
      </div>
    </section>
  );
}
