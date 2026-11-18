import type { HomePage } from '@/content/types';
import { Button } from '@/components/ui/Button';

export type CtaBandProps = {
  cta: HomePage['cta'];
};

/**
 * CTA band section (SPEC §7 #7, matching Screenshot From 2026-11-18 14-36-34.png).
 * Sits inside FooterMotifStage so it shares one continuous red metallic + animated SVG motif
 * backdrop with the Footer below it.
 */
export function CtaBand({ cta }: CtaBandProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      data-cta-section
      className="relative z-10 pt-24 pb-20 text-paper lg:pt-32 lg:pb-28"
    >
      <div className="container-site text-center">
        <h2
          id="cta-heading"
          className="font-display text-cta leading-[1.08] font-bold tracking-tight text-paper"
        >
          {cta.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="mx-auto mt-5 max-w-[54ch] text-body leading-snug font-medium text-paper/95">
          {cta.body}
        </p>

        <div className="mt-9">
          <Button
            link={cta.button}
            size="md"
            className="min-w-[14.5rem] py-3.5 text-body font-bold text-impact-red"
          />
        </div>
      </div>
    </section>
  );
}
