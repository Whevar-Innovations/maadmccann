import { useEffect, useRef, useState } from 'react';
import type { HomePage } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { RevealImage } from '@/motion/RevealImage';
import { RevealText } from '@/motion/RevealText';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { DUR, EASE } from '@/motion/tokens';

export type ShowreelProps = {
  showreel: HomePage['showreel'];
};

function toEmbedVideoUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const muxWatchPrefix = 'https://player.mux.com/watch/';
  if (rawUrl.startsWith(muxWatchPrefix)) {
    const id = rawUrl.slice(muxWatchPrefix.length).split('?')[0];
    return `https://player.mux.com/${id}?autoplay=1`;
  }
  return rawUrl;
}

/**
 * Showreel section (SPEC §7 #3, §8.5 & §8.6).
 * - Heading and subheading use <RevealText>, poster uses <RevealImage>.
 * - WATCH circle follows the pointer inside the poster (lerped, desktop) and scales 1.15 on hover.
 * - Click opens a fullscreen video modal, locks Lenis scroll, traps focus, and closes on Esc.
 */
export function Showreel({ showreel }: ShowreelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const posterWrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const { stopScroll, startScroll } = useSmoothScroll();

  const embedUrl = toEmbedVideoUrl(showreel.videoUrl);

  useEffect(() => {
    if (!modalOpen) return;
    stopScroll();
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === 'Tab') {
        const dialog = document.getElementById('showreel-video-modal');
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, iframe, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      startScroll();
    };
  }, [modalOpen, stopScroll, startScroll]);

  useGSAP(
    () => {
      const wrap = posterWrapRef.current;
      const btn = triggerRef.current;
      if (!wrap || !btn) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          fine: MEDIA_QUERIES.finePointer,
          motionOk: MEDIA_QUERIES.motionOk,
        },
        (context) => {
          const { fine, motionOk } = context.conditions ?? {};
          if (!fine || !motionOk) return;

          const xTo = gsap.quickTo(btn, 'x', {
            duration: DUR.spotlight,
            ease: EASE.soft,
          });
          const yTo = gsap.quickTo(btn, 'y', {
            duration: DUR.spotlight,
            ease: EASE.soft,
          });

          const onPointerMove = (e: PointerEvent) => {
            const rect = wrap.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
            xTo(dx);
            yTo(dy);
          };

          const onPointerLeave = () => {
            xTo(0);
            yTo(0);
          };

          wrap.addEventListener('pointermove', onPointerMove);
          wrap.addEventListener('pointerleave', onPointerLeave);

          return () => {
            wrap.removeEventListener('pointermove', onPointerMove);
            wrap.removeEventListener('pointerleave', onPointerLeave);
          };
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showreel-heading"
      data-showreel-section
      className="bg-ink py-20 text-paper lg:py-28"
    >
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <RevealText
            as="h2"
            id="showreel-heading"
            className="font-display text-showreel font-bold tracking-tight text-paper"
          >
            {showreel.heading}
          </RevealText>

          <RevealText
            as="p"
            delay={0.1}
            className="mt-3 text-sub font-semibold text-paper/90"
          >
            {showreel.subheading}
          </RevealText>
        </div>

        <div
          ref={posterWrapRef}
          data-showreel-poster-wrap
          onClick={() => setModalOpen(true)}
          className="relative mt-12 cursor-pointer overflow-hidden lg:mt-16"
        >
          <RevealImage>
            <Img
              image={showreel.poster}
              sizes="(min-width: 1440px) 1296px, 92vw"
              className="aspect-video h-auto w-full object-cover"
            />
          </RevealImage>

          {/* Outlined circle labelled WATCH in the centre */}
          <button
            ref={triggerRef}
            type="button"
            data-showreel-trigger
            data-video-url={showreel.videoUrl}
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            aria-label={`Watch showreel: ${showreel.heading}`}
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="absolute top-1/2 left-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-paper/95 bg-transparent text-small font-semibold tracking-[0.08em] text-paper uppercase transition-[background-color,color,scale] duration-300 hover:scale-115 hover:bg-paper hover:text-ink sm:h-36 sm:w-36 lg:h-44 lg:w-44"
          >
            WATCH
          </button>
        </div>
      </div>

      {/* Fullscreen Showreel Video Modal (SPEC §7 #3 & §8.6) */}
      {modalOpen && (
        <div
          id="showreel-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={showreel.heading}
          onClick={() => {
            setModalOpen(false);
            triggerRef.current?.focus();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8 lg:p-14"
        >
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close showreel video"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(false);
              triggerRef.current?.focus();
            }}
            className="fixed top-6 right-6 z-50 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-paper/40 bg-ink/70 text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-video w-full max-w-6xl overflow-hidden bg-black shadow-2xl"
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={showreel.heading}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-body text-paper/80">
                Showreel video unavailable
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
