import { useRef } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { EASE } from '@/motion/tokens';

const NODES = [
  [18, 132],
  [100, 132],
  [182, 132],
  [18, 178],
  [100, 178],
  [182, 178],
] as const;
const NODE = 22;

/**
 * Account Management diagram: one account lead connected to the whole team.
 * Scroll-in: lead pops, connectors draw downwards, team nodes pop in row by row,
 * then the lead gently pulses.
 */
export function OrgChart() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const lead = root.querySelector<HTMLElement>('[data-lead]');
      const wires = root.querySelectorAll<SVGPathElement>('[data-wire]');
      const nodes = root.querySelectorAll<SVGRectElement>('[data-node]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.motionOk, () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        });
        if (lead) {
          tl.fromTo(lead, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, 0);
        }
        tl.fromTo(wires, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: EASE.SineInOut }, 0.35)
          .fromTo(
            nodes,
            { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
            { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' },
            0.75,
          );
        if (lead) {
          tl.add(() => {
            gsap.to(lead, { scale: 1.05, duration: 1.6, ease: EASE.float, yoyo: true, repeat: -1 });
          });
        }
        // The idle pulse starts from a callback, outside the context's tracking.
        return () => {
          if (lead) gsap.killTweensOf(lead);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      role="img"
      aria-label="An account lead connected to a team of specialists"
      className="relative mx-auto w-full max-w-[20rem]"
    >
      <svg viewBox="0 0 200 200" className="block h-auto w-full overflow-visible" aria-hidden="true">
        <g fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="0.9">
          {/* trunk + top rail with rounded shoulders */}
          <path data-wire pathLength={1} strokeDasharray="1 1" d="M100 52 V178" />
          <path
            data-wire
            pathLength={1}
            strokeDasharray="1 1"
            d="M100 104 H24 Q18 104 18 110 V178 H100 M100 104 H176 Q182 104 182 110 V178 H100"
          />
        </g>
        <g fill="#ffffff">
          {NODES.map(([cx, cy]) => (
            <rect data-node key={`${cx}-${cy}`} x={cx - NODE / 2} y={cy - NODE / 2} width={NODE} height={NODE} />
          ))}
        </g>
      </svg>

      {/* Account lead avatar */}
      <div
        data-lead
        className="absolute top-0 left-1/2 flex aspect-square w-[26%] -translate-x-1/2 items-center justify-center rounded-full border-[5px] border-[#d9d9d9] bg-paper"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[46%] fill-[#2b2d33]">
          <circle cx="12" cy="7.5" r="5" />
          <path d="M2.5 22c0-5 4.2-8.6 9.5-8.6s9.5 3.6 9.5 8.6z" />
        </svg>
      </div>
    </div>
  );
}
