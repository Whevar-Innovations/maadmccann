import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from './gsap-setup';
import { REVEAL } from './tokens';

const MOBILE_QUERY = '(max-width: 767px)';
const subscribeMobile = (cb: () => void) => {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export type LogoCarouselProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Target width of one slot in px; the visible count is derived from the container width. */
  slotWidth?: number;
  minVisible?: number;
  maxVisible?: number;
  className?: string;
};

/**
 * Deliberate, stepped logo carousel. The number of visible logos follows the
 * container width (7 on wide screens, fewer on narrow ones). Every few seconds the
 * track glides by exactly one slot, then rests. Seamless loop via cloned leading items.
 * Hover / focus pauses, off-screen pauses, reduced motion shows a static row.
 */
export function LogoCarousel<T>({
  items,
  getKey,
  renderItem,
  slotWidth = 150,
  minVisible = 2,
  maxVisible = 7,
  className = '',
}: LogoCarouselProps<T>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [width, setWidth] = useState(0);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [isMobile]);

  const count = Math.min(
    maxVisible,
    Math.max(minVisible, Math.round(width / slotWidth) || maxVisible),
    items.length,
  );
  const slot = width > 0 ? width / count : 0;
  // Phones: a whole number of logos always fits the width, so a swipe/step never leaves a partial logo.
  const mobileCount = Math.min(items.length, Math.max(2, Math.round(width / 120) || 3));
  const mobileSlot = width > 0 ? width / mobileCount : 0;
  const animated = items.length > 1 && !isMobile;
  const rendered = animated ? [...items, ...items.slice(0, count)] : items;

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || !animated || slot === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.killTweensOf(track);
    gsap.set(track, { x: 0 });
    const tl = gsap.timeline({ repeat: -1, delay: REVEAL.carouselHold });
    for (let i = 1; i <= items.length; i += 1) {
      tl.to(track, { x: -i * slot, duration: REVEAL.carouselStep, ease: 'power3.inOut' });
      tl.to({}, { duration: REVEAL.carouselHold });
    }
    tl.set(track, { x: 0 });

    const pause = () => tl.pause();
    const resume = () => tl.resume();
    root.addEventListener('pointerenter', pause);
    root.addEventListener('pointerleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', resume);

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? tl.resume() : tl.pause()),
    });

    return () => {
      root.removeEventListener('pointerenter', pause);
      root.removeEventListener('pointerleave', resume);
      root.removeEventListener('focusin', pause);
      root.removeEventListener('focusout', resume);
      st.kill();
      tl.kill();
      gsap.killTweensOf(track);
      gsap.set(track, { x: 0 });
    };
  }, [slot, items.length, animated]);

  // Phones: the row auto-advances one logo at a time AND can be swiped by hand.
  // A touch/scroll pauses auto-play; it resumes after a few idle seconds.
  useEffect(() => {
    const scroller = rootRef.current;
    if (!isMobile || !scroller || items.length < 2) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const slotWidth = () => scroller.querySelector('li')?.offsetWidth ?? 0;
    const setWidth = () => slotWidth() * items.length;
    // Clones sit after the real set; once we scroll into them, jump back by one set (invisible).
    const wrap = () => {
      const w = setWidth();
      if (w > 0 && scroller.scrollLeft >= w - 2) scroller.scrollLeft -= w;
    };

    let paused = false;
    let visible = true;
    let resumeTimer = 0;
    const hold = (ms: number) => {
      paused = true;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, ms);
    };
    const onUser = () => hold(5000);
    let settleTimer = 0;
    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(wrap, 160);
    };

    scroller.addEventListener('touchstart', onUser, { passive: true });
    scroller.addEventListener('pointerdown', onUser, { passive: true });
    scroller.addEventListener('wheel', onUser, { passive: true });
    scroller.addEventListener('focusin', onUser);
    scroller.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
    });
    io.observe(scroller);

    const interval = reduced
      ? 0
      : window.setInterval(() => {
          if (paused || !visible || document.hidden) return;
          wrap();
          scroller.scrollTo({ left: scroller.scrollLeft + slotWidth(), behavior: 'smooth' });
        }, (REVEAL.carouselHold + REVEAL.carouselStep) * 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resumeTimer);
      window.clearTimeout(settleTimer);
      io.disconnect();
      scroller.removeEventListener('touchstart', onUser);
      scroller.removeEventListener('pointerdown', onUser);
      scroller.removeEventListener('wheel', onUser);
      scroller.removeEventListener('focusin', onUser);
      scroller.removeEventListener('scroll', onScroll);
    };
  }, [isMobile, items.length]);

  if (isMobile) {
    return (
      <div
        ref={rootRef}
        tabIndex={0}
        role="region"
        aria-label="Client logos"
        className={`touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`.trim()}
      >
        <ul ref={trackRef} className="flex w-max">
          {[...items, ...items].map((item, i) => (
            <li
              key={`${getKey(item)}-${i}`}
              aria-hidden={i >= items.length ? true : undefined}
              style={{ width: mobileSlot || undefined }}
              className="flex w-[33.33vw] shrink-0 snap-start items-center justify-center px-3"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`overflow-hidden py-3 ${animated ? '[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]' : ''} ${className}`.trim()}
    >
      <ul
        ref={trackRef}
        className={`flex will-change-transform ${animated ? 'w-max' : 'w-full justify-center'}`}
      >
        {rendered.map((item, i) => (
          <li
            key={`${getKey(item)}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            style={animated ? { width: slot } : undefined}
            className="flex shrink-0 items-center justify-center px-4"
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}
