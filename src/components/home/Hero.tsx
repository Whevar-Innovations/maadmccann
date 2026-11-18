import type { HomePage } from '@/content/types';
import { Link } from '@/components/ui/Link';
import { Trophies } from './Trophies';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';
import aPatternSrc from '@/assets/svg/a-pattern.svg';

export type HeroProps = {
  hero: HomePage['hero'];
};

/**
 * Hero section (SPEC §7 #2).
 * Left: 3-line display headline, subheading (max 52ch), VIEW OUR WORK link with circle-arrow icon.
 * Right: 3 trophies in a triangle over the inverted-A motif.
 * Bottom: ghosted TRUTH WELL TOLD cropped by the bottom edge of the section.
 */
export function Hero({ hero }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      data-hero-section
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-crimson-950 pt-28 text-paper lg:pt-32"
    >
      {/* Background metallic red image */}
      <img
        src={heroBgSrc}
        alt=""
        width={1922}
        height={1674}
        fetchPriority="high"
        decoding="async"
        data-hero-bg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Subtle crimson depth vignette matching design */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-crimson-950/35 via-transparent to-crimson-950/75"
      />

      {/* Inverted-A motif behind the trophies */}
      <img
        src={aPatternSrc}
        alt=""
        width={937}
        height={934}
        aria-hidden="true"
        data-hero-motif
        className="pointer-events-none absolute top-0 right-[-8%] h-[78%] w-auto max-w-none opacity-15 mix-blend-soft-light select-none lg:right-[4%] lg:h-[88%]"
      />

      {/* Main hero content grid */}
      <div className="container-site relative z-20 my-auto grid items-center gap-12 pt-6 pb-16 md:grid-cols-12 lg:gap-8 lg:py-12">
        {/* Left column: Headline, subheading, VIEW OUR WORK link */}
        <div className="space-y-6 md:col-span-6 lg:col-span-6 lg:space-y-8">
          <h1
            id="hero-heading"
            data-hero-headline
            className="font-display text-hero font-bold tracking-display text-paper uppercase"
          >
            {hero.headlineLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span data-hero-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-subheading
            className="max-w-[52ch] text-body font-medium text-paper/90"
          >
            {hero.subheading}
          </p>

          <div data-hero-cta className="pt-2">
            <Link
              href={hero.cta.href}
              external={hero.cta.external}
              className="group inline-flex items-center gap-4 font-accent text-accent font-medium tracking-[0.08em] text-paper uppercase"
            >
              <span>{hero.cta.label}</span>
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-paper/75 transition-transform duration-300 group-hover:translate-x-1"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Right column: Three Silverback Awards trophies */}
        <div className="md:col-span-6 lg:col-span-6">
          <Trophies awards={hero.awards} />
        </div>
      </div>

      {/* Bottom ghosted text: TRUTH WELL TOLD, cropped by the section bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-10 -mt-10 overflow-hidden select-none lg:-mt-20"
      >
        <p
          data-hero-ghost
          className="translate-y-[22%] text-center font-display text-ghost leading-[0.82] font-bold tracking-display whitespace-nowrap text-crimson-950/55 uppercase"
        >
          {hero.ghostText}
        </p>
      </div>
    </section>
  );
}
