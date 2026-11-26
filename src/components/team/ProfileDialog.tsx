import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import type { TeamMember } from '@/content/types';
import { Img, preloadImage } from '@/components/ui/Img';
import { gsap, MEDIA_QUERIES } from '@/motion/gsap-setup';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { EASE, PROFILE_DIALOG } from '@/motion/tokens';
import { BioContent } from './BioContent';

export type ProfileDialogProps = {
  /** The department's people with bios, in card order. */
  people: TeamMember[];
  startIndex: number;
  /** Department name, shown as context ("Creative · 2 of 10"). */
  groupLabel: string;
  /** Called once the close animation has finished. */
  onClosed: () => void;
};

/** Portrait `sizes` for the dialog; TeamCard preloads with these so the photo is ready on open. */
export const DIALOG_PHOTO_SIZES = {
  desktop: '(min-width: 768px) 380px, 0px',
  mobile: '100vw',
} as const;

export function preloadDialogPhoto(member: TeamMember) {
  const desktop = window.matchMedia('(min-width: 768px)').matches;
  preloadImage(member.image, desktop ? '380px' : DIALOG_PHOTO_SIZES.mobile);
}

const SWIPE_CLOSE_PX = 110;
const SWIPE_PAGE_PX = 60;

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', onChange);
      return () => m.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Full profile: portrait, name, title and the whole bio, with next/previous through the
 * department so readers can browse colleagues without closing.
 *
 * Phones: a near full-height bottom sheet led by a large portrait with the name over it (like the
 * card). Swipe down from the top to close, swipe sideways to change person. A compact name bar
 * pins to the top once the portrait scrolls away, and the long Brands / Projects lists sit behind
 * toggles so the bio itself comes first.
 * Tablet/desktop: a centred card with the portrait beside the text.
 * Both: locks page scroll, traps focus, Esc / backdrop / close button to close, arrow keys to page.
 */
