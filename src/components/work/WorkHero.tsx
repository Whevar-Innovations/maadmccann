import type { WorkPage } from '@/content/types';
import { MotifHero } from '@/components/ui/MotifHero';
import { WORK_HERO } from '@/motion/tokens';
import {
  WORK_MOTIF_CENTERS,
  WORK_MOTIF_H,
  WORK_MOTIF_PATHS,
  WORK_MOTIF_VIEWBOX,
  WORK_MOTIF_W,
} from './workMotifPaths';

export type WorkHeroProps = {
  hero: WorkPage['hero'];
};

const WORK_MOTIF = {
  patternId: 'work-motif-pattern',
  paths: WORK_MOTIF_PATHS,
  centers: WORK_MOTIF_CENTERS,
  width: WORK_MOTIF_W,
  height: WORK_MOTIF_H,
  viewBox: WORK_MOTIF_VIEWBOX,
};

/**
 * Our Work hero (MotifHero). Motion matches What We Do minus the bloom: the motif fades in and a
 * cursor spotlight lights the doodles; the headline lines rise and the subheading fades up.
 */
export function WorkHero({ hero }: WorkHeroProps) {
  return (
    <MotifHero
      headingId="work-hero-heading"
      headlineLines={hero.headlineLines}
      subheading={hero.subheading}
      motif={WORK_MOTIF}
      bloom={false}
      restOpacity={WORK_HERO.motifOpacity}
      subDelay={WORK_HERO.subDelay}
    />
  );
}
