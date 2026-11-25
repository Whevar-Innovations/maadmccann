import { useEffect, useRef, useState } from 'react';
import type { HomePage } from '@/content/types';
import MuxPlayer from '@mux/mux-player-react';
import type MuxPlayerElement from '@mux/mux-player';
import { Img } from '@/components/ui/Img';
import { PlayButton } from '@/components/ui/PlayButton';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { RevealImage } from '@/motion/RevealImage';
import { RevealText } from '@/motion/RevealText';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { EASE, SHOWREEL } from '@/motion/tokens';

export type ShowreelProps = {
  showreel: HomePage['showreel'];
};

function toMuxPlaybackId(rawUrl: string): string | null {
  const m = rawUrl.match(/^https:\/\/player\.mux\.com\/(?:watch\/)?([A-Za-z0-9]+)/);
  return m?.[1] ?? null;
}

/**
 * Showreel section (SPEC §7 #3, §8.5 & §8.6).
 * - Heading and subheading use <RevealText>, poster uses <RevealImage>.
 * - The poster frame widens to 90vw on scroll; the play button stays fixed at its centre.
 * - Click opens a fullscreen video modal, locks Lenis scroll, traps focus, and closes on Esc.
 */
export function Showreel({ showreel }: ShowreelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const posterWrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const { stopScroll, startScroll } = useSmoothScroll();

  const playbackId = toMuxPlaybackId(showreel.videoUrl);
  const playerRef = useRef<MuxPlayerElement | null>(null);
  const [needsUnmute, setNeedsUnmute] = useState(false);

  /**
   * Opens the modal and starts playback WITH sound synchronously inside the click,
   * so browsers (incl. Safari/iOS) treat it as user-initiated. The player stays mounted
   * (hidden) so it exists at click time. If sound is still refused, play muted and
   * show a "Tap for sound" pill.
   */
  const openModal = () => {
    setNeedsUnmute(false);
    setModalOpen(true);
    const player = playerRef.current;
    if (!player) return;
    player.muted = false;
    player.volume = 1;
    const attempt = player.play();
    attempt?.catch((err: unknown) => {
      if ((err as DOMException)?.name !== 'NotAllowedError') return;
      player.muted = true;
      setNeedsUnmute(true);
      player.play()?.catch(() => {});
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    triggerRef.current?.focus();
  };

  const unmute = () => {
    const player = playerRef.current;
    if (!player) return;
    player.muted = false;
    player.volume = 1;
    setNeedsUnmute(false);
  };

  // Hide the "Tap for sound" pill if the viewer unmutes via the player's own controls.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !needsUnmute) return;
    const onVolume = () => {
      if (!player.muted) setNeedsUnmute(false);
    };
    player.addEventListener('volumechange', onVolume);
    return () => player.removeEventListener('volumechange', onVolume);
  }, [needsUnmute]);

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
          'button, mux-player, [tabindex]:not([tabindex="-1"])',
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
      // The player stays mounted, so stop it when the modal closes.
      playerRef.current?.pause();
      startScroll();
    };
  }, [modalOpen, stopScroll, startScroll]);

  // Scroll-linked expansion: the frame widens from 62vw to 90vw as it rises into view.
  useGSAP(
    () => {
      const frame = posterWrapRef.current;
      if (!frame) return;
      const mm = gsap.matchMedia();
      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isDesktop: MEDIA_QUERIES.desktop },
        (context) => {
          const { motionOk, isDesktop } = context.conditions ?? {};
          if (!motionOk || !isDesktop) return;
          gsap.fromTo(
            frame,
            { width: '62vw' },
            {
              width: '90vw',
              ease: EASE.linear,
              scrollTrigger: {
                trigger: frame,
                start: SHOWREEL.widenStart,
                end: SHOWREEL.widenEnd,
                scrub: 0.6,
              },
            },
          );
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

      </div>

      {/* Frame: sits outside the container so it can grow to 90vw. */}
      <div
        ref={posterWrapRef}
        data-showreel-poster-wrap
        onClick={openModal}
        className="relative mx-auto mt-12 aspect-video w-[92vw] cursor-pointer overflow-hidden md:w-[90vw] lg:mt-16"
      >
        <RevealImage className="absolute inset-0 h-full w-full">
          {/* The poster still has black letterbox bars baked in (~13% top/bottom),
              so it is scaled just enough to make the picture cover the frame edge to edge. */}
          <Img
            image={showreel.poster}
            sizes="90vw"
            className="h-full w-full scale-[1.36] object-cover"
          />
        </RevealImage>

        <PlayButton
          ref={triggerRef}
          data-showreel-trigger
          data-video-url={showreel.videoUrl}
          aria-haspopup="dialog"
          aria-expanded={modalOpen}
          aria-label={`Play showreel: ${showreel.heading}`}
        />
      </div>

      {/* Fullscreen Showreel Video Modal (SPEC §7 #3 & §8.6).
          Always mounted (hidden when closed) so the player exists inside the play click. */}
      <div
          id="showreel-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={showreel.heading}
          aria-hidden={!modalOpen}
          inert={!modalOpen}
          onClick={closeModal}
          className={`fixed inset-0 z-50 items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8 lg:p-14 ${
            modalOpen ? 'flex' : 'hidden'
          }`}
        >
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close showreel video"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
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
            {playbackId ? (
              <MuxPlayer
                ref={playerRef}
                playbackId={playbackId}
                streamType="on-demand"
                title={showreel.heading}
                preload="metadata"
                playsInline
                accentColor="var(--color-berry)"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-body text-paper/80">
                Showreel video unavailable
              </div>
            )}

            {needsUnmute && (
              <button
                type="button"
                onClick={unmute}
                className="absolute top-4 left-4 z-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-crimson-950/80 px-4 py-2 text-small font-semibold text-paper backdrop-blur-sm transition-colors hover:bg-crimson-800"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M19 5a10 10 0 0 1 0 14" />
                </svg>
                Tap for sound
              </button>
            )}
          </div>
        </div>
    </section>
  );
}
