import type { ImageAsset } from '../types';

export function img(
  src: string,
  width: number,
  height: number,
  alt: string,
  srcSet?: string,
): ImageAsset {
  return srcSet ? { src, width, height, alt, srcSet } : { src, width, height, alt };
}

export function trophySet(name: string, w700: number, w1400: number): string {
  return `/trophies/${name}-700.webp ${w700}w, /trophies/${name}-1400.webp ${w1400}w`;
}
