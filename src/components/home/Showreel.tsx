import type { HomePage } from '@/content/types';
import { Img } from '@/components/ui/Img';

export type ShowreelProps = {
  showreel: HomePage['showreel'];
};

/**
 * Showreel section (SPEC §7 #3, matching Screenshot From 2026-11-18 14-01-01.png).
 * Centred heading and subheading, then a full-width 16:9 video poster with an
 * outlined circle labelled WATCH in the centre.
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
            className="font-display text-showreel font-bold tracking-tight text-paper"
          >
            {showreel.heading}
          </h2>
          <p className="mt-3 text-sub font-semibold text-paper/90">
            {showreel.subheading}
          </p>
        </div>

        <div
          data-showreel-poster-wrap
          className="relative mt-12 overflow-hidden lg:mt-16"
        >
          <Img
            image={showreel.poster}
            sizes="(min-width: 1440px) 1296px, 92vw"
            className="aspect-video h-auto w-full object-cover"
          />

          {/* Outlined circle labelled WATCH in the centre */}
          <button
            type="button"
            data-showreel-trigger
            data-video-url={showreel.videoUrl}
            aria-label={`Watch showreel: ${showreel.heading}`}
            className="absolute top-1/2 left-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-paper/95 bg-transparent text-small font-semibold tracking-[0.08em] text-paper uppercase transition-colors duration-300 hover:bg-paper hover:text-ink sm:h-36 sm:w-36 lg:h-44 lg:w-44"
          >
            WATCH
          </button>
        </div>
      </div>
    </section>
  );
}
