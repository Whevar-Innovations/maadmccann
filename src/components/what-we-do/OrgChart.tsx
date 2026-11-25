import { useId, useRef } from 'react';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
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
 * Flow branches from the lead down to the team. Each starts at y=40, hidden behind the
 * avatar, and ends at a bottom box, hidden under it, so pulses never pop in or out.
 * `nodes` = [top box, bottom box] indices in NODES; `hits` = how far along the branch
 * (0..1) the pulse reaches each of those boxes, used to time their glow.
 */
const SHOULDER_ARC = (Math.PI * 6) / 2; // quarter circle, r = 6
const SIDE_LEN = 64 + 76 + SHOULDER_ARC + 68; // trunk to rail, rail, shoulder, down to bottom box
const BRANCHES = [
  {
    d: 'M100 40 V104 H24 Q18 104 18 110 V178',
    len: SIDE_LEN,
    nodes: [0, 3],
    hits: [(64 + 76 + SHOULDER_ARC + 22) / SIDE_LEN, 1],
    start: 0,
  },
  { d: 'M100 40 V178', len: 138, nodes: [1, 4], hits: [92 / 138, 1], start: 0.45 },
  {
    d: 'M100 40 V104 H176 Q182 104 182 110 V178',
    len: SIDE_LEN,
    nodes: [2, 5],
    hits: [(64 + 76 + SHOULDER_ARC + 22) / SIDE_LEN, 1],
    start: 0.9,
  },
] as const;

const PULSE_LEN = 16; // visible pulse length, in viewBox units
const FLOW_SPEED = 58; // viewBox units per second: slow and even on every branch
const FLOW_REST = 1.2; // pause between waves, seconds

/**
 * Account Management diagram: one account lead connected to the whole team.
 * Scroll-in: lead pops, connectors draw downwards, team nodes pop in row by row.
 * Then a slow continuous flow: soft light pulses leave the lead and travel down each branch,
 * and each box glows faintly as a pulse passes through it. The lead breathes gently.
 * The loop pauses while the diagram is off screen; reduced motion shows the static chart.
 */
export function OrgChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const uid = useId().replace(/:/g, '');
  const glowId = `org-glow-${uid}`;
  const haloId = `org-halo-${uid}`;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const lead = root.querySelector<HTMLElement>('[data-lead]');
      const wires = root.querySelectorAll<SVGPathElement>('[data-wire]');
      const nodes = root.querySelectorAll<SVGRectElement>('[data-node]');
      const pulses = Array.from(root.querySelectorAll<SVGPathElement>('[data-pulse]'));
      const halos = Array.from(root.querySelectorAll<SVGRectElement>('[data-halo]'));
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.motionOk, () => {
        // --- Entrance (unchanged) ---
        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        });
        if (lead) {
          tl.fromTo(lead, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, 0);
        }
        tl.fromTo(wires, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: EASE.SineInOut, autoRound: false }, 0.35)
          .fromTo(
            nodes,
            { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
            { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' },
            0.75,
          );

        // --- Continuous flow: lead -> team ---
        const flow = gsap.timeline({ paused: true, repeat: -1, repeatDelay: FLOW_REST });
        BRANCHES.forEach((branch, i) => {
          const pulse = pulses[i];
          if (!pulse) return;
          const seg = PULSE_LEN / branch.len; // pulse length as a fraction of the branch
          const duration = branch.len / FLOW_SPEED;
          // Dash spans [-offset, -offset + seg]: from just before the start to just past the end.
          // autoRound: false — paths use pathLength=1, so GSAP's default px rounding would
          // snap the whole 0 -> -1 journey into a single jump.
          flow.fromTo(
            pulse,
            { strokeDashoffset: seg },
            { strokeDashoffset: -1, duration, ease: 'none', autoRound: false },
            branch.start,
          );
          branch.nodes.forEach((nodeIndex, k) => {
            const halo = halos[nodeIndex];
            const hit = branch.hits[k] ?? 1;
            if (!halo) return;
            // When the pulse head reaches this box, glow softly and fade.
            const at = branch.start + (duration * hit) / (1 + seg);
            flow.fromTo(
              halo,
              { opacity: 0 },
              { opacity: 0.5, duration: 0.45, ease: 'sine.out', yoyo: true, repeat: 1 },
              Math.max(0, at - 0.25),
            );
          });
        });

        const breathe = lead
          ? gsap.to(lead, { scale: 1.04, duration: 1.8, ease: EASE.float, yoyo: true, repeat: -1, paused: true })
          : null;

        tl.add(() => {
          flow.play();
          breathe?.play();
        });

        // Only spend frames on the loop while the diagram is on screen.
        const visibility = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            if (tl.progress() < 1) return;
            if (self.isActive) {
              flow.play();
              breathe?.play();
            } else {
              flow.pause();
              breathe?.pause();
            }
          },
        });

        return () => {
          flow.kill();
          breathe?.kill();
          visibility.kill();
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
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={haloId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

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

        {/* Flow pulses: hidden until the loop starts (offset parks the dash before the path) */}
        <g fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" filter={`url(#${glowId})`}>
          {BRANCHES.map((branch) => {
            const seg = PULSE_LEN / branch.len;
            return (
              <path
                key={branch.d}
                data-pulse
                d={branch.d}
                pathLength={1}
                strokeDasharray={`${seg} ${1 + seg}`}
                strokeDashoffset={seg}
              />
            );
          })}
        </g>

        {/* Soft halos behind each box, lit as a pulse passes */}
        <g fill="#ffffff" filter={`url(#${haloId})`}>
          {NODES.map(([cx, cy]) => (
            <rect
              data-halo
              key={`halo-${cx}-${cy}`}
              x={cx - NODE / 2 - 4}
              y={cy - NODE / 2 - 4}
              width={NODE + 8}
              height={NODE + 8}
              opacity={0}
            />
          ))}
        </g>

        <g fill="#ffffff">
          {NODES.map(([cx, cy]) => (
            <rect data-node key={`${cx}-${cy}`} x={cx - NODE / 2} y={cy - NODE / 2} width={NODE} height={NODE} />
          ))}
        </g>
      </svg>

      {/* Account lead avatar (sits over the top of the trunk, hiding where pulses start) */}
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
