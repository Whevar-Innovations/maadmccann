import type { Award } from '@/content/types';
import { Img } from '@/components/ui/Img';

export type TrophiesProps = {
  awards: Award[];
};

const SLOT_CLASSES = [
  // Slot 0: Back-left (Digital - Social Media & Influencer) — ~85% of front, higher, left
  'left-[2%] bottom-[8%] z-10 w-[34%]',
  // Slot 1: Back-right (Creative Director of the Year) — ~85% of front, higher, right
  'right-[2%] bottom-[8%] z-10 w-[34%]',
  // Slot 2: Front-center (Grand Prix) — 100%, lowest, overlaps back trophies
  'left-1/2 -translate-x-1/2 bottom-0 z-20 w-[40%]',
] as const;

/**
 * Three Silverback Awards trophies arranged in a triangle (SPEC §7 #2 & §8.4).
 * DOM order: [back-left, back-right, front].
 * Three nested wrappers per trophy (entrance -> parallax -> float) with origin-bottom
 * so Step 5's GSAP transforms never conflict.
 */
export function Trophies({ awards }: TrophiesProps) {
  return (
    <div
      data-trophies-stage
      className="relative mx-auto aspect-[5/4] w-full max-w-[680px] select-none"
    >
      {/* Soft gold radial glow behind the trio (SPEC §8.4) */}
      <div
        data-trophies-glow
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-full opacity-75 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, var(--color-gold-500) 0%, rgba(217, 169, 58, 0.25) 45%, transparent 72%)',
        }}
      />

      {awards.slice(0, 3).map((award, index) => {
        const slotClass = SLOT_CLASSES[index] ?? SLOT_CLASSES[0];
        return (
          <div
            key={award.id}
            data-trophy-slot={index}
            className={` absolute ${slotClass}`}
          >
            {/* Outer wrapper: entrance animation */}
            <div data-trophy-entrance className="origin-bottom">
              {/* Middle wrapper: pointer parallax */}
              <div data-trophy-parallax className="origin-bottom">
                {/* Inner wrapper: idle float + shine */}
                <div data-trophy-float className="relative origin-bottom">
                  <Img
                    image={award.image}
                    priority
                    sizes="(min-width: 1024px) 240px, 34vw"
                    className="h-auto w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
                  />
                </div>
              </div>
            </div>

            {/* Soft contact shadow ellipse under each trophy base */}
            <div
              data-trophy-shadow
              aria-hidden="true"
              className="mx-auto -mt-2 h-4 w-[82%] rounded-full bg-black/55 blur-md"
            />
          </div>
        );
      })}
    </div>
  );
}
