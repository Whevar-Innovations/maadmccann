import { useMemo, useRef, type CSSProperties } from 'react';
import type { CaseStudyPage, GalleryItem } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { DIST, DUR, EASE, ENTRANCE, GALLERY, REVEAL, SCROLL, STAGGER } from '@/motion/tokens';
import { layoutGallery, ratioOf, rowRatio, type GalleryRow } from './galleryLayout';

export type ArtworkGalleryProps = {
  gallery: CaseStudyPage['gallery'];
};

/** `sizes` for a piece taking `share` of the gallery width (max-w-content: 1280px to a 1920 viewport, then 66.67vw; ~90vw below 1440). */
const sizesFor = (share: number) =>
  `(min-width: 1920px) ${Math.ceil(66.67 * share)}vw, (min-width: 1440px) ${Math.ceil(1280 * share)}px, (min-width: 768px) ${Math.ceil(90 * share)}vw, 100vw`;

function Figure({ item, share }: { item: GalleryItem; share: number }) {
  return (
    <figure
      className="min-w-0"
      // Width follows aspect ratio, so every item on a row ends up the same height.
      style={{ flex: `${ratioOf(item)} 1 0%` } satisfies CSSProperties}
    >
      <div data-gallery-frame className="overflow-hidden">
        <div data-gallery-inner className="will-change-transform">
          <Img
            image={item.image}
            sizes={sizesFor(share)}
            className="block h-auto w-full"
          />
        </div>
      </div>
      {item.caption && (
        <figcaption
          data-gallery-caption
          className="mx-auto mt-3 max-w-[60ch] text-center text-small font-semibold text-ink"
        >
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Items on one row share a height; below md every item takes a full-width row of its own. */
function Row({ row }: { row: GalleryRow }) {
  const total = rowRatio(row);
  return (
    <div className="flex flex-col gap-1.5 md:flex-row md:gap-2">
      {row.map((item) => (
        <Figure key={item.image.src} item={item} share={ratioOf(item) / total} />
      ))}
    </div>
  );
}

const rowKey = (row: GalleryRow) => row.map((item) => item.image.src).join('|');

/**
 * Artwork mosaic, laid out by `layoutGallery` from the editor's ordered list: justified rows, and
 * "beside" blocks where a feature piece sits next to a stack of rows, sized so both sides match.
 * Same column as the hero video (max-w-content), like the design.
 *
 * Motion: as each batch of artworks scrolls in, the frames wipe up (the direction the page travels)
 * in reading order while the artwork settles from a slight zoom; captions rise after.
 * Reduced motion: a plain fade. Mobile: half the zoom.
 */
export function ArtworkGallery({ gallery }: ArtworkGalleryProps) {
  const ref = useRef<HTMLElement | null>(null);
  const blocks = useMemo(() => layoutGallery(gallery), [gallery]);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const frames = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-frame]'));
      if (frames.length === 0) return;
      const innerOf = (frame: Element) => frame.querySelector<HTMLElement>('[data-gallery-inner]');
      const captionOf = (frame: Element) =>
        frame.closest('figure')?.querySelector<HTMLElement>('[data-gallery-caption]') ?? null;
      const present = <T,>(list: (T | null)[]) => list.filter((el): el is T => el !== null);
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.set(frames, { opacity: 0 });
        const batch = ScrollTrigger.batch(frames, {
          start: SCROLL.start,
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, duration: DUR.ui, ease: EASE.soft, stagger: STAGGER.items }),
        });
        return () => batch.forEach((t) => t.kill());
      });

      mm.add({ motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile }, (context) => {
        const { motionOk, isMobile } = context.conditions ?? {};
        if (!motionOk) return;
        const scaleFrom = isMobile ? 1 + (GALLERY.scaleFrom - 1) / 2 : GALLERY.scaleFrom;
        const rise = isMobile ? DIST.rise / 2 : DIST.rise;
        const captions = present(frames.map(captionOf));

        gsap.set(frames, { clipPath: ENTRANCE.clipFrom });
        gsap.set(present(frames.map(innerOf)), { scale: scaleFrom });
        gsap.set(captions, { y: rise, opacity: 0 });

        const batch = ScrollTrigger.batch(frames, {
          start: SCROLL.start,
          once: true,
          onEnter: (els) => {
            // Batches arrive in DOM order: left to right along a row, then down.
            const tl = gsap.timeline();
            tl.to(els, { clipPath: ENTRANCE.clipTo, duration: DUR.media, ease: EASE.inOut, stagger: STAGGER.items }, 0)
              .to(
                present(els.map(innerOf)),
                { scale: 1, duration: REVEAL.imageScaleDuration, ease: EASE.out, stagger: STAGGER.items },
                0,
              )
              .to(
                present(els.map(captionOf)),
                { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out, stagger: STAGGER.items },
                GALLERY.captionDelay,
              );
          },
        });
        return () => batch.forEach((t) => t.kill());
      });
    },
    { scope: ref, dependencies: [blocks] },
  );

  return (
    <section
      ref={ref}
      aria-label="Campaign artwork"
      className="container-site pb-20 md:pb-28 lg:pb-32"
    >
      <div className="mx-auto flex max-w-content flex-col gap-1.5 md:gap-2">
        {blocks.map((block) => {
          if (block.layout === 'rows') {
            return (
              <div key={block.rows.map(rowKey).join('/')} className="flex flex-col gap-1.5 md:gap-2">
                {block.rows.map((row) => (
                  <Row key={rowKey(row)} row={row} />
                ))}
              </div>
            );
          }

          const stackHeight = block.rows.reduce((sum, row) => sum + 1 / rowRatio(row), 0);
          const tallWeight = ratioOf(block.tall) * stackHeight;
          const tallLeft = block.tallSide === 'left';
          return (
            <div
              key={block.tall.image.src}
              className="grid grid-cols-1 gap-1.5 md:gap-2 md:[grid-template-columns:var(--cols)]"
              style={
                {
                  '--cols': tallLeft ? `${tallWeight}fr 1fr` : `1fr ${tallWeight}fr`,
                } as CSSProperties
              }
            >
              <div className={`flex min-w-0 flex-col gap-1.5 md:gap-2 ${tallLeft ? 'md:order-2' : ''}`}>
                {block.rows.map((row) => (
                  <Row key={rowKey(row)} row={row} />
                ))}
              </div>
              <figure className={`min-w-0 ${tallLeft ? 'order-first md:order-1' : ''}`}>
                <div data-gallery-frame className="h-full overflow-hidden">
                  <div data-gallery-inner className="h-full will-change-transform">
                    <Img
                      image={block.tall.image}
                      sizes={sizesFor(tallWeight / (1 + tallWeight))}
                      className="block h-full w-full object-cover"
                    />
                  </div>
                </div>
              </figure>
            </div>
          );
        })}
      </div>
    </section>
  );
}
