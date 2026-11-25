import { useRef } from 'react';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { EASE } from '@/motion/tokens';
import crowdSrc from '@/assets/svg/services/crowd.svg';
import tvSrc from '@/assets/svg/services/tv.svg';
import presenterSrc from '@/assets/svg/services/presenter.svg';
import megaphoneSrc from '@/assets/svg/services/megaphone.svg';
import communicationSrc from '@/assets/svg/services/communication.svg';
import microphoneSrc from '@/assets/svg/services/microphone.svg';
import newspaperSrc from '@/assets/svg/services/newspaper.svg';
import radioSrc from '@/assets/svg/services/radio.svg';
import mobileSrc from '@/assets/svg/services/mobile.svg';
import internetSrc from '@/assets/svg/services/internet.svg';

/** Channel icons around the community, angles (deg, 0 = 3 o'clock, clockwise) measured from the design. */
const CHANNELS = [
  { src: tvSrc, label: 'Television', angle: -118 },
  { src: presenterSrc, label: 'News presenter', angle: -67 },
  { src: megaphoneSrc, label: 'Megaphone', angle: -28 },
  { src: communicationSrc, label: 'Interpersonal communication', angle: 2 },
  { src: microphoneSrc, label: 'Microphone', angle: 36 },
  { src: newspaperSrc, label: 'Newspaper', angle: 74 },
  { src: radioSrc, label: 'Radio', angle: 112 },
  { src: mobileSrc, label: 'Mobile', angle: 150 },
  { src: internetSrc, label: 'Internet', angle: -168 },
] as const;

const ORBIT_RADIUS = 34; // % of the diagram size (circle radius is 50%)
const ORBIT_SECONDS = 60; // one full revolution

/**
 * SBCC diagram: the community at the centre, surrounded by the channels used to reach it.
 * Scroll-in: ring draws on, community pops, channels fly out from the centre to their
 * orbit positions, then the ring keeps orbiting slowly (icons stay upright).
 */
export function SbccOrbit() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const ring = root.querySelector<SVGCircleElement>('[data-ring]');
      const center = root.querySelector<HTMLElement>('[data-center]');
      const icons = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-icon]'));
      const orbit = root.querySelector<HTMLElement>('[data-orbit]');
      const uprights = root.querySelectorAll<HTMLElement>('[data-orbit-upright]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.motionOk, () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        });

        if (ring) {
          tl.fromTo(ring, { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: EASE.SineInOut, autoRound: false }, 0)
            // drop the dash once drawn so no hairline seam is left at 12 o'clock
            .set(ring, { strokeDasharray: 'none' }, 1.6);
        }
        if (center) {
          tl.fromTo(center, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, 0.2);
        }
        tl.fromTo(
          icons,
          {
            opacity: 0,
            scale: 0.3,
            // start at the centre: offset each icon back towards the middle
            x: (i: number) => -Math.cos(((CHANNELS[i]?.angle ?? 0) * Math.PI) / 180) * root.offsetWidth * (ORBIT_RADIUS / 100),
            y: (i: number) => -Math.sin(((CHANNELS[i]?.angle ?? 0) * Math.PI) / 180) * root.offsetWidth * (ORBIT_RADIUS / 100),
          },
          { opacity: 1, scale: 1, x: 0, y: 0, duration: 1.1, stagger: 0.07 },
          0.45,
        );

        // Once landed, the channel ring orbits slowly around the community; each icon
        // counter-rotates at the same rate so it stays upright.
        const spin = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } });
        if (orbit) {
          spin
            .to(orbit, { rotation: 360, duration: ORBIT_SECONDS }, 0)
            .to(uprights, { rotation: -360, duration: ORBIT_SECONDS }, 0);
        }
        tl.add(() => spin.play());

        // Only spend frames on the spin while the diagram is on screen.
        const visibility = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            if (tl.progress() < 1) return;
            if (self.isActive) spin.play();
            else spin.pause();
          },
        });

        return () => {
          spin.kill();
          visibility.kill();
        };
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Community at the centre, reached through TV, news, megaphone, interpersonal communication, microphone, newspapers, radio, mobile and internet"
      className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[24rem]"
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <circle
          data-ring
          cx="50"
          cy="50"
          r="49.6"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.35"
          pathLength={1}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <img
        data-center
        src={crowdSrc}
        alt=""
        width={96}
        height={96}
        className="absolute top-1/2 left-1/2 w-[27%] -translate-x-1/2 -translate-y-1/2"
      />

      {/* Rotating ring of channels (the centre community stays still) */}
      <div data-orbit className="absolute inset-0">
        {CHANNELS.map(({ src, angle }) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <div
              key={src}
              data-orbit-icon
              className="absolute w-[13%]"
              style={{
                left: `${50 + Math.cos(rad) * ORBIT_RADIUS}%`,
                top: `${50 + Math.sin(rad) * ORBIT_RADIUS}%`,
                translate: '-50% -50%',
              }}
            >
              <img data-orbit-upright src={src} alt="" width={48} height={48} className="block h-auto w-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
