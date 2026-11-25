import { useRef } from 'react';
import { team } from '@/content/static/team';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, SCROLL, STAGGER } from '@/motion/tokens';

/**
 * "Different minds. One beautiful MAAD way of thinking." intro.
 * Headline lines rise out of masks, then the body fades up. Waits for the first-visit loader so
 * the reveal is not spent underneath it on tall screens where the intro is already in view.
 */
export function TeamIntro() {
  const ref = useRef<HTMLElement | null>(null);
  const { isHeroReady } = useLoaderState();
  const { intro } = team;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !isHeroReady) return;
      const lines = root.querySelectorAll<HTMLElement>('[data-intro-line]');
      const body = root.querySelector<HTMLElement>('[data-intro-body]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo([lines, body], { opacity: 0 }, { opacity: 1, duration: DUR.ui });
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;
          gsap
            .timeline({ scrollTrigger: { trigger: root, start: SCROLL.start, once: true }, delay: 0.2 })
            .fromTo(
              lines,
              { yPercent: 110 },
              { yPercent: 0, duration: DUR.hero, stagger: STAGGER.lines * 1.5, ease: EASE.out },
            )
            .fromTo(
              body,
              { y: isMobile ? 12 : 24, opacity: 0 },
              { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out },
              0.35,
            );
        },
      );
    },
    { scope: ref, dependencies: [isHeroReady] },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="team-intro-heading"
      className="mx-auto w-full max-w-[1240px] px-5 pt-16 pb-4 text-center sm:px-10 sm:pt-24 lg:pt-28"
    >
      <h1
        id="team-intro-heading"
        className="font-display text-[clamp(1.65rem,2.9vw,3.4rem)] leading-[1.08] font-bold tracking-[-0.025em]"
      >
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-intro-line className="block text-balance text-impact-red will-change-transform">
            {intro.accent}
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-intro-line className="block text-balance text-ink will-change-transform">
            {intro.headline}
          </span>
        </span>
      </h1>
      <p
        data-intro-body
        className="mx-auto mt-5 max-w-[60ch] text-[clamp(0.9rem,0.95vw,1.15rem)] leading-[1.55] font-medium text-ink/85 sm:mt-6"
      >
        {intro.body}
      </p>
    </section>
  );
}
