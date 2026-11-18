import type { HomePage } from '@/content/types';
import { Img } from '@/components/ui/Img';

export type ShowreelProps = {
  showreel: HomePage['showreel'];
};

/**
 * Showreel section (SPEC §7 #3).
 * Centred heading and subheading, then a full-width 16:9 video poster with a 96px
 * outlined circle labelled WATCH in the centre.
 * (Fullscreen modal interaction is wired in Step 7.)
 */
export function Showreel({ showreel }: ShowreelProps) {
  return (
    <section
      aria-labelledby="showreel-heading"
      data-showreel-section
      className="bg-ink py-20 text-paper lg:py-28"
    >
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="showreel-heading"
            className="font-display text-showreel font-bold text-paper"
          >
            {showreel.heading}
          </h2>
          <p className="mt-3 text-sub font-semibold text-paper/85">
            {showreel.subheading}
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden lg:mt-14">
          <Img
            image={showreel.poster}
            sizes="(min-width: 1440px) 1296px, 92vw"
            className="aspect-video h-auto w-full object-cover"
          />

          {/* Subtle dark vignette for button legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ink/15"
          />

          {/* 96px (w-24 h-24) outlined circle labelled WATCH in the centre */}
          <button
            type="button"
            data-showreel-trigger
            data-video-url={showreel.videoUrl}
            aria-label={`Watch showreel: ${showreel.heading}`}
            className=" absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-paper/90 bg-ink/20 text-small font-semibold tracking-[0.14em] text-paper uppercase backdrop-blur-[2px] transition-colors duration-300 hover:bg-paper hover:text-ink"
          >
            WATCH
          </button>
        </div>
      </div>
    </section>
  );
}
