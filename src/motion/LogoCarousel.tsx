import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from './gsap-setup';
import { REVEAL } from './tokens';

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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  const count = Math.min(
    maxVisible,
    Math.max(minVisible, Math.round(width / slotWidth) || maxVisible),
    items.length,
  );
  const slot = width > 0 ? width / count : 0;
  const animated = items.length > 1;
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

  return (
    <div
      ref={rootRef}
      className={`overflow-hidden ${animated ? '[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]' : ''} ${className}`.trim()}
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
