import type { ImageUrlBuilder } from '../sanity/types';

/**
 * Emulates the Sanity image CDN using pre-sized files named `<name>-<height>.<ext>`
 * (e.g. /trophies/grand-prix-1400.webp -> /trophies/grand-prix-700.webp).
 */
export const mockImageUrl: ImageUrlBuilder = (asset, { height }) =>
  asset.url.replace(/-\d+(\.\w+)$/, `-${height}$1`);
