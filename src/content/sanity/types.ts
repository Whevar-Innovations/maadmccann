/**
 * Raw shapes returned by Sanity (GROQ with the image asset dereferenced, SPEC §5.5).
 * The mock CMS returns exactly these, so only the source changes when Sanity goes live.
 */
export type SanityImageAsset = {
  _id: string;
  url: string;
  metadata: {
    dimensions: { width: number; height: number };
    lqip?: string;
  };
};

export type SanityImage = { alt: string; asset: SanityImageAsset };

export type SanityAward = {
  _id: string;
  title: string;
  year: number;
  image: SanityImage;
};

/** Returns the URL of an asset resized to `height` px (Sanity: @sanity/image-url builder). */
export type ImageUrlBuilder = (asset: SanityImageAsset, opts: { height: number }) => string;
