import { whatWeDo } from '@/content/static/whatWeDo';
import { MotifHero, type MotifData } from '@/components/layout/MotifHero';
import {
  HEADER_MOTIF_CENTERS,
  HEADER_MOTIF_H,
  HEADER_MOTIF_PATHS,
  HEADER_MOTIF_VIEWBOX,
  HEADER_MOTIF_W,
} from './headerMotifPaths';

const MOTIF: MotifData = {
  w: HEADER_MOTIF_W,
  h: HEADER_MOTIF_H,
  viewBox: HEADER_MOTIF_VIEWBOX,
  paths: HEADER_MOTIF_PATHS,
  centers: HEADER_MOTIF_CENTERS,
};

/** What We Do hero banner: the shared MotifHero with the What We Do doodle motif. */
export function WhatWeDoHero() {
  const { hero } = whatWeDo;
  return (
    <MotifHero
      id="wwd-hero"
      motif={MOTIF}
      headlineLines={hero.headlineLines}
      bodyLines={hero.bodyLines}
    />
  );
}
