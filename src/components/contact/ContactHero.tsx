import type { ContactPage } from '@/content/types';
import { MotifHero } from '@/components/ui/MotifHero';
import { CONTACT } from '@/motion/tokens';
import {
  CONTACT_MOTIF_CENTERS,
  CONTACT_MOTIF_H,
  CONTACT_MOTIF_PATHS,
  CONTACT_MOTIF_VIEWBOX,
  CONTACT_MOTIF_W,
} from './contactMotifPaths';

export type ContactHeroProps = { hero: ContactPage['hero'] };

const CONTACT_MOTIF = {
  patternId: 'contact-motif-pattern',
  paths: CONTACT_MOTIF_PATHS,
  centers: CONTACT_MOTIF_CENTERS,
  width: CONTACT_MOTIF_W,
  height: CONTACT_MOTIF_H,
  viewBox: CONTACT_MOTIF_VIEWBOX,
};

/**
 * Contact Us hero (MotifHero on the ink surface) with the Contact motif: phones, speech bubbles,
 * envelopes, pins and cursors bloom out from the focal point, then a cursor spotlight lights them.
 */
export function ContactHero({ hero }: ContactHeroProps) {
  return (
    <MotifHero
      headingId="contact-hero-heading"
      headlineLines={hero.headlineLines}
      subheading={hero.subheading}
      motif={CONTACT_MOTIF}
      bloom
      surface="ink"
      restOpacity={CONTACT.motifOpacity}
      subDelay={CONTACT.subDelay}
    />
  );
}
