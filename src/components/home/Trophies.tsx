import type { Award } from '@/content/types';
import { Img } from '@/components/ui/Img';

export type TrophiesProps = {
  awards: Award[];
};

const SLOT_CLASSES = [
  // Slot 0: Back-left (Digital - Social Media & Influencer) — ~85% of front, higher, left
  'left-[1%] bottom-[9%] z-10 w-[34.5%]',
  // Slot 1: Back-right (Creative Director of the Year) — ~85% of front, higher, right
  'right-[1%] bottom-[9%] z-10 w-[34.5%]',
  // Slot 2: Front-center (Grand Prix) — 100%, lowest, overlaps back trophies
  'left-1/2 -translate-x-1/2 bottom-0 z-20 w-[41.5%]',
] as const;

/**
 * Three Silverback Awards trophies arranged in a triangle (SPEC §7 #2 & §8.4).
 * Matches Screenshot From 2026-11-18 14-54-05.png:
 * - DOM order & entrance order: [back-left, back-right, front].
 * - Three nested wrappers per trophy (entrance -> parallax -> float) with origin-bottom
 *   so transforms never fight.
 * - No rectangular shine overlay over the transparent WebP bounds (prevents rectangular shimmer).
 */
export function Trophies({ awards }: TrophiesProps) {
  return (
    <div
      data-trophies-stage
      className="relative mx-auto aspect-[1.15/1] w-full max-w-[780px] select-none"
    >
      {/* Soft gold radial glow behind the trio (SPEC §8.4) */}
      <div
        data-trophies-glow
        aria-hidden="true"
        className="pointer-events-none absolute inset-[14%] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, var(--color-gold-500) 0%, rgba(217, 169, 58, 0.22) 45%, transparent 72%)',
        }}
      />

      {awards.slice(0, 3).map((award, index) => {
        const slotClass = SLOT_CLASSES[index] ?? SLOT_CLASSES[0];
        return (
          <div
            key={award.id}
            data-trophy-slot={index}
            className={`absolute ${slotClass}`}
          >
            {/* Outer wrapper: entrance animation */}
            <div data-trophy-entrance className="origin-bottom">
              {/* Middle wrapper: pointer parallax */}
              <div data-trophy-parallax className="origin-bottom">
                {/* Inner wrapper: gentle vertical idle float */}
                <div data-trophy-float className="relative origin-bottom">
                  <Img
                    image={award.image}
                    priority
                    sizes="(min-width: 1024px) 280px, 36vw"
                    className="h-auto w-full drop-shadow-[0_20px_24px_rgba(0,0,0,0.62)]"
                  />
                </div>
              </div>
            </div>

            {/* Contact shadow ellipse under each trophy base */}
            <div
              data-trophy-shadow
              aria-hidden="true"
              className="mx-auto -mt-3 h-5 w-[88%] rounded-full bg-black/70 blur-md"
            />
          </div>
        );
      })}
    </div>
  );
}
