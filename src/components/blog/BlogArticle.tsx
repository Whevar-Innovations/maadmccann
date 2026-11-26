import { Fragment, useRef, type CSSProperties, type RefObject } from 'react';
import cancerRunLogoSrc from '@/assets/svg/blog/cancer-run-2027-logo.svg';
import ironLogoRedSrc from '@/assets/svg/blog/iron-sharpens-iron-logo-red.svg';
import rotaryLogoSrc from '@/assets/svg/blog/rotary-clubs-of-uganda.svg';
import runForTheNileLogoSrc from '@/assets/svg/csr/run-for-the-nile-logo.svg';
import type { BlogLockup, BlogPost } from '@/content/static/blog';
import { Img } from '@/components/ui/Img';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, STAGGER } from '@/motion/tokens';

/** Design red for the title lead and the Iron Sharpens Iron lockup. */
const RED = 'text-[#890000]';
/** Hero + photo row width: 1582px of 1920 on desktop, gutters below that. */
const WIDE = 'mx-auto px-5 sm:px-10 lg:w-[82.5vw] lg:px-0';
const RADIUS = 'rounded-[clamp(0.9rem,1.25vw,1.75rem)]';

/** Logo lockup between the hero and the copy, as in each article of the design. */
function Lockup({ kind }: { kind: BlogLockup }) {
  switch (kind) {
    case 'iron-sharpens-iron':
      return (
        <div
          role="img"
          aria-label="Iron Sharpens Iron: Portfolio Review"
          className={`flex items-center justify-center gap-[0.18em] font-display text-[clamp(2.3rem,5.2vw,7rem)] leading-[0.92] font-bold tracking-[-0.03em] uppercase ${RED}`}
        >
          {/* The mark carries its own divider on the right. */}
          <img src={ironLogoRedSrc} alt="" width={444} height={406} className="h-[1.84em] w-auto shrink-0" />
          <span aria-hidden="true">
            <span className="block">Portfolio</span>
            <span className="block">Review</span>
          </span>
        </div>
      );
    case 'run-for-the-nile':
      return (
        <img
          src={runForTheNileLogoSrc}
          alt="Run for the Nile, to protect Lake Victoria"
          width={210}
          height={123}
          className="mx-auto block h-auto w-[clamp(11rem,18.75vw,25.5rem)]"
        />
      );
    case 'rotary-cancer-run':
      return (
        <div className="flex items-center justify-center gap-[clamp(0.9rem,2.55vw,3.5rem)]">
          <img
            src={rotaryLogoSrc}
            alt="Rotary Clubs of Uganda"
            width={402}
            height={135}
            className="h-[clamp(2.75rem,7vw,9.6rem)] w-auto"
          />
          <span aria-hidden="true" className="h-[clamp(3.4rem,8.75vw,12rem)] w-[2px] bg-[#17478f] lg:w-[3px]" />
          <img
            src={cancerRunLogoSrc}
            alt="Cancer Run 2027"
            width={291}
            height={113}
            className="h-[clamp(2.3rem,5.86vw,8rem)] w-auto"
          />
        </div>
      );
  }
}

/**
 * Article motion, in the site's vocabulary:
 * 1. Title words rise out of masks (as the hero headlines do), then the hero frame wipes open
 *    from the top while its photo settles from a slight zoom (as the CSR posters do).
 *    Both wait for the first-visit loader, like every hero.
 * 2. On scroll: photo-row frames wipe open in turn, the logo lockup pops in, and paragraphs rise
 *    and fade in as they arrive.
 * Reduced motion: plain fades.
 */
