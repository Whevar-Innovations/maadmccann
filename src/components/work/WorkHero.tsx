import { useRef } from 'react';
import type { WorkPage } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DIST, DUR, EASE, STAGGER, WORK_HERO } from '@/motion/tokens';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';

export type WorkHeroProps = {
  hero: WorkPage['hero'];
};

/**
 * Our Work hero: metallic crimson, with the Our Work doodle motif blended in as a faint
 * embossed backdrop (WORK_HERO.motifOpacity). Entrance after the first-visit loader: the motif
 * blooms in, the headline lines rise, then the subheading. Desktop adds a gentle motif drift.
 */
export function WorkHero({ hero }: WorkHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isHeroReady, skippedLoader } = useLoaderState();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !isHeroReady) return;
      const motif = section.querySelector<HTMLElement>('[data-work-motif]');
      const lines = section.querySelectorAll<HTMLElement>('[data-work-line]');
      const sub = section.querySelector<HTMLElement>('[data-work-sub]');
      if (!motif || !sub) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          [lines, sub],
          { opacity: 0 },
          { opacity: 1, duration: DUR.ui, ease: EASE.soft },
        );
      });

      mm.add(
        {
          motionOk: MEDIA_QUERIES.motionOk,
          isMobile: MEDIA_QUERIES.mobile,
          isDesktop: MEDIA_QUERIES.desktop,
        },
        (context) => {
          const { motionOk, isMobile, isDesktop } = context.conditions ?? {};
          if (!motionOk) return;
          const dist = isMobile ? DIST.rise / 2 : DIST.rise;

          const tl = gsap.timeline({ delay: skippedLoader ? 0.05 : 0 });
          tl.fromTo(
            motif,
            { opacity: 0, scale: WORK_HERO.motifScaleFrom },
            { opacity: WORK_HERO.motifOpacity, scale: 1, duration: DUR.heroMotif, ease: EASE.out },
            0,
          )
            .fromTo(
              lines,
              { y: dist, opacity: 0 },
              { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out, stagger: STAGGER.lines },
              0.1,
            )
            .fromTo(
              sub,
              { y: dist, opacity: 0 },
              { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out },
              0.1 + WORK_HERO.subDelay + STAGGER.lines * lines.length,
            );

          if (isDesktop) {
            gsap.to(motif.parentElement, {
              yPercent: WORK_HERO.motifDriftPercent,
              ease: EASE.linear,
              scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
            });
          }
        },
      );
    },
    { scope: sectionRef, dependencies: [isHeroReady, skippedLoader] },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="work-hero-heading"
      className="relative overflow-hidden bg-crimson-950 pt-36 pb-24 text-center text-paper md:pt-44 md:pb-32 lg:pt-52 lg:pb-36"
    >
      <img
        src={heroBgSrc}
        alt=""
        width={1922}
        height={1674}
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Our Work motif: white strokes on black. `screen` sits on this outer layer (an inner blend would
          only see its own transparent group) so the black drops out and only the strokes lift the red. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-screen will-change-transform">
        <div data-work-motif style={{ opacity: WORK_HERO.motifOpacity }} className="h-full w-full">
          <Img
            image={hero.motif}
            decorative
            priority
            sizes="100vw"
            className="h-full w-full object-cover select-none"
          />
        </div>
      </div>

      <div className="container-site relative z-10">
        <h1
          id="work-hero-heading"
          className="font-display text-cta font-bold tracking-display"
        >
          {hero.headlineLines.map((line) => (
            <span key={line} data-work-line className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          data-work-sub
          className="mx-auto mt-6 max-w-[52ch] text-body font-medium text-balance md:mt-8"
        >
          {hero.subheading}
        </p>
      </div>
    </section>
  );
}
