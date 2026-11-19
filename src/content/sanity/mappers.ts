import type { Award, ImageAsset } from '../types';
import type { ImageUrlBuilder, SanityAward, SanityImage } from './types';

/**
 * Mappers are the only place that knows both the Sanity shape and the app shape (SPEC §5.5).
 */
export function mapImage(
  image: SanityImage,
  urlFor: ImageUrlBuilder,
  heights: readonly number[] = [],
): ImageAsset {
  const { asset, alt } = image;
  const { width, height } = asset.metadata.dimensions;

  const srcSet = heights
    .filter((h) => h <= height)
    .map((h) => `${urlFor(asset, { height: h })} ${Math.floor((width * h) / height)}w`)
    .join(', ');

  return {
    src: asset.url,
    alt,
    width,
    height,
    ...(asset.metadata.lqip ? { lqip: asset.metadata.lqip } : undefined),
    ...(srcSet ? { srcSet } : undefined),
  };
}

export function mapAward(raw: SanityAward, urlFor: ImageUrlBuilder): Award {
  return {
    id: raw._id,
    title: raw.title,
    year: raw.year,
    image: mapImage(raw.image, urlFor, [700, 1400]),
  };
}
