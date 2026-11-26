import { RevealText } from '@/motion/RevealText';

export type PartnersIntroProps = { intro: string };

/** The centred line between the hero and the sector table; its lines rise out of masks. */
export function PartnersIntro({ intro }: PartnersIntroProps) {
  return (
    <div className="container-site pt-16 pb-10 md:pt-24 md:pb-12 lg:pt-28">
      <RevealText as="p" className="mx-auto max-w-3xl text-center text-sub font-medium text-balance text-ink">
        {intro}
      </RevealText>
    </div>
  );
}
