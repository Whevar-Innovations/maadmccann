import { useRef, type ReactNode } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { DUR, EASE, REVEAL } from './tokens';

export type MagneticProps = {
  children: ReactNode;
  className?: string;
};

/**
 * <Magnetic> primitive (SPEC §8.5).
 * Pill buttons shift up to 8px toward the cursor. Desktop fine pointer only.
 */
export function Magnetic({ children, className = '' }: MagneticProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = wrapRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          fine: MEDIA_QUERIES.finePointer,
          motionOk: MEDIA_QUERIES.motionOk,
          desktop: MEDIA_QUERIES.desktop,
        },
        (context) => {
          const { fine, motionOk, desktop } = context.conditions ?? {};
          if (!fine || !motionOk || !desktop) return;

          const xTo = gsap.quickTo(el, 'x', {
            duration: DUR.ui,
            ease: EASE.soft,
          });
          const yTo = gsap.quickTo(el, 'y', {
            duration: DUR.ui,
            ease: EASE.soft,
          });

          const onPointerMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const nx = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
            const ny = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
            xTo(gsap.utils.clamp(-1, 1, nx) * REVEAL.magneticMaxPx);
            yTo(gsap.utils.clamp(-1, 1, ny) * REVEAL.magneticMaxPx);
          };

          const onPointerLeave = () => {
            xTo(0);
            yTo(0);
          };

          el.addEventListener('pointermove', onPointerMove);
          el.addEventListener('pointerleave', onPointerLeave);

          return () => {
            el.removeEventListener('pointermove', onPointerMove);
            el.removeEventListener('pointerleave', onPointerLeave);
          };
        },
      );
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className={`inline-block will-change-transform ${className}`.trim()}>
      {children}
    </div>
  );
}
