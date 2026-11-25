import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { TeamMember } from '@/content/static/team';
import { gsap } from '@/motion/gsap-setup';
import { EASE } from '@/motion/tokens';
import { BioContent } from './BioContent';

export type BioPanelTarget = { cardId: string; member: TeamMember; el: HTMLElement };

export type BioPanelProps = {
  target: BioPanelTarget | null;
  /** Positioned ancestor the panel is placed in (it scrolls with the page). */
  containerRef: RefObject<HTMLElement | null>;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

const GAP = 10;
const VIEWPORT_MARGIN = 16;

/**
 * Floating bio panel shown while a card is hovered (desktop) or keyboard-focused, as in the
 * design: a pale glass panel opening just below the card over its neighbours. It flips above the
 * card when there is no room below, and glides between cards instead of blinking out and in.
 * Long bios scroll inside the panel (Lenis is told to leave that scroll alone).
 */
export function BioPanel({ target, containerRef, onPointerEnter, onPointerLeave }: BioPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(false);
  // Keep the last person mounted while the panel fades out.
  const [shown, setShown] = useState<BioPanelTarget | null>(target);
  if (target && target !== shown) setShown(target);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const container = containerRef.current;
    if (!panel || !container) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!target) {
      if (!visibleRef.current) return;
      visibleRef.current = false;
      gsap.to(panel, {
        autoAlpha: 0,
        y: reduced ? 0 : 8,
        duration: 0.25,
        ease: EASE.soft,
        overwrite: 'auto',
      });
      return;
    }

    const box = container.getBoundingClientRect();
    const card = target.el.getBoundingClientRect();
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;

    const clampLeft = (x: number) => Math.min(Math.max(x, 0), Math.max(box.width - w, 0));
    const vh = window.innerHeight;
    const minTop = VIEWPORT_MARGIN + 64; // clear of the fixed header

    // Below the card if it fits in the viewport, else above, else beside it (never over it).
    let left = clampLeft(card.left + card.width / 2 - w / 2 - box.left);
    let viewportTop = card.bottom + GAP;
    if (viewportTop + h > vh - VIEWPORT_MARGIN) {
      const above = card.top - GAP - h;
      if (above >= minTop) {
        viewportTop = above;
      } else {
        const rightX = card.right + GAP - box.left;
        const leftX = card.left - GAP - w - box.left;
        left = rightX + w <= box.width ? rightX : leftX >= 0 ? leftX : clampLeft(rightX);
        viewportTop = Math.min(Math.max(card.top, minTop), Math.max(minTop, vh - VIEWPORT_MARGIN - h));
      }
    }
    const top = viewportTop - box.top;

    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const items = panel.querySelectorAll('[data-bio-item], [data-bio-head]');

    if (!visibleRef.current) {
      visibleRef.current = true;
      gsap.set(panel, { left, top });
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: reduced ? 0 : 14, scale: reduced ? 1 : 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: EASE.out, overwrite: 'auto' },
      );
    } else {
      gsap.to(panel, {
        left,
        top,
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: reduced ? 0 : 0.55,
        ease: EASE.out,
        overwrite: 'auto',
      });
    }
    if (!reduced) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: EASE.out, delay: 0.05, overwrite: 'auto' },
      );
    }
  }, [target, containerRef]);

  const member = shown?.member;
  if (!member?.bio) return null;

  return (
    <div
      ref={panelRef}
      id="team-bio-panel"
      role="tooltip"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="invisible absolute top-0 left-0 z-30 w-[min(34rem,100%)] origin-top rounded-[4px] bg-[#eef3f5]/95 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] ring-1 ring-black/5 backdrop-blur-md opacity-0 xl:w-[min(36rem,100%)]"
    >
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="max-h-[min(26rem,62vh)] overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 sm:py-7 [scrollbar-width:thin]"
      >
        <div data-bio-head className="mb-4">
          <p className="font-display text-[1.05rem] leading-tight font-bold text-ink">{member.name}</p>
          <p className="mt-0.5 text-[0.75rem] font-semibold text-impact-red">{member.title}</p>
        </div>
        <BioContent bio={member.bio} compact />
      </div>
    </div>
  );
}
