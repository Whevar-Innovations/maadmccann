import { useRef } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { EASE, REVEAL } from './tokens';

export type CounterProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

/**
 * <Counter> primitive (SPEC §8.5).
 * Counts from 0 to `value` (respecting `decimals`) over 1.6s with `power2.out`,
 * triggered once at 80% in view. Layout width is fixed via an invisible sizing span
 * so the number never jiggles.
 */
export function Counter({
  value,
  decimals = 0,
  suffix = '',
  className = '',
}: CounterProps) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);

  const finalFormatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const numEl = numRef.current;
      if (!wrap || !numEl) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        numEl.textContent = finalFormatted;
      });

      mm.add(MEDIA_QUERIES.motionOk, () => {
        const proxy = { current: 0 };
        numEl.textContent = decimals > 0 ? (0).toFixed(decimals) : '0';

        gsap.to(proxy, {
          current: value,
          duration: REVEAL.counterDuration,
          ease: EASE.counterOut,
          scrollTrigger: {
            trigger: wrap,
            start: REVEAL.counterStart,
            once: true,
          },
          onUpdate: () => {
            if (!numRef.current) return;
            numRef.current.textContent =
              decimals > 0
                ? proxy.current.toFixed(decimals)
                : Math.round(proxy.current).toString();
          },
        });
      });
    },
    { scope: wrapRef, dependencies: [value, decimals, finalFormatted] },
  );

  return (
    <span
      ref={wrapRef}
      className={`relative inline-block tabular-nums ${className}`.trim()}
    >
      {/* Invisible width-reservation span so layout width never shifts while counting */}
      <span aria-hidden="true" className="invisible select-none">
        {finalFormatted}
        {suffix}
      </span>

      {/* Visible animated number + suffix */}
      <span className="absolute inset-0">
        <span ref={numRef}>{finalFormatted}</span>
        <span>{suffix}</span>
      </span>
    </span>
  );
}
