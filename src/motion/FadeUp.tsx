import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { DIST, DUR, EASE, SCROLL } from './tokens';

export type FadeUpProps = {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
};

/**
 * <FadeUp> primitive (SPEC §8.5).
 * y DIST.rise -> 0 (halved on mobile < 768px per §8.9), opacity 0 -> 1,
 * optional `delay` and `stagger` for child groups.
 */
export function FadeUp({
  as: Tag = 'div',
  children,
  delay = 0,
  stagger,
  className,
}: FadeUpProps) {
  const scopeRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const targets =
        stagger !== undefined && root.children.length > 0
          ? Array.from(root.children)
          : [root];

      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.fromTo(
          targets,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.ui,
            delay,
            ease: EASE.soft,
            scrollTrigger: {
              trigger: root,
              start: SCROLL.start,
              once: true,
            },
          },
        );
      });

      mm.add(
        {
          motionOk: MEDIA_QUERIES.motionOk,
          isMobile: MEDIA_QUERIES.mobile,
        },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;

          const riseDistance = isMobile ? DIST.rise * 0.5 : DIST.rise;

          gsap.fromTo(
            targets,
            { y: riseDistance, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: DUR.text,
              delay,
              stagger,
              ease: EASE.out,
              scrollTrigger: {
                trigger: root,
                start: SCROLL.start,
                once: true,
              },
            },
          );
        },
      );
    },
    { scope: scopeRef, dependencies: [delay, stagger] },
  );

  return (
    <Tag ref={scopeRef} className={className}>
      {children}
    </Tag>
  );
}
