import type { PartnersPage } from '@/content/types';
import { MotifHero } from '@/components/ui/MotifHero';
import { PARTNERS } from '@/motion/tokens';
import {
  PARTNERS_MOTIF_CENTERS,
  PARTNERS_MOTIF_H,
  PARTNERS_MOTIF_PATHS,
  PARTNERS_MOTIF_VIEWBOX,
  PARTNERS_MOTIF_W,
} from './partnersMotifPaths';

export type PartnersHeroProps = {
  hero: PartnersPage['hero'];
};

const PARTNERS_MOTIF = {
  patternId: 'partners-motif-pattern',
  paths: PARTNERS_MOTIF_PATHS,
  centers: PARTNERS_MOTIF_CENTERS,
  width: PARTNERS_MOTIF_W,
  height: PARTNERS_MOTIF_H,
  viewBox: PARTNERS_MOTIF_VIEWBOX,
};

/**
 * Our Partners hero (MotifHero) with the Our Clients motif. The doodles (handshakes, globes,
 * buildings, people) bloom out from the focal point, then a cursor spotlight lights them.
 */
export function PartnersHero({ hero }: PartnersHeroProps) {
  return (
    <MotifHero
      headingId="partners-hero-heading"
      headlineLines={hero.headlineLines}
      subheading={hero.subheading}
      motif={PARTNERS_MOTIF}
      bloom
      restOpacity={PARTNERS.motifOpacity}
      subDelay={PARTNERS.subDelay}
    />
  );
}