export function ProfileDialog({ people, startIndex, groupLabel, onClosed }: ProfileDialogProps) {
  const [index, setIndex] = useState(startIndex);
  const [compact, setCompact] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const personRef = useRef<HTMLDivElement | null>(null);
  const photoHeadRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const closingRef = useRef(false);
  const dirRef = useRef(0);
  const firstRenderRef = useRef(true);
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const { stopScroll, startScroll } = useSmoothScroll();

  const member = people[index] ?? people[0];
  const count = people.length;
  const prev = people[(index - 1 + count) % count];
  const next = people[(index + 1) % count];

  const go = useCallback(
    (step: number) => {
      if (count < 2) return;
      dirRef.current = step;
      setIndex((i) => (i + step + count) % count);
    },
    [count],
  );

  const requestClose = useCallback(() => {
    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet || closingRef.current) return;
    closingRef.current = true;
    const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;
    const mobile = window.matchMedia(MEDIA_QUERIES.mobile).matches;
    gsap
      .timeline({ onComplete: onClosed })
      .to(
        sheet,
        reduced
          ? { opacity: 0, duration: PROFILE_DIALOG.reducedFade }
          : mobile
            ? { yPercent: 100, duration: PROFILE_DIALOG.closeMobile, ease: EASE.in }
            : { y: PROFILE_DIALOG.closeDrop, opacity: 0, scale: PROFILE_DIALOG.sheetScale, duration: PROFILE_DIALOG.closeDesktop, ease: EASE.in },
        0,
      )
      .to(root.querySelector('[data-dialog-overlay]'), { opacity: 0, duration: PROFILE_DIALOG.overlayOut }, PROFILE_DIALOG.overlayOutAt);
  }, [onClosed]);

  // Entrance
  useLayoutEffect(() => {
    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet) return;
    const overlay = root.querySelector('[data-dialog-overlay]');
    const photos = root.querySelectorAll('[data-dialog-photo]');
    const items = root.querySelectorAll('[data-dialog-head], [data-bio-item]');
    const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;
    const mobile = window.matchMedia(MEDIA_QUERIES.mobile).matches;

    // Promote to GPU layers up front so the first frames don't hitch.
    const tl = gsap.timeline({ defaults: { force3D: true } });
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: PROFILE_DIALOG.overlayIn, ease: EASE.soft }, 0);
    if (reduced) {
      tl.fromTo(sheet, { opacity: 0 }, { opacity: 1, duration: PROFILE_DIALOG.reducedIn }, 0);
    } else {
      tl.fromTo(
        sheet,
        mobile ? { yPercent: 100 } : { y: PROFILE_DIALOG.enterRise, opacity: 0, scale: PROFILE_DIALOG.sheetScale },
        mobile
          ? { yPercent: 0, duration: PROFILE_DIALOG.enter, ease: EASE.out }
          : { y: 0, opacity: 1, scale: 1, duration: PROFILE_DIALOG.enter, ease: EASE.out },
        PROFILE_DIALOG.enterAt,
      )
        .fromTo(photos, { scale: PROFILE_DIALOG.photoScaleFrom }, { scale: 1, duration: PROFILE_DIALOG.photoIn, ease: EASE.out }, PROFILE_DIALOG.enterAt)
        .fromTo(
          items,
          { y: PROFILE_DIALOG.itemRise, opacity: 0 },
          { y: 0, opacity: 1, duration: PROFILE_DIALOG.itemIn, stagger: PROFILE_DIALOG.itemStagger, ease: EASE.out },
          PROFILE_DIALOG.itemsAt,
        );
    }
    return () => {
      tl.kill();
    };
  }, []);

  // Changing person: back to the top, then slide the new one in from the side it came from.
  useLayoutEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const scroller = scrollRef.current;
    const person = personRef.current;
    const root = rootRef.current;
    if (!scroller || !person || !root) return;
    scroller.scrollTop = 0;
    setCompact(false);
    if (window.matchMedia(MEDIA_QUERIES.reducedMotion).matches) return;
    const dir = dirRef.current || 1;
    gsap.fromTo(
      person,
      { x: PROFILE_DIALOG.pageShift * dir, opacity: 0 },
      { x: 0, opacity: 1, duration: PROFILE_DIALOG.pageIn, ease: EASE.out, overwrite: 'auto' },
    );
    gsap.fromTo(
      root.querySelectorAll('[data-dialog-photo]'),
      { scale: PROFILE_DIALOG.photoScaleFrom },
      { scale: 1, duration: PROFILE_DIALOG.pagePhotoIn, ease: EASE.out, overwrite: 'auto' },
    );
  }, [index]);

  // Compact name bar once the phone portrait has scrolled away.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || !isMobile) return;
    const onScroll = () => {
      const head = photoHeadRef.current;
      setCompact(head ? scroller.scrollTop > head.offsetHeight - 72 : false);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  // Touch gestures (phones): drag down from the top to dismiss, swipe sideways to page.
  useEffect(() => {
    const sheet = sheetRef.current;
    const scroller = scrollRef.current;
    const root = rootRef.current;
    if (!sheet || !scroller || !root || !isMobile) return;
    const overlay = root.querySelector<HTMLElement>('[data-dialog-overlay]');

    let startX = 0;
    let startY = 0;
    let startT = 0;
    let atTop = false;
    let axis: 'x' | 'y' | null = null;
    let dx = 0;
    let dy = 0;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t || closingRef.current) return;
      startX = t.clientX;
      startY = t.clientY;
      startT = performance.now();
      atTop = scroller.scrollTop <= 0;
      axis = null;
      dx = 0;
      dy = 0;
    };

    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t || closingRef.current) return;
      dx = t.clientX - startX;
      dy = t.clientY - startY;
      if (!axis && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (axis === 'y' && atTop && dy > 0 && scroller.scrollTop <= 0) {
        e.preventDefault();
        gsap.set(sheet, { y: dy });
        if (overlay) gsap.set(overlay, { opacity: Math.max(0.2, 1 - dy / 600) });
      } else if (axis === 'x' && count > 1) {
        e.preventDefault();
        if (personRef.current) gsap.set(personRef.current, { x: dx * 0.35 });
      }
    };

    const onEnd = () => {
      if (closingRef.current) return;
      if (axis === 'y' && dy > 0 && atTop) {
        const velocity = dy / Math.max(performance.now() - startT, 1);
        if (dy > SWIPE_CLOSE_PX || velocity > 0.6) {
          requestClose();
        } else {
          gsap.to(sheet, { y: 0, duration: PROFILE_DIALOG.snapBack, ease: EASE.out });
          if (overlay) gsap.to(overlay, { opacity: 1, duration: PROFILE_DIALOG.overlayBack });
        }
      } else if (axis === 'x' && count > 1) {
        if (Math.abs(dx) > SWIPE_PAGE_PX) {
          go(dx < 0 ? 1 : -1);
        } else if (personRef.current) {
          gsap.to(personRef.current, { x: 0, duration: PROFILE_DIALOG.pageSnapBack, ease: EASE.out });
        }
      }
      axis = null;
    };

    sheet.addEventListener('touchstart', onStart, { passive: true });
    sheet.addEventListener('touchmove', onMove, { passive: false });
    sheet.addEventListener('touchend', onEnd);
    sheet.addEventListener('touchcancel', onEnd);
    return () => {
      sheet.removeEventListener('touchstart', onStart);
      sheet.removeEventListener('touchmove', onMove);
      sheet.removeEventListener('touchend', onEnd);
      sheet.removeEventListener('touchcancel', onEnd);
    };
  }, [isMobile, count, go, requestClose]);

  // Scroll lock, initial focus, keys and focus trap
  useEffect(() => {
    stopScroll();
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key !== 'Tab') return;
      const root = rootRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null && !el.closest('[inert]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      startScroll();
    };
  }, [requestClose, go, stopScroll, startScroll]);

  if (!member?.bio) return null;
  const position = count > 1 ? `${index + 1} of ${count}` : null;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-dialog-name"
      className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-8"
    >
      <div
        data-dialog-overlay
        aria-hidden="true"
        onClick={requestClose}
        className="absolute inset-0 bg-black/80"
      />

      <div
        ref={sheetRef}
        className="relative flex h-[94svh] w-full flex-col overflow-hidden rounded-t-[1.25rem] bg-paper text-ink shadow-2xl will-change-transform md:h-[min(86svh,48rem)] md:max-w-[60rem] md:flex-row md:rounded-[1rem]"
      >
        {/* Portrait column (tablet/desktop) */}
        <div className="relative hidden shrink-0 overflow-hidden bg-placeholder md:block md:w-[38%]">
          <div key={member.slug} data-dialog-photo className="absolute inset-0 will-change-transform">
            <Img
              image={member.image}
              eager
              sizes={DIALOG_PHOTO_SIZES.desktop}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* Compact name bar (phones), pinned once the portrait has scrolled away */}
          <div
            aria-hidden={!compact}
            className={`absolute inset-x-0 top-0 z-10 flex h-14 items-center border-b border-ink/10 bg-paper/95 px-5 pr-16 backdrop-blur-md transition-[opacity,transform] duration-300 md:hidden ${
              compact ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
            }`}
          >
            <p className="truncate font-display text-[1rem] font-bold">{member.name}</p>
            <p className="ml-2 truncate text-[0.75rem] font-semibold text-impact-red">{member.title}</p>
          </div>

          <div
            ref={scrollRef}
            data-lenis-prevent
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <div ref={personRef} key={member.slug} className="will-change-transform">
              {/* Portrait header (phones) */}
              <div
                ref={photoHeadRef}
                className="relative h-[min(60svh,32rem)] w-full overflow-hidden bg-placeholder md:hidden"
              >
                <div data-dialog-photo className="absolute inset-0 will-change-transform">
                  <Img
                    image={member.image}
                    eager
                    sizes={DIALOG_PHOTO_SIZES.mobile}
                    className="h-full w-full object-cover object-[50%_12%]"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/60 to-transparent"
                />
                <div aria-hidden="true" className="absolute top-2.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/70" />
                <div data-dialog-head className="absolute inset-x-0 bottom-0 px-5 pb-5 text-paper">
                  <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-paper/70 uppercase">
                    {groupLabel}
                    {position && <span> · {position}</span>}
                  </p>
                  <h2
                    id={isMobile ? 'team-dialog-name' : undefined}
                    className="mt-1.5 font-display text-[clamp(1.8rem,8vw,2.4rem)] leading-[1.02] font-bold tracking-[-0.02em]"
                  >
                    {member.name}
                  </h2>
                  <p className="mt-1.5 text-[0.9rem] font-semibold text-maroon-200">{member.title}</p>
                </div>
              </div>

              <div className="px-5 pt-6 pb-8 sm:px-8 md:px-10 md:pt-10 md:pb-10">
                {/* Heading (tablet/desktop) */}
                <div data-dialog-head className="mb-7 hidden pr-10 md:block">
                  <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink/50 uppercase">
                    {groupLabel}
                    {position && <span> · {position}</span>}
                  </p>
                  <h2
                    id={isMobile ? undefined : 'team-dialog-name'}
                    className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05] font-bold tracking-[-0.02em]"
                  >
                    {member.name}
                  </h2>
                  <p className="mt-1.5 text-[0.9rem] font-semibold text-impact-red">{member.title}</p>
                </div>

                <BioContent bio={member.bio} collapsible={isMobile} />
              </div>
            </div>
          </div>

          {/* Previous / next within the department */}
          {count > 1 && prev && next && (
            <nav
              aria-label={`More people in ${groupLabel}`}
              className="flex shrink-0 items-stretch border-t border-ink/10 bg-paper pb-[env(safe-area-inset-bottom)]"
            >
              <PagerButton dir={-1} person={prev} onClick={() => go(-1)} />
              <span aria-hidden="true" className="w-px bg-ink/10" />
              <PagerButton dir={1} person={next} onClick={() => go(1)} />
            </nav>
          )}
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label="Close profile"
          className="absolute top-3 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-paper backdrop-blur-sm transition-colors duration-300 hover:bg-impact-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-impact-red md:top-4 md:right-4 md:h-10 md:w-10 md:bg-ink"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p aria-live="polite" className="sr-only">
          {position ? `${member.name}, ${member.title}. ${position} in ${groupLabel}.` : ''}
        </p>
      </div>
    </div>,
    document.body,
  );
}

function PagerButton({ dir, person, onClick }: { dir: 1 | -1; person: TeamMember; onClick: () => void }) {
  const isNext = dir === 1;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isNext ? 'Next' : 'Previous'}: ${person.name}`}
      className={`group flex min-h-14 min-w-0 flex-1 items-center gap-3 px-4 py-2.5 transition-colors duration-300 hover:bg-ink/[0.04] sm:px-6 ${
        isNext ? 'flex-row-reverse text-right' : 'text-left'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 text-impact-red transition-transform duration-300 ${
          isNext ? 'group-hover:translate-x-0.5' : 'rotate-180 group-hover:-translate-x-0.5'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
      <span className="min-w-0">
        <span className="block text-[0.62rem] font-semibold tracking-[0.12em] text-ink/45 uppercase">
          {isNext ? 'Next' : 'Previous'}
        </span>
        <span className="block truncate text-[0.85rem] font-semibold">{person.name}</span>
      </span>
    </button>
  );
}
