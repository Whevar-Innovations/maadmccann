import { useRef } from 'react';
import type { ImageAsset } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { EASE, HERO_TIMELINE } from '@/motion/tokens';

/**
 * Triangle points, relative to the stage (xPercent / yPercent = % of the stage box,
 * scaled around the bottom-centre of the stage, where the front trophy's base sits).
 * Default values reproduce the original static composition:
 *  - back trophies were 34.5% wide vs 41.5% front  -> scale 0.83
 *  - back-left centre at 18.25% of the stage (-31.75% from centre), back-right mirrored
 *  - back trophies sat 9% higher (bottom-[9%])
 * Tweak these to move the triangle points.
 */
export const TRIANGLE_POINTS = {
  backLeft: { xPercent: -31.75, yPercent: -9, zIndex: 10 },
  backRight: { xPercent: 31.75, yPercent: -9, zIndex: 20 },
  front: { xPercent: 0, yPercent: 0, zIndex: 30 },
} as const;

type PointName = keyof typeof TRIANGLE_POINTS;

/** Starting point per image index: [back-left, back-right, front]. */
const START_POINTS: readonly PointName[] = ['backLeft', 'backRight', 'front'];

/** Loop direction: front -> back-right -> back-left -> front. */
const NEXT_POINT: Record<PointName, PointName> = {
  front: 'backRight',
  backRight: 'backLeft',
  backLeft: 'front',
};

export type AwardsTriangleLoopProps = {
  /** Trophy images in starting order: [back-left, back-right, front]. Only the first 3 are used. */
  images: readonly ImageAsset[];
  /** Gate the loop (e.g. wait for the page loader). Default true. */
  play?: boolean;
  /** Seconds before the loop starts (the first point is then held for `holdDuration`). */
  startDelay?: number;
  /** Seconds each move between points takes. */
  moveDuration?: number;
  /** Seconds each trophy rests at a point. */
  holdDuration?: number;
  /** GSAP ease for the moves. */
  ease?: string;
  /** Scale of the two back points (front is 1). */
  backScale?: number;
  /** CSS brightness of the two back points (front is 1). */
  backBrightness?: number;
  /** Subtle staggered idle up/down bob. Disable when a parent already animates `[data-trophy-float]`. */
  bob?: boolean;
  className?: string;
};

/**
 * Three award trophies that continuously rotate around a triangle (SPEC §8.4).
 * Each trophy lives in a stage-sized "orbit" wrapper, so xPercent/yPercent are relative to
 * the stage and the triangle scales with its container. Inside, the original
 * entrance -> parallax -> float wrappers are kept so Hero's existing animations still apply.
 */
export function AwardsTriangleLoop({
  images,
  play = true,
  startDelay = HERO_TIMELINE.idleStart,
  moveDuration = 1.2,
  holdDuration = 2,
  ease = 'power3.inOut',
  backScale = 0.83,
  backBrightness = 0.85,
  bob = true,
  className = '',
}: AwardsTriangleLoopProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const pointVars = (name: PointName) => {
    const isFront = name === 'front';
    const { xPercent, yPercent } = TRIANGLE_POINTS[name];
    return {
      xPercent,
      yPercent,
      scale: isFront ? 1 : backScale,
      filter: `brightness(${isFront ? 1 : backBrightness})`,
    };
  };

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const orbits = gsap.utils.toArray<HTMLElement>('[data-trophy-orbit]', stage);
      const floats = gsap.utils.toArray<HTMLElement>('[data-trophy-float]', stage);

      // Resting layout (also the reduced-motion layout).
      orbits.forEach((orbit, i) => {
        const name = START_POINTS[i] ?? 'front';
        gsap.set(orbit, {
          ...pointVars(name),
          zIndex: TRIANGLE_POINTS[name].zIndex,
          transformOrigin: '50% 100%',
        });
      });

      const mm = gsap.matchMedia();

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk || !play) return;

          if (bob) {
            floats.forEach((floatEl, i) => {
              gsap.to(floatEl, {
                y: (isMobile ? -3 : -6),
                duration: HERO_TIMELINE.trophyFloatDurs[i] ?? 3.8,
                delay: HERO_TIMELINE.trophyFloatDelays[i] ?? 0,
                ease: EASE.float,
                yoyo: true,
                repeat: -1,
              });
            });
          }

          // One full cycle = 3 steps (hold, then move); every trophy is back at its start point.
          const tl = gsap.timeline({ repeat: -1, delay: startDelay });
          const current = START_POINTS.slice(0, orbits.length);

          for (let step = 0; step < 3; step += 1) {
            const moveAt = step * (holdDuration + moveDuration) + holdDuration;
            orbits.forEach((orbit, i) => {
              const target = NEXT_POINT[current[i] ?? 'front'];
              tl.to(
                orbit,
                { ...pointVars(target), duration: moveDuration, ease },
                moveAt,
              );
              // Swap stacking halfway through the move so trophies pass in front/behind correctly.
              tl.set(
                orbit,
                { zIndex: TRIANGLE_POINTS[target].zIndex },
                moveAt + moveDuration / 2,
              );
              current[i] = target;
            });
          }

          // Smoothly pause on hover, resume on leave.
          const onEnter = () =>
            gsap.to(tl, { timeScale: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
          const onLeave = () =>
            gsap.to(tl, { timeScale: 1, duration: 0.4, ease: 'power2.in', overwrite: true });

          stage.addEventListener('mouseenter', onEnter);
          stage.addEventListener('mouseleave', onLeave);
          return () => {
            stage.removeEventListener('mouseenter', onEnter);
            stage.removeEventListener('mouseleave', onLeave);
          };
        },
      );
    },
    {
      scope: stageRef,
      revertOnUpdate: true,
      dependencies: [
        play,
        startDelay,
        moveDuration,
        holdDuration,
        ease,
        backScale,
        backBrightness,
        bob,
      ],
    },
  );

  return (
    <div
      ref={stageRef}
      data-trophies-stage
      className={`relative mx-auto aspect-[1.15/1] w-full max-w-[780px] select-none ${className}`}
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

      {images.slice(0, 3).map((image, index) => (
        <div
          key={image.src}
          data-trophy-orbit={index}
          className="pointer-events-none absolute inset-0 origin-bottom will-change-transform"
          style={{ zIndex: TRIANGLE_POINTS[START_POINTS[index] ?? 'front'].zIndex }}
        >
          {/* Trophy box sits at the front point; the orbit wrapper moves it around the triangle */}
          <div className="absolute bottom-0 left-1/2 w-[41.5%] -translate-x-1/2">
            {/* Outer wrapper: entrance animation */}
            <div data-trophy-entrance className="origin-bottom">
              {/* Middle wrapper: pointer parallax */}
              <div data-trophy-parallax className="origin-bottom">
                {/* Inner wrapper: gentle vertical idle float */}
                <div data-trophy-float className="relative origin-bottom">
                  <Img
                    image={image}
                    priority
                    sizes="(min-width: 1024px) 330px, 42vw"
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
        </div>
      ))}
    </div>
  );
}
