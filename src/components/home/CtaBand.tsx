import type { HomePage } from '@/content/types';
import { Button } from '@/components/ui/Button';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';
import lowerPatternSrc from '@/assets/svg/lower-background-pattern-dark.svg';

export type CtaBandProps = {
  cta: HomePage['cta'];
};

/**
 * CTA band section (SPEC §7 #7).
 * Centred two-line headline (sentence case), paragraph (max 60ch), white pill "Let’s Talk".
 * Uses the crimson background and lower-background-pattern-dark.svg as a faint overlay.
 */
export function CtaBand({ cta }: CtaBandProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      data-cta-section
      className="relative overflow-hidden bg-crimson-950 py-24 text-paper lg:py-36"
    >
      {/* Red metallic backdrop */}
      <img
        src={heroBgSrc}
        alt=""
        width={1922}
        height={1674}
        loading="lazy"
        decoding="async"
        data-cta-bg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Faint cultural line-art pattern overlay */}
      <img
        src={lowerPatternSrc}
        alt=""
        width={1922}
        height={1674}
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-25 mix-blend-multiply"
      />

      {/* Subtle crimson depth vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-crimson-950/30 via-transparent to-crimson-950/65"
      />

      <div className="container-site relative z-10 text-center">
        <h2
          id="cta-heading"
          className="font-display text-cta font-medium text-paper"
        >
          {cta.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="mx-auto mt-5 max-w-[60ch] text-body font-medium text-paper/90">
          {cta.body}
        </p>

        <div className="mt-9">
          <Button link={cta.button} size="md" className="min-w-[11rem] font-bold" />
        </div>
      </div>
    </section>
  );
}
