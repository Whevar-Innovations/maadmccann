import { useRef } from 'react';
import type { CsrService, CsrServiceIcon } from '@/content/static/csr';
import brandingIdentitySrc from '@/assets/svg/csr/branding-identity.svg';
import campaignStrategySrc from '@/assets/svg/csr/campaign-strategy.svg';
import communityEngagementSrc from '@/assets/svg/csr/community-engagement.svg';
import digitalContentSrc from '@/assets/svg/csr/digital-content.svg';
import digitalStorytellingSrc from '@/assets/svg/csr/digital-storytelling.svg';
import eventExperienceSrc from '@/assets/svg/csr/event-experience.svg';
import experientialMarketingSrc from '@/assets/svg/csr/experiential-marketing.svg';
import mediaPrSrc from '@/assets/svg/csr/media-pr.svg';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { DUR, EASE, SCROLL } from '@/motion/tokens';
import { CSR_RED } from './styles';

const ICONS: Record<CsrServiceIcon, string> = {
  'campaign-strategy': campaignStrategySrc,
  'experiential-marketing': experientialMarketingSrc,
  'media-pr': mediaPrSrc,
  'digital-content': digitalContentSrc,
  'branding-identity': brandingIdentitySrc,
  'event-experience': eventExperienceSrc,
  'community-engagement': communityEngagementSrc,
  'digital-storytelling': digitalStorytellingSrc,
};

/** Idle float: tiny drift with offset periods so the grid never moves in unison. */
const FLOAT = { y: 4, rotate: 1.5, baseDur: 2.8, durStep: 0.45, delayStep: 0.35 } as const;

export type CsrServicesProps = {
  id: string;
  title: string;
  services: readonly CsrService[];
};

/**
 * "WHAT WE DO FOR …" icon grid.
 * Entrance: the title rises, each icon pops in with a slight tilt (back.out), its copy rises after it.
 * Idle: icons drift ~4px on slow, offset sine loops; paused while the grid is off screen.
 * Hover: the icon lifts a little (CSS, on its own element so it never fights the GSAP transforms).
 * Reduced motion: plain fade, no idle loop.
 */
export function CsrServices({ id, title, services }: CsrServicesProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const heading = root.querySelector<HTMLElement>('[data-services-title]');
      const icons = Array.from(root.querySelectorAll<HTMLElement>('[data-icon]'));
      const floats = Array.from(root.querySelectorAll<HTMLElement>('[data-icon-float]'));
      const copy = root.querySelectorAll<HTMLElement>('[data-copy]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          [heading, icons, copy],
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            scrollTrigger: { trigger: root, start: SCROLL.start, once: true },
          },
        );
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;
          const k = isMobile ? 0.5 : 1;

          if (heading) {
            gsap.fromTo(
              heading,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: DUR.text,
                ease: EASE.out,
                scrollTrigger: { trigger: root, start: SCROLL.start, once: true },
              },
            );
          }

          // Icons + copy: batched so items entering together stagger in reading order.
          gsap.set(icons, { opacity: 0, scale: 0.7, rotate: -8, y: 12 * k });
          gsap.set(copy, { opacity: 0, y: 20 * k });
          const items = Array.from(root.querySelectorAll<HTMLElement>('[data-service]'));
          const batch = ScrollTrigger.batch(items, {
            start: 'top 90%',
            once: true,
            onEnter: (els) => {
              const enter = els as HTMLElement[];
              const ic = enter.map((el) => el.querySelector('[data-icon]'));
              const cp = enter.map((el) => el.querySelector('[data-copy]'));
              gsap.to(ic, {
                opacity: 1,
                scale: 1,
                rotate: 0,
                y: 0,
                duration: 1,
                stagger: 0.12,
                delay: 0.1,
                ease: 'back.out(1.6)',
              });
              gsap.to(cp, {
                opacity: 1,
                y: 0,
                duration: DUR.text,
                stagger: 0.12,
                delay: 0.25,
                ease: EASE.out,
              });
            },
          });

          // Idle float, on an inner wrapper so it composes with the entrance transforms above.
          const loops = floats.map((el, i) =>
            gsap.to(el, {
              y: -FLOAT.y,
              rotate: i % 2 === 0 ? FLOAT.rotate : -FLOAT.rotate,
              duration: FLOAT.baseDur + (i % 4) * FLOAT.durStep,
              delay: i * FLOAT.delayStep,
              ease: EASE.float,
              yoyo: true,
              repeat: -1,
              paused: true,
            }),
          );
          const visibility = ScrollTrigger.create({
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => loops.forEach((t) => (self.isActive ? t.play() : t.pause())),
          });

          return () => {
            batch.forEach((b) => b.kill());
            visibility.kill();
          };
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-labelledby={`${id}-services-title`}
      className="pt-12 pb-16 sm:pt-14 sm:pb-20 lg:pt-[3.3vw] lg:pb-[7vw]"
    >
      <h3
        id={`${id}-services-title`}
        className={`overflow-hidden text-center font-display text-[clamp(0.95rem,0.9375vw,1.3rem)] leading-[1.2] font-bold tracking-[0.01em] uppercase ${CSR_RED}`}
      >
        <span data-services-title className="block will-change-transform">
          {title}
        </span>
      </h3>

      <ul className="mt-10 grid gap-y-10 sm:mt-12 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-[3.6vw] lg:gap-x-0 lg:gap-y-[2.9vw] lg:pr-[5.3%] lg:pl-[6.3%]">
        {services.map((service) => (
          <li
            key={service.icon}
            data-service
            className="group grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[24%_minmax(0,1fr)] lg:gap-x-[7.6%]"
          >
            {/* No permanent will-change: GSAP promotes these only while they animate, so idle
                icons don't each hold a GPU layer (measurably smoother scrolling on phones). */}
            <div data-icon>
              <div data-icon-float>
                <img
                  src={ICONS[service.icon]}
                  alt=""
                  width={134}
                  height={107}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[5/4] h-auto w-full object-contain transition-[translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.06]"
                />
              </div>
            </div>

            <div data-copy>
              <h4 className="text-[clamp(1rem,0.885vw,1.22rem)] leading-[1.3] font-bold">
                {service.title}
              </h4>
              <p className="mt-2 max-w-[20em] text-[clamp(0.8125rem,0.78vw,1.08rem)] leading-[1.4] font-medium lg:mt-[0.7vw]">
                {service.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
