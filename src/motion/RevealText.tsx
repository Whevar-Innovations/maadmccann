import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, MEDIA_QUERIES, SplitText, useGSAP } from './gsap-setup';
import { DIST, DUR, EASE, SCROLL, STAGGER } from './tokens';

export type RevealTextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
};

/**
 * <RevealText> primitive (SPEC §8.5).
 * SplitText lines in a mask, yPercent 100 -> 0, stagger STAGGER.lines, once: true, start: SCROLL.start.
 * Waits for document.fonts.ready before splitting and calls split.revert() on cleanup.
 * Reduced-motion users get a plain 0.4s opacity fade.
 */
export function RevealText({
  as: Tag = 'div',
  children,
  className,
  id,
  delay = 0,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      let cancelled = false;
      let splitInstance: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            delay,
            ease: EASE.soft,
            scrollTrigger: {
              trigger: el,
              start: SCROLL.start,
              once: true,
            },
          },
        );
      });

      mm.add(MEDIA_QUERIES.motionOk, () => {
        const fontsReady =
          typeof document !== 'undefined' && 'fonts' in document
            ? document.fonts.ready.catch(() => undefined)
            : Promise.resolve();

        fontsReady.then(() => {
          if (cancelled || !containerRef.current) return;

          splitInstance = SplitText.create(containerRef.current, {
            type: 'lines',
            mask: 'lines',
            // Keep no-break spaces in copy ("7\u00a0Days") so those words never split across lines:
            // the default reduceWhiteSpace turns them into plain spaces, and the default delimiter
            // splits on them. CSS still collapses ordinary whitespace.
            reduceWhiteSpace: false,
            wordDelimiter: ' ',
          });

          if (!splitInstance.lines || splitInstance.lines.length === 0) return;

          tween = gsap.fromTo(
            splitInstance.lines,
            { yPercent: DIST.maskFrom },
            {
              yPercent: 0,
              duration: DUR.text,
              delay,
              stagger: STAGGER.lines,
              ease: EASE.out,
              scrollTrigger: {
                trigger: containerRef.current,
                start: SCROLL.start,
                once: true,
              },
            },
          );
        });

        return () => {
          cancelled = true;
          tween?.kill();
          splitInstance?.revert();
        };
      });

      return () => {
        cancelled = true;
        tween?.kill();
        splitInstance?.revert();
      };
    },
    { scope: containerRef },
  );

  return (
    <Tag ref={containerRef} id={id} className={className}>
      {children}
    </Tag>
  );
}
