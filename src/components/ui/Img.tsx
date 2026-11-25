import type { ImageAsset } from '@/content/types';

const preloaded = new Set<string>();

/**
 * Warm the browser cache for an image before it's rendered (e.g. on hover, ahead of a dialog
 * opening), picking the same srcset candidate an <img> with these `sizes` would.
 */
export function preloadImage(image: ImageAsset, sizes: string) {
  const key = `${image.src}|${sizes}`;
  if (preloaded.has(key)) return;
  preloaded.add(key);
  const img = new Image();
  if (image.srcSet) {
    img.sizes = sizes;
    img.srcset = image.srcSet;
  }
  img.src = image.src;
}

export type ImgProps = {
  image: ImageAsset;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  className?: string;
  /** CSS object-position, for object-cover images that need a focal point. */
  objectPosition?: string;
  /** Load immediately without `priority`'s high fetch priority and sync decoding. */
  eager?: boolean;
};

/**
 * Single image primitive fed by an ImageAsset (SPEC §5.1 & Rule 4).
 * Always sets width, height, and aspect-ratio so nothing shifts when it loads.
 */
export function Img({
  image,
  sizes,
  priority = false,
  decorative = false,
  className,
  objectPosition,
  eager = false,
}: ImgProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={decorative ? '' : image.alt}
      width={image.width}
      height={image.height}
      loading={priority || eager ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
        objectPosition,
        ...(image.lqip
          ? {
              backgroundImage: `url(${image.lqip})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined),
      }}
      className={className}
    />
  );
}