function useArticleMotion(ref: RefObject<HTMLElement | null>) {
  const { isHeroReady, skippedLoader } = useLoaderState();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !isHeroReady) return;
      const q = <T extends HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
      const words = q('[data-title-word]');
      const hero = root.querySelector<HTMLElement>('[data-article-hero]');
      const heroImg = root.querySelector<HTMLElement>('[data-article-hero-img]');
      const photos = q('[data-article-photo]');
      const pops = q('[data-article-pop]');
      const reveals = q('[data-reveal]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo([words, hero, photos, pops], { opacity: 0 }, { opacity: 1, duration: DUR.ui });
        gsap.fromTo(reveals, { opacity: 0 }, { opacity: 1, duration: DUR.ui, delay: 0.1 });
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;
          const k = isMobile ? 0.5 : 1;

          // --- Above the fold: title, then hero ---
          const tl = gsap.timeline({ delay: skippedLoader ? 0.05 : 0 });
          tl.fromTo(
            words,
            { yPercent: 110 },
            { yPercent: 0, duration: DUR.hero, stagger: STAGGER.words, ease: EASE.out },
            0.1,
          );
          if (hero) {
            tl.fromTo(
              hero,
              { clipPath: 'inset(0% 0% 100% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: DUR.heroBg * 0.75,
                ease: EASE.inOut,
                clearProps: 'clipPath',
              },
              0.3,
            );
          }
          if (heroImg) {
            tl.fromTo(
              heroImg,
              { scale: 1.12 },
              { scale: 1, duration: DUR.heroBg, ease: EASE.out, clearProps: 'transform' },
              0.3,
            );
          }

          // --- On scroll ---
          photos.forEach((frame, i) => {
            const img = frame.querySelector<HTMLElement>('[data-article-photo-img]');
            const ptl = gsap.timeline({
              delay: 0.15 + i * 0.12,
              scrollTrigger: { trigger: frame, start: 'top 92%', once: true },
            });
            ptl.fromTo(
              frame,
              { clipPath: 'inset(0% 0% 100% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: DUR.heroBg * 0.7,
                ease: EASE.inOut,
                clearProps: 'clipPath',
              },
              0,
            );
            if (img) {
              ptl.fromTo(
                img,
                { scale: 1.12 },
                { scale: 1, duration: DUR.heroBg, ease: EASE.out, clearProps: 'transform' },
                0,
              );
            }
          });

          const batches: ScrollTrigger[] = [];
          if (pops.length) {
            gsap.set(pops, { scale: 0.85, opacity: 0 });
            batches.push(
              ...ScrollTrigger.batch(pops, {
                start: 'top 90%',
                once: true,
                onEnter: (els) =>
                  gsap.to(els, { scale: 1, opacity: 1, duration: 0.9, delay: 0.1, ease: EASE.pop }),
              }),
            );
          }
          if (reveals.length) {
            gsap.set(reveals, { y: 26 * k, opacity: 0 });
            batches.push(
              ...ScrollTrigger.batch(reveals, {
                start: 'top 92%',
                once: true,
                onEnter: (els) =>
                  gsap.to(els, {
                    y: 0,
                    opacity: 1,
                    duration: DUR.text,
                    stagger: 0.07,
                    delay: 0.1,
                    ease: EASE.out,
                  }),
              }),
            );
          }
          return () => batches.forEach((b) => b.kill());
        },
      );
    },
    { scope: ref, dependencies: [isHeroReady, skippedLoader] },
  );
}

/**
 * One blog article (/blog/:slug), from pages 2–5 of the design: centred two-tone title,
 * wide rounded hero, optional photo row (Gayaza), logo lockup, then justified copy.
 * Mount with `key={post.slug}` so moving between articles replays the entrance.
 */
export function BlogArticle({ post }: { post: BlogPost }) {
  const ref = useRef<HTMLElement | null>(null);
  useArticleMotion(ref);

  const words = [
    ...post.titleLead.split(' ').map((word) => ({ word, lead: true })),
    ...post.titleRest.split(' ').map((word) => ({ word, lead: false })),
  ];

  return (
    <article
      ref={ref}
      aria-labelledby="article-title"
      className="bg-paper pt-[calc(5rem+2.75rem)] pb-20 text-ink sm:pt-[calc(5rem+4rem)] sm:pb-28 lg:pt-[calc(7rem+5.2vw)] lg:pb-[7.8vw]"
    >
      <h1
        id="article-title"
        className="mx-auto px-5 text-center font-display text-[1.9rem] leading-[1.06] font-bold tracking-[-0.02em] text-balance sm:max-w-[40rem] sm:px-10 sm:text-[2.6rem] lg:max-w-[max(58vw,48rem)] lg:px-0 lg:text-[clamp(2.6rem,3.8vw,5.25rem)] lg:leading-[1.04] lg:tracking-[-0.015em]"
      >
        {words.map(({ word, lead }, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-top">
              <span data-title-word className={`inline-block will-change-transform ${lead ? RED : ''}`}>
                {word}
              </span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </h1>

      <div className={`mt-9 sm:mt-12 lg:mt-[4.5vw] ${WIDE}`}>
        <div
          data-article-hero
          style={{ '--hero-ratio': post.heroRatio } as CSSProperties}
          className={`relative aspect-[4/3] overflow-hidden bg-[#f2f2f2] sm:aspect-[16/9] lg:aspect-[var(--hero-ratio)] ${RADIUS}`}
        >
          <div data-article-hero-img className="absolute inset-0">
            <Img
              image={post.hero}
              priority
              sizes="(min-width: 1024px) 83vw, 100vw"
              objectPosition={post.heroPosition}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {post.gallery && (
        <ul className={`mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4 lg:mt-[1vw] lg:gap-[1.15vw] ${WIDE}`}>
          {post.gallery.map((image) => (
            <li
              key={image.src}
              data-article-photo
              className={`relative aspect-[778/483] overflow-hidden bg-[#f2f2f2] ${RADIUS}`}
            >
              <div data-article-photo-img className="absolute inset-0">
                <Img
                  image={image}
                  sizes="(min-width: 1024px) 41vw, (min-width: 640px) 46vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {post.lockup && (
        <div data-article-pop className="mt-14 px-5 sm:mt-20 sm:px-10 lg:mt-[5.7vw] lg:px-0">
          <Lockup kind={post.lockup} />
        </div>
      )}

      <div
        className={`mx-auto max-w-[44rem] px-5 sm:px-10 lg:max-w-[max(57.6vw,46rem)] lg:px-0 ${
          post.lockup ? 'mt-12 sm:mt-16 lg:mt-[4.2vw]' : 'mt-14 sm:mt-20 lg:mt-[6.7vw]'
        }`}
      >
        <div className="space-y-[1.3em] text-[clamp(1rem,1.12vw,1.55rem)] leading-[1.32] hyphens-auto sm:text-justify">
          {post.paragraphs.map((p) => (
            <p key={p} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
