import { useRef, type ReactNode } from 'react';
import type { ImageAsset } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { usePanelReveal } from './usePanelReveal';

export type CampaignPanelProps = {
  id: string;
  /** Panel background + text colour classes. */
  toneClassName: string;
  /** Logo, headline and copy (mark blocks with data-pop / data-reveal for the entrance). */
  children: ReactNode;
  poster: ImageAsset;
};

/**
 * Full-colour campaign panel (Rotary Cancer Run, Run for the Nile): copy on the left, the campaign
 * poster on the right. Desktop proportions follow the 1274px design column (copy 45%, poster 32%);
 * phones stack the poster under the copy.
 */
export function CampaignPanel({ id, toneClassName, children, poster }: CampaignPanelProps) {
  const ref = useRef<HTMLElement | null>(null);
  usePanelReveal(ref);

  return (
    <article
      ref={ref}
      aria-labelledby={`${id}-title`}
      className={`flex flex-col gap-10 px-6 py-10 sm:px-12 sm:py-14 md:flex-row md:items-center md:gap-8 md:px-[6.3%] md:py-[2.6%] md:pr-[3.5%] ${toneClassName}`}
    >
      {/* Widths are of the padded content box: 50% / 35.5% = the design's 45% / 32% of the panel. */}
      <div className="md:w-[58%] md:py-8 lg:w-[50%] lg:py-0">{children}</div>

      <div
        data-poster
        className="mx-auto w-full max-w-[24rem] overflow-hidden md:mx-0 md:ml-auto md:w-[38%] md:max-w-none lg:w-[35.5%]"
      >
        <div data-poster-img className="will-change-transform">
          <Img
            image={poster}
            sizes="(min-width: 1024px) 21vw, (min-width: 768px) 32vw, 24rem"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </article>
  );
}
