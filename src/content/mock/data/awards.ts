import type { SanityAward } from '../../sanity/types';

/**
 * Mock `award` documents, shaped like Sanity's (asset dereferenced).
 *
 * Add or replace a trophy:
 *  1. Export a transparent image as `<name>-700.webp` and `<name>-1400.webp` into `public/trophies/`
 *     (the number is the image height in px).
 *  2. Add an entry below: `asset.url` points to the -1400 file, `dimensions` are that file's size.
 *
 * Order matters: the first 3 start as [back-left, back-right, front]; any extra awards
 * wait in a pool and rotate in as the front trophy moves back.
 */
export const mockAwards: SanityAward[] = [
  {
    _id: 'award-digital-social',
    title: 'Digital - Social Media & Influencer',
    year: 2025,
    image: {
      alt: 'Silverback Awards trophy: Digital, Social Media & Influencer 2025',
      asset: {
        _id: 'image-digital-social',
        url: '/trophies/digital-social-1400.webp',
        metadata: { dimensions: { width: 663, height: 1400 } },
      },
    },
  },
  {
    _id: 'award-creative-director',
    title: 'Creative Director of the Year',
    year: 2025,
    image: {
      alt: 'Silverback Awards trophy: Creative Director of the Year 2025',
      asset: {
        _id: 'image-creative-director',
        url: '/trophies/creative-director-1400.webp',
        metadata: { dimensions: { width: 661, height: 1400 } },
      },
    },
  },
  {
    _id: 'award-grand-prix',
    title: 'Grand Prix',
    year: 2025,
    image: {
      alt: 'Silverback Awards trophy: Grand Prix 2025',
      asset: {
        _id: 'image-grand-prix',
        url: '/trophies/grand-prix-1400.webp',
        metadata: { dimensions: { width: 671, height: 1400 } },
      },
    },
  },
];
