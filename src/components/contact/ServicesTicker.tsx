import { useRef } from 'react';
import type { ContactPage } from '@/content/types';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { CONTACT, DUR, EASE, SCROLL } from '@/motion/tokens';

export type ServicesTickerProps = {
  services: ContactPage['services'];
  label: string;
};

/**
 * Copies of the list in the track. The loop moves the track by half its width, so half of them
 * (two lists) must cover the widest viewport (2560) for the loop to never show a gap.
 */
const COPIES = 4;

/**
 * Crimson services ticker under the Contact hero ("● Media ● Creative ● …").
 * Motion: a constant linear loop (xPercent -50 over two identical halves, so it is seamless at any
 * width) that only runs while on screen and slows under a fine pointer. Reduced motion: no loop,
 * the single list wraps centred and fades in. Only the first copy is exposed to assistive tech.
 */
export function ServicesTicker({ services, label }: ServicesTickerProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          track,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            ease: EASE.soft,
            scrollTrigger: { trigger: section, start: SCROLL.start, once: true },
          },
        );
      });

      mm.add({ motionOk: MEDIA_QUERIES.motionOk, fine: MEDIA_QUERIES.finePointer }, (context) => {
        const { motionOk, fine } = context.conditions ?? {};
        if (!motionOk) return;

        // Duration from one half's width, so the speed is the same at every viewport.
        const half = track.scrollWidth / 2;
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: half / CONTACT.tickerPxPerSec,
          ease: EASE.linear,
          repeat: -1,
          paused: true,
        });

        const active = ScrollTrigger.create({
          trigger: section,
          start: CONTACT.tickerActiveStart,
          end: CONTACT.tickerActiveEnd,
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
        if (active.isActive) loop.play();

        if (!fine) return undefined;
        const slow = () =>
          gsap.to(loop, { timeScale: CONTACT.tickerHoverScale, duration: DUR.ui, ease: EASE.soft });
        const resume = () => gsap.to(loop, { timeScale: 1, duration: DUR.ui, ease: EASE.soft });
        section.addEventListener('pointerenter', slow);
        section.addEventListener('pointerleave', resume);
        return () => {
          section.removeEventListener('pointerenter', slow);
          section.removeEventListener('pointerleave', resume);
        };
      });
    },
    { scope: sectionRef, dependencies: [services] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className="overflow-hidden bg-crimson-800 py-[clamp(1.75rem,2.9vw,4.65rem)] text-lead font-medium text-paper"
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform motion-reduce:w-full motion-reduce:justify-center motion-reduce:will-change-auto"
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0 ? true : undefined}
            className={`flex shrink-0 items-center ${
              copy > 0
                ? 'motion-reduce:hidden'
                : 'motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:px-5'
            }`}
          >
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-x-[clamp(2.5rem,3.9vw,6.24rem)] pr-[clamp(2.5rem,3.9vw,6.24rem)] whitespace-nowrap motion-reduce:gap-x-3 motion-reduce:px-3"
              >
                <span aria-hidden="true" className="size-[0.62em] shrink-0 rounded-full bg-paper" />
                {service}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
