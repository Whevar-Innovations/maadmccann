import { useRef } from 'react';
import type { BlogPost } from '@/content/static/blog';
import { Img } from '@/components/ui/Img';
import { Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, REVEAL, SCROLL, STAGGER } from '@/motion/tokens';

/**
 * Blog index grid: 2 × 2 cards (one column on phones), drawn at 1920px as a 1070px column of
 * 525px cards. Cards are light grey and turn the design red (#890000) with white type on hover /
 * keyboard focus (the first card in the design shows that state), while the photo eases in slightly.
 *
 * Entrance (same vocabulary as the CSR panels and work tiles): each card rises and un-clips upward,
 * its photo settles from a slight zoom, then the date / category line and title fade up.
 */
export function BlogGrid({ posts }: { posts: readonly BlogPost[] }) {
  const ref = useRef<HTMLElement | null>(null);
  const { isHeroReady } = useLoaderState();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !isHeroReady) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-blog-card]', root);
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          cards,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            stagger: STAGGER.items,
            scrollTrigger: { trigger: root, start: SCROLL.start, once: true },
          },
        );
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;
          const parts = (card: HTMLElement) => ({
            img: card.querySelector<HTMLElement>('[data-card-img]'),
            text: Array.from(card.querySelectorAll<HTMLElement>('[data-card-text]')),
          });

          gsap.set(cards, {
            y: isMobile ? REVEAL.fallYMobile : REVEAL.fallY,
            opacity: 0,
            clipPath: 'inset(10% 0% 0% 0%)',
          });
          cards.forEach((card) => {
            const { img, text } = parts(card);
            if (img) gsap.set(img, { scale: 1.12 });
            gsap.set(text, { y: isMobile ? 10 : 18, opacity: 0 });
          });

          // Batched so cards entering together (the two in a row) still stagger left to right.
          const batches = ScrollTrigger.batch(cards, {
            start: 'top 92%',
            once: true,
            onEnter: (els) => {
              const entered = els as HTMLElement[];
              const tl = gsap.timeline();
              tl.to(
                entered,
                {
                  y: 0,
                  opacity: 1,
                  clipPath: 'inset(0% 0% 0% 0%)',
                  duration: 1.1,
                  stagger: 0.12,
                  ease: EASE.out,
                  clearProps: 'clipPath,transform',
                },
                0,
              );
              entered.forEach((card, i) => {
                const { img, text } = parts(card);
                if (img) {
                  tl.to(
                    img,
                    { scale: 1, duration: DUR.heroBg, ease: EASE.out, clearProps: 'transform' },
                    i * 0.12,
                  );
                }
                tl.to(
                  text,
                  { y: 0, opacity: 1, duration: DUR.text, stagger: 0.08, ease: EASE.out },
                  0.35 + i * 0.12,
                );
              });
            },
          });
          return () => batches.forEach((b) => b.kill());
        },
      );
    },
    { scope: ref, dependencies: [isHeroReady, posts] },
  );

  return (
    <section
      ref={ref}
      aria-label="Articles"
      className="mx-auto w-full px-5 pt-14 pb-20 sm:px-10 sm:pt-20 sm:pb-24 lg:max-w-[min(max(55.73vw,58rem),73.5rem)] lg:px-0 lg:pt-[9.2vw] lg:pb-[9.4vw]"
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[clamp(0.9rem,1.04vw,1.4rem)]">
        {posts.map((post) => (
          <li key={post.slug} data-blog-card className="will-change-transform">
            <Link
              href={`/blog/${post.slug}`}
              className={`group flex h-full flex-col rounded-[clamp(0.7rem,0.625vw,0.9rem)] bg-[#f2f2f2] p-[clamp(0.55rem,0.625vw,0.85rem)] text-ink transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#890000] hover:text-paper focus-visible:bg-[#890000] focus-visible:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#890000]`}
            >
              <div className="relative aspect-[499/334] overflow-hidden rounded-[clamp(0.5rem,0.52vw,0.75rem)]">
                <div data-card-img className="absolute inset-0">
                  <Img
                    image={post.card}
                    sizes="(min-width: 1024px) max(27vw, 28rem), (min-width: 640px) 46vw, 100vw"
                    decorative
                    className="h-full w-full object-cover transition-[scale] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-focus-visible:scale-105"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col px-[clamp(0.6rem,0.73vw,1rem)] pt-[clamp(1.1rem,1.98vw,2.6rem)] pb-[clamp(1.1rem,1.6vw,2.2rem)]">
                <p
                  data-card-text
                  className="flex flex-wrap gap-x-[clamp(1.25rem,1.98vw,2.6rem)] gap-y-1 font-display text-[clamp(0.72rem,0.8125vw,1.1rem)] leading-none font-bold tracking-[0.01em] uppercase"
                >
                  <time dateTime={post.date}>{post.dateLabel}</time>
                  <span>{post.category}</span>
                </p>
                <h2
                  data-card-text
                  className="mt-[clamp(0.9rem,1.67vw,2.2rem)] font-display text-[clamp(1.3rem,1.64vw,2.25rem)] leading-[1.2] font-bold tracking-[-0.005em] text-pretty"
                >
                  {post.titleLead} {post.titleRest}
                </h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
