import type { CaseStudyPage } from '@/content/types';
import { FadeUp } from '@/motion/FadeUp';
import { RevealText } from '@/motion/RevealText';
import { CASE_STUDY } from '@/motion/tokens';

export type CaseStoryProps = {
  headline: CaseStudyPage['headline'];
  story: CaseStudyPage['story'];
};

/** Centred headline, then the story in short labelled paragraphs. */
export function CaseStory({ headline, story }: CaseStoryProps) {
  return (
    <section
      aria-labelledby="case-story-heading"
      className="container-site py-14 md:py-20 lg:py-24"
    >
      <RevealText
        as="h2"
        id="case-story-heading"
        className="mx-auto max-w-6xl text-center font-display text-case-title font-bold text-balance text-ink"
      >
        {headline}
      </RevealText>

      <FadeUp
        stagger={CASE_STUDY.storyStagger}
        className="mx-auto mt-8 flex max-w-6xl flex-col gap-6 text-center text-case-body text-ink md:mt-12"
      >
        {story.map((paragraph) => (
          <p key={`${paragraph.label ?? ''}${paragraph.body.slice(0, 24)}`}>
            {paragraph.label && <strong className="font-semibold">{paragraph.label}: </strong>}
            {paragraph.body}
          </p>
        ))}
      </FadeUp>
    </section>
  );
}
