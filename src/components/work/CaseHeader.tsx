import { useRef } from 'react';
import type { CaseStudyPage } from '@/content/types';
import { useHeroEntrance } from '@/motion/useHeroEntrance';

export type CaseHeaderProps = {
  clientLabel: CaseStudyPage['clientLabel'];
  client: CaseStudyPage['client'];
  title: CaseStudyPage['title'];
};

/** `CLIENT: <name>` on the left, the case title on the right (stacked on mobile). */
export function CaseHeader({ clientLabel, client, title }: CaseHeaderProps) {
  const ref = useRef<HTMLElement | null>(null);
  useHeroEntrance(ref, { targets: '[data-case-enter]' });

  return (
    <header ref={ref} className="container-site pt-32 pb-10 md:pt-40 md:pb-16 lg:pt-56 lg:pb-24">
      <div className="mx-auto grid max-w-case gap-4 md:grid-cols-[13rem_1fr] md:gap-8">
        <p data-case-enter className="text-case-client text-ink">
          <span className="block font-semibold">{clientLabel}</span>
          <span className="block">{client}</span>
        </p>
        <h1
          data-case-enter
          className="font-display text-case-title font-bold text-balance text-ink"
        >
          {title}
        </h1>
      </div>
    </header>
  );
}
