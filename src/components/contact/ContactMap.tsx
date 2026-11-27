import { useRef, useState } from 'react';
import type { ContactPage } from '@/content/types';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { CONTACT, DUR, EASE, SCROLL } from '@/motion/tokens';

export type ContactMapProps = { map: ContactPage['map'] };

/**
 * Google map straddling the graphite/black seam (bg-contact-split). The frame opens out from the
 * centre as it scrolls in, the map settling from a slight zoom; reduced motion fades it in.
 * A click shield sits over the map until it is clicked, so wheel and touch scrolling stay with the
 * page (Lenis) instead of zooming the map; moving the mouse away puts the shield back. Keyboard
 * users can still tab straight into the map.
 */
export function ContactMap({ map }: ContactMapProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame) return;
      const iframe = frame.querySelector('iframe');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          frame,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            ease: EASE.soft,
            scrollTrigger: { trigger: frame, start: SCROLL.start, once: true },
          },
        );
      });

      mm.add(MEDIA_QUERIES.motionOk, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: frame, start: SCROLL.start, once: true },
        });
        tl.fromTo(
          frame,
          { clipPath: CONTACT.mapClipFrom },
          { clipPath: CONTACT.mapClipTo, duration: DUR.media, ease: EASE.inOut },
          0,
        );
        if (iframe) {
          tl.fromTo(
            iframe,
            { scale: CONTACT.mapScaleFrom },
            { scale: 1, duration: DUR.media, ease: EASE.out },
            0,
          );
        }
      });
    },
    { scope: frameRef },
  );

  return (
    <section aria-label={map.title} className="bg-contact-split py-14 sm:py-20 lg:py-[clamp(6rem,9.5vw,15.2rem)]">
      <div className="container-wide">
        <div
          ref={frameRef}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setActive(false);
          }}
          className="relative aspect-[4/5] overflow-hidden rounded-xl bg-placeholder sm:aspect-[16/10] lg:aspect-[1594/724]"
        >
          <iframe
            src={map.embedUrl}
            title={map.title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
          {!active && (
            <div
              aria-hidden="true"
              onClick={() => setActive(true)}
              className="absolute inset-0 cursor-pointer"
            />
          )}
        </div>
      </div>
    </section>
  );
}
