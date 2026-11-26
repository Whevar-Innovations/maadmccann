import type { BlogPage } from '@/content/types';
import { MotifHero } from '@/components/ui/MotifHero';
import { BLOG } from '@/motion/tokens';
import {
  BLOG_MOTIF_CENTERS,
  BLOG_MOTIF_H,
  BLOG_MOTIF_PATHS,
  BLOG_MOTIF_VIEWBOX,
  BLOG_MOTIF_W,
} from './blogMotifPaths';

export type BlogHeroProps = { hero: BlogPage['hero'] };

const BLOG_MOTIF = {
  patternId: 'blog-motif-pattern',
  paths: BLOG_MOTIF_PATHS,
  centers: BLOG_MOTIF_CENTERS,
  width: BLOG_MOTIF_W,
  height: BLOG_MOTIF_H,
  viewBox: BLOG_MOTIF_VIEWBOX,
};

/**
 * Blog hero (MotifHero, as on Our Work and Our Partners) with the Our Blog motif: speech bubbles,
 * laptops, bulbs and megaphones bloom out from the focal point, then a cursor spotlight lights them.
 */
export function BlogHero({ hero }: BlogHeroProps) {
  return (
    <MotifHero
      headingId="blog-hero-heading"
      headlineLines={hero.headlineLines}
      subheading={hero.subheading}
      motif={BLOG_MOTIF}
      bloom
      restOpacity={BLOG.motifOpacity}
      subDelay={BLOG.subDelay}
    />
  );
}
