import { useRef, type ReactNode } from 'react';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { DUR, EASE, SCROLL, SERVICE_CARD } from '@/motion/tokens';

export type ServiceCardProps = {
  id: string;
  tone: 'dark' | 'red';
  className?: string;
  children: ReactNode;
  /** aria-labelledby target; defaults to `${id}-title`. */
  labelledBy?: string;
};

const TONE = {
  dark: 'bg-graphite',
  red: 'bg-service-red',
} as const;

/**
 * Rounded service card with a scroll-triggered entrance:
 * 1. The card rises and un-clips upward from its bottom edge.
 * 2. Children marked `[data-reveal]` rise and fade in, staggered.
 * 3. Children marked `[data-pop]` scale in with a soft overshoot.
 * Reduced motion: plain fade.
 */
export function ServiceCard({ id, tone, className = '', children, labelledBy }: ServiceCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const card = ref.current;
      if (!card) return;
      const reveals = card.querySelectorAll<HTMLElement>('[data-reveal]');
      const pops = card.querySelectorAll<HTMLElement>('[data-pop]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            scrollTrigger: { trigger: card, start: SCROLL.start, once: true },
          },
        );
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;
          const k = isMobile ? 0.5 : 1;

          const tl = gsap.timeline({
            defaults: { ease: EASE.out },
            scrollTrigger: { trigger: card, start: SERVICE_CARD.start, once: true },
          });

          tl.fromTo(
            card,
            { y: SERVICE_CARD.rise * k, opacity: 0, clipPath: SERVICE_CARD.clipFrom },
            {
              y: 0,
              opacity: 1,
              clipPath: SERVICE_CARD.clipTo,
              duration: SERVICE_CARD.duration,
              clearProps: 'clipPath',
            },
            0,
          );

          // Inner content reveals as each block actually scrolls into view (cards can be taller
          // than the viewport), batched so neighbours that enter together still stagger.
          const batches: ScrollTrigger[] = [];
          if (reveals.length) {
            gsap.set(reveals, { y: SERVICE_CARD.itemRise * k, opacity: 0 });
            batches.push(
              ...ScrollTrigger.batch(reveals, {
                start: SERVICE_CARD.itemStart,
                once: true,
                onEnter: (els) =>
                  gsap.to(els, {
                    y: 0,
                    opacity: 1,
                    duration: DUR.text,
                    stagger: SERVICE_CARD.itemStagger,
                    delay: SERVICE_CARD.itemDelay,
                    ease: EASE.out,
                  }),
              }),
            );
          }
          if (pops.length) {
            gsap.set(pops, { scale: SERVICE_CARD.popScaleFrom, opacity: 0 });
            batches.push(
              ...ScrollTrigger.batch(pops, {
                start: SERVICE_CARD.itemStart,
                once: true,
                onEnter: (els) =>
                  gsap.to(els, {
                    scale: 1,
                    opacity: 1,
                    duration: SERVICE_CARD.popDuration,
                    stagger: SERVICE_CARD.popStagger,
                    delay: SERVICE_CARD.popDelay,
                    ease: EASE.popStrong,
                  }),
              }),
            );
          }
          return () => batches.forEach((b) => b.kill());
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy ?? `${id}-title`}
      className={`scroll-mt-28 rounded-2xl text-paper ${TONE[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

/* ---------- Typography primitives shared by every card ---------- */

export function CardTitle({
  id,
  lines,
  className = '',
}: {
  id: string;
  lines: readonly string[];
  className?: string;
}) {
  return (
    <h2
      id={id}
      data-reveal
      className={`font-display text-[clamp(1.5rem,1.75vw,2.15rem)] leading-[1.05] font-bold tracking-[-0.01em] uppercase ${className}`}
    >
      {lines.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
    </h2>
  );
}

export function Tagline({
  lines,
  className = '',
}: {
  lines: readonly string[];
  className?: string;
}) {
  return (
    <p
      data-reveal
      className={`text-[clamp(1.05rem,1.2vw,1.45rem)] leading-[1.2] font-semibold ${className}`}
    >
      {lines.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
    </p>
  );
}

export function Body({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p
      data-reveal
      className={`text-[clamp(0.875rem,0.82vw,1.02rem)] leading-[1.5] whitespace-pre-line text-paper/90 ${className}`}
    >
      {children}
    </p>
  );
}

/** White disc with a light grey ring, used for the Digital pills, Production list and Creative icons. */
export function RingCircle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-pop
      className={`flex aspect-square shrink-0 items-center justify-center rounded-full border-[6px] border-line bg-paper text-ink transition-[scale] duration-500 ease-brand hover:scale-[1.06] ${className}`}
    >
      {children}
    </div>
  );
}
