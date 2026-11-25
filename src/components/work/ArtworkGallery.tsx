import type { CSSProperties } from 'react';
import type { CaseStudyPage, GalleryItem, GalleryRow } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { RevealImage } from '@/motion/RevealImage';

export type ArtworkGalleryProps = {
  gallery: CaseStudyPage['gallery'];
};

const ratio = (item: GalleryItem) => item.image.width / item.image.height;
const rowRatio = (row: GalleryRow) => row.reduce((sum, item) => sum + ratio(item), 0);

function Figure({ item, share }: { item: GalleryItem; share: number }) {
  return (
    <figure
      className="min-w-0"
      // Width follows aspect ratio, so every item on a row ends up the same height.
      style={{ flex: `${ratio(item)} 1 0%` } satisfies CSSProperties}
    >
      <RevealImage noScale>
        <Img
          image={item.image}
          sizes={`(min-width: 768px) ${Math.ceil(90 * share)}vw, 100vw`}
          className="block h-auto w-full"
        />
      </RevealImage>
      {item.caption && (
        <figcaption className="mx-auto mt-3 max-w-[60ch] text-center text-small font-semibold text-ink">
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
        <Figure key={item.image.src} item={item} share={ratio(item) / total} />
      ))}
    </div>
  );
}

/**
 * Artwork mosaic. `rows` blocks are justified rows; `beside` blocks put one tall piece next to a
 * stack of rows, with the columns sized so both sides come out the same height.
 */
export function ArtworkGallery({ gallery }: ArtworkGalleryProps) {
  return (
    <section aria-label="Campaign artwork" className="container-site flex flex-col gap-1.5 pb-20 md:gap-2 md:pb-28 lg:pb-32">
      {gallery.map((block, index) => {
        if (block.layout === 'rows') {
          return (
            <div key={index} className="flex flex-col gap-1.5 md:gap-2">
              {block.rows.map((row) => (
                <Row key={row.map((item) => item.image.src).join('|')} row={row} />
              ))}
            </div>
          );
        }

        const stackHeight = block.rows.reduce((sum, row) => sum + 1 / rowRatio(row), 0);
        const tallWeight = ratio(block.tall) * stackHeight;
        const tallLeft = block.tallSide === 'left';
        return (
          <div
            key={index}
            className="grid grid-cols-1 gap-1.5 md:gap-2 md:[grid-template-columns:var(--cols)]"
            style={
              {
                '--cols': tallLeft ? `${tallWeight}fr 1fr` : `1fr ${tallWeight}fr`,
              } as CSSProperties
            }
          >
            <div className={`flex min-w-0 flex-col gap-1.5 md:gap-2 ${tallLeft ? 'md:order-2' : ''}`}>
              {block.rows.map((row) => (
                <Row key={row.map((item) => item.image.src).join('|')} row={row} />
              ))}
            </div>
            <figure className={`min-w-0 ${tallLeft ? 'order-first md:order-1' : ''}`}>
              <RevealImage noScale className="h-full">
                <Img
                  image={block.tall.image}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="block h-full w-full object-cover"
                />
              </RevealImage>
            </figure>
          </div>
        );
      })}
    </section>
  );
}
