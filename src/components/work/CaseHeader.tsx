import type { CaseStudyPage } from '@/content/types';
import { RevealText } from '@/motion/RevealText';

export type CaseHeaderProps = {
  clientLabel: CaseStudyPage['clientLabel'];
  client: CaseStudyPage['client'];
  title: CaseStudyPage['title'];
};

/** `CLIENT: <name>` on the left, the case title on the right (stacked on mobile). */
export function CaseHeader({ clientLabel, client, title }: CaseHeaderProps) {
  return (
    <header className="container-site pt-32 pb-10 md:pt-40 md:pb-14 lg:pt-48 lg:pb-16">
      <div className="mx-auto grid max-w-[64rem] gap-4 md:grid-cols-[15rem_1fr] md:gap-8">
        <p className="text-body leading-snug text-ink">
          <span className="block font-semibold">{clientLabel}</span>
          <span className="block">{client}</span>
        </p>
        <RevealText
          as="h1"
          className="font-display text-case-title font-bold text-balance text-ink"
        >
          {title}
        </RevealText>
      </div>
    </header>
  );
}
