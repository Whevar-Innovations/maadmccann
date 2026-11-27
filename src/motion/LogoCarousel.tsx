import { useRef, useSyncExternalStore, type ReactNode } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { EASE, LOGO_MARQUEE } from './tokens';

const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(MEDIA_QUERIES.reducedMotion);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;
const subscribeMobile = (cb: () => void) => {
  const mq = window.matchMedia(MEDIA_QUERIES.mobile);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getMobile = () => window.matchMedia(MEDIA_QUERIES.mobile).matches;

export type LogoCarouselProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Glide speed in px/s on desktop (phones run at LOGO_MARQUEE.mobileFactor of it). */
  speed?: number;
  /** Accessible name for the strip (it is focusable so keyboard users can pause it). */
  label?: string;
  className?: string;
};

/**
 * Continuous logo marquee that never reacts to page scrolling.
 * - Tablet/desktop: the set is rendered twice and the track glides left by exactly one set at a
 *   constant speed, forever (seamless). It eases to a stop on fine-pointer hover or keyboard focus.
 * - Phones: a swipeable horizontal scroller that keeps gliding on its own between swipes.
 * Reduced motion: a static, centred, wrapping row of the single set.
 */
export function LogoCarousel<T>({
  items,
  getKey,
  renderItem,
  speed = LOGO_MARQUEE.pxPerSecond,
  label = 'Client logos',
  className = '',
}: LogoCarouselProps<T>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);
  const animated = !reduced && items.length > 1;

  // Phones: a native horizontal scroller (swipe either way) that also glides on its own.
  // Three copies; the view is kept inside the middle one, so both directions always have room and
  // jumping by one set width is invisible. A touch hands control to the finger; once the swipe's
  // momentum settles, the glide resumes from wherever it landed.
  useGSAP(
    () => {
      const scroller = rootRef.current;
      const track = trackRef.current;
      if (!scroller || !track || !animated || !isMobile) return;

      const pxPerSecond = speed * LOGO_MARQUEE.mobileFactor;
      const setWidth = () => track.scrollWidth / 3;
      const wrap = (x: number) => {
        const w = setWidth();
        if (w <= 0) return x;
        if (x >= 2 * w) return x - w;
        if (x < w) return x + w;
        return x;
      };

      let pos = setWidth();
      scroller.scrollLeft = pos;
      let touching = false;
      let focused = false;
      let settleTimer = 0;

      const settle = () => {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          settleTimer = 0;
          pos = wrap(scroller.scrollLeft);
          scroller.scrollLeft = pos;
        }, LOGO_MARQUEE.swipeSettleMs);
      };

      const tick = (_time: number, deltaMs: number) => {
        if (touching || settleTimer || focused) return;
        pos = wrap(pos + (pxPerSecond * deltaMs) / 1000);
        scroller.scrollLeft = pos;
      };
      gsap.ticker.add(tick);

      const onTouchStart = () => {
        touching = true;
        window.clearTimeout(settleTimer);
        settleTimer = 0;
      };
      const onTouchEnd = () => {
        touching = false;
        settle();
      };
      // Only user-driven scrolls (finger, momentum, trackpad) restart the settle wait.
      const onScroll = () => {
        if (touching || settleTimer) settle();
      };
      const onWheel = () => settle();
      const onFocusIn = () => {
        focused = true;
      };
      const onFocusOut = () => {
        focused = false;
        pos = wrap(scroller.scrollLeft);
      };

      scroller.addEventListener('touchstart', onTouchStart, { passive: true });
      scroller.addEventListener('touchend', onTouchEnd, { passive: true });
      scroller.addEventListener('touchcancel', onTouchEnd, { passive: true });
      scroller.addEventListener('scroll', onScroll, { passive: true });
      scroller.addEventListener('wheel', onWheel, { passive: true });
      scroller.addEventListener('focusin', onFocusIn);
      scroller.addEventListener('focusout', onFocusOut);

      return () => {
        gsap.ticker.remove(tick);
        window.clearTimeout(settleTimer);
        scroller.removeEventListener('touchstart', onTouchStart);
        scroller.removeEventListener('touchend', onTouchEnd);
        scroller.removeEventListener('touchcancel', onTouchEnd);
        scroller.removeEventListener('scroll', onScroll);
        scroller.removeEventListener('wheel', onWheel);
        scroller.removeEventListener('focusin', onFocusIn);
        scroller.removeEventListener('focusout', onFocusOut);
      };
    },
    { scope: rootRef, dependencies: [animated, isMobile, speed, items.length] },
  );

  // Tablet and desktop: a transform marquee that eases to a stop on hover.
  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track || !animated || isMobile) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          motionOk: MEDIA_QUERIES.motionOk,
          finePointer: MEDIA_QUERIES.finePointer,
        },
        (context) => {
          const { motionOk, finePointer } = context.conditions ?? {};
          if (!motionOk) return;

          const pxPerSecond = speed;
          let tween: gsap.core.Tween | null = null;
          let hovered = false;
          let focused = false;
          let setWidth = 0;

          const held = () => hovered || focused;
          const applyHold = (instant = false) => {
            if (!tween) return;
            const timeScale = held() || document.hidden ? 0 : 1;
            gsap.killTweensOf(tween);
            if (instant) tween.timeScale(timeScale);
            else
              gsap.to(tween, {
                timeScale,
                duration: LOGO_MARQUEE.hoverPauseDur,
                ease: EASE.out,
              });
          };

          // (Re)build at constant px/s whenever one set's width changes (logos load, breakpoints).
          const build = () => {
            const width = track.scrollWidth / 2;
            if (width <= 0 || Math.abs(width - setWidth) < 1) return;
            setWidth = width;
            const progress = tween?.progress() ?? 0;
            if (tween) gsap.killTweensOf(tween);
            tween?.kill();
            tween = gsap.fromTo(
              track,
              { xPercent: 0 },
              {
                xPercent: -50,
                duration: width / pxPerSecond,
                ease: EASE.linear,
                repeat: -1,
              },
            );
            tween.progress(progress);
            applyHold(true);
          };

          build();
          const ro = new ResizeObserver(build);
          ro.observe(track);

          const onEnter = () => {
            hovered = true;
            applyHold();
          };
          const onLeave = () => {
            hovered = false;
            applyHold();
          };
          const onFocusIn = () => {
            focused = true;
            applyHold();
          };
          const onFocusOut = () => {
            focused = false;
            applyHold();
          };
          const onVisibility = () => applyHold(true);

          if (finePointer) {
            root.addEventListener('pointerenter', onEnter);
            root.addEventListener('pointerleave', onLeave);
          }
          root.addEventListener('focusin', onFocusIn);
          root.addEventListener('focusout', onFocusOut);
          document.addEventListener('visibilitychange', onVisibility);

          return () => {
            ro.disconnect();
            root.removeEventListener('pointerenter', onEnter);
            root.removeEventListener('pointerleave', onLeave);
            root.removeEventListener('focusin', onFocusIn);
            root.removeEventListener('focusout', onFocusOut);
            document.removeEventListener('visibilitychange', onVisibility);
            if (tween) gsap.killTweensOf(tween);
            tween?.kill();
            gsap.set(track, { xPercent: 0 });
          };
        },
      );
    },
    { scope: rootRef, dependencies: [animated, isMobile, speed, items.length] },
  );

  if (!animated) {
    return (
      <div className={`py-3 ${className}`.trim()}>
        <ul className="flex flex-wrap items-center justify-center gap-y-6">
          {items.map((item) => (
            <li key={getKey(item)} className="flex items-center justify-center px-5 lg:px-8">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div
        ref={rootRef}
        tabIndex={0}
        role="region"
        aria-label={label}
        className={`overflow-x-auto overscroll-x-contain py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`.trim()}
      >
        <ul ref={trackRef} className="flex w-max">
          {[...items, ...items, ...items].map((item, i) => (
            <li
              key={`${getKey(item)}-${i}`}
              aria-hidden={i >= items.length ? true : undefined}
              className="flex shrink-0 items-center justify-center px-5"
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
      tabIndex={0}
      role="region"
      aria-label={label}
      className={`overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] ${className}`.trim()}
    >
      <ul ref={trackRef} className="flex w-max will-change-transform">
        {[...items, ...items].map((item, i) => (
          <li
            key={`${getKey(item)}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className="flex shrink-0 items-center justify-center px-5 sm:px-7 lg:px-10"
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}
