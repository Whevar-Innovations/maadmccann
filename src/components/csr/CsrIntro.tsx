import { Fragment, useRef } from 'react';
import type { CsrPage } from '@/content/types';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, SCROLL, STAGGER } from '@/motion/tokens';
import { CSR_BODY, CSR_CONTAINER, CSR_RED } from './styles';

/** Renders `**bold**` spans inside a paragraph. */
function withBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export type CsrIntroProps = { intro: CsrPage['intro'] };

/**
 * "OUR CSR WORK / Ideas With A Greater Purpose." intro.
 * The eyebrow and headline lines rise out of masks, then the copy in both columns fades up.
 * Waits for the first-visit loader so the reveal is not spent underneath it on tall screens.
 */
export function CsrIntro({ intro }: CsrIntroProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { isHeroReady } = useLoaderState();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !isHeroReady) return;
      const lines = root.querySelectorAll<HTMLElement>('[data-intro-line]');
      const body = root.querySelectorAll<HTMLElement>('[data-intro-body]');
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
            .timeline({ scrollTrigger: { trigger: root, start: SCROLL.start, once: true }, delay: 0.15 })
            .fromTo(
              lines,
              { yPercent: 110 },
              { yPercent: 0, duration: DUR.hero, stagger: STAGGER.lines * 1.5, ease: EASE.out },
            )
            .fromTo(
              body,
              { y: isMobile ? 12 : 24, opacity: 0 },
              { y: 0, opacity: 1, duration: DUR.text, stagger: STAGGER.items, ease: EASE.out },
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
      aria-labelledby="csr-intro-heading"
      className={`${CSR_CONTAINER} pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-[6.9vw] lg:pb-[5.2vw]`}
    >
      <p className="overflow-hidden font-display text-[clamp(0.95rem,1.094vw,1.5rem)] leading-[1.15] font-medium tracking-[0.06em] uppercase">
        <span data-intro-line className="block will-change-transform">
          {intro.eyebrow}
        </span>
      </p>

      <div className="mt-5 grid gap-y-6 sm:mt-7 lg:mt-[2.4vw] lg:grid-cols-[43%_42%] lg:justify-between">
        <div>
          <h2
            id="csr-intro-heading"
            className={`font-display text-[clamp(2rem,2.865vw,3.95rem)] leading-[1.05] font-bold tracking-normal ${CSR_RED}`}
          >
            {intro.headlineLines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span data-intro-line className="block will-change-transform">
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <p data-intro-body className={`mt-4 font-medium sm:mt-5 lg:mt-[1.4vw] ${CSR_BODY}`}>
            {intro.body}
          </p>
        </div>

        <div className={`space-y-[1.4em] font-medium ${CSR_BODY}`}>
          {intro.paragraphs.map((p) => (
            <p key={p} data-intro-body>
              {withBold(p)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
