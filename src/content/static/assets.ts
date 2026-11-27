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

/** Cropped brand logos in src/assets/img/partners/ as {id}-{width}.webp (Our Partners + home clients strip). */
const files = import.meta.glob<string>('/src/assets/img/partners/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Partner/client logo: ImageAsset from every `{id}-{width}.webp` export of a logo (largest as src, all in srcSet). */
export function logoImage(id: string, width: number, height: number, alt: string): ImageAsset {
  const variants = Object.entries(files)
    .map(([path, url]) => {
      const m = path.match(new RegExp(`/partners/${id}-(\\d+)\\.webp$`));
      return m ? { w: Number(m[1]), url } : null;
    })
    .filter((v): v is { w: number; url: string } => v !== null)
    .sort((a, b) => a.w - b.w);
  const largest = variants[variants.length - 1];
  if (!largest) throw new Error(`Missing partner logo export: ${id}`);
  const srcSet = variants.length > 1 ? variants.map((v) => `${v.url} ${v.w}w`).join(', ') : undefined;
  return img(largest.url, width, height, alt, srcSet);
}
