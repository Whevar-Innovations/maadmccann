import type { ImageAsset } from '@/content/types';

export type ImgProps = {
  image: ImageAsset;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  className?: string;
  /** CSS object-position, for object-cover images that need a focal point. */
  objectPosition?: string;
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
}: ImgProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={decorative ? '' : image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
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
