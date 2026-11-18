import type { HomePage } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { FadeUp } from '@/motion/FadeUp';
import { Magnetic } from '@/motion/Magnetic';
import { RevealText } from '@/motion/RevealText';

export type CtaBandProps = {
  cta: HomePage['cta'];
};

/**
 * CTA band section (SPEC §7 #7 & §8.5, matching Screenshot From 2026-11-18 14-53-53.png).
 * Headline and body use <RevealText>; pill button uses <FadeUp> + <Magnetic>.
 */
export function CtaBand({ cta }: CtaBandProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      data-cta-section
      className="relative z-10 pt-36 pb-32 text-paper sm:pt-44 sm:pb-36 lg:pt-52 lg:pb-44"
    >
      <div className="container-site text-center">
        <RevealText
          as="h2"
          id="cta-heading"
          className="font-display text-cta leading-[1.08] font-bold tracking-tight text-paper"
        >
          {cta.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </RevealText>

        <RevealText
          as="p"
          delay={0.1}
          className="mx-auto mt-6 max-w-[54ch] text-body leading-relaxed font-medium text-paper/95"
        >
          {cta.body}
        </RevealText>

        <FadeUp delay={0.2} className="mt-10">
          <Magnetic>
            <Button
              link={cta.button}
              size="md"
              className="min-w-[14.5rem] py-3.5 text-body font-bold text-impact-red"
            />
          </Magnetic>
        </FadeUp>
      </div>
    </section>
  );
}
