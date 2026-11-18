import type { HomePage } from '@/content/types';
import { Counter } from '@/motion/Counter';
import { FadeUp } from '@/motion/FadeUp';
import { RevealText } from '@/motion/RevealText';
import { STAGGER } from '@/motion/tokens';

export type ImpactProps = {
  impact: HomePage['impact'];
};

function renderImpactBody(body: string) {
  const splitMarker = 'At MAAD McCANN,';
  const idx = body.indexOf(splitMarker);
  if (idx === -1) {
    return <RevealText as="p">{body}</RevealText>;
  }

  const firstParagraph = body.slice(0, idx).trim();
  const secondRest = body.slice(idx + splitMarker.length);

  return (
    <>
      <RevealText as="p">{firstParagraph}</RevealText>
      <RevealText as="p" delay={0.12} className="mt-5">
        At <strong className="font-bold text-ink">MAAD McCANN</strong>,{secondRest}
      </RevealText>
    </>
  );
}

/**
 * Impact section (SPEC §7 #6 & §8.5, matching Screenshot From 2026-11-18 14-01-42.png).
 * - OUR IMPACT heading and paragraphs use <RevealText>.
 * - Stats use <FadeUp stagger> plus <Counter>.
 */
export function Impact({ impact }: ImpactProps) {
  const headingWords = impact.heading.split(' ');

  return (
    <section
      aria-labelledby="impact-heading"
      data-impact-section
      className="bg-paper py-24 text-ink lg:py-32"
    >
      <div className="container-site">
        <div className="mx-auto max-w-7xl">
          {/* Top 2 columns: OUR IMPACT left, paragraph right */}
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-3">
              <RevealText
                as="h2"
                id="impact-heading"
                className="font-display text-impact leading-[0.95] font-black tracking-display text-impact-red uppercase"
              >
                {headingWords.length === 2 ? (
                  <>
                    <span className="block">{headingWords[0]}</span>
                    <span className="block">{headingWords[1]}</span>
                  </>
                ) : (
                  impact.heading
                )}
              </RevealText>
            </div>

            <div className="text-body leading-relaxed font-medium text-ink/90 lg:col-span-9">
              {renderImpactBody(impact.body)}
            </div>
          </div>

          {/* Bottom 4 stats row (2x2 below 1024px) */}
          <FadeUp
            as="dl"
            stagger={STAGGER.items}
            className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-12"
          >
            {impact.stats.map((stat) => (
              <div
                key={stat.label}
                data-stat-item
                className="flex flex-col will-change-transform"
              >
                <dd className="font-display text-stat font-black tracking-display text-impact-red tabular-nums">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                </dd>

                <dt className="mt-5 border-t border-ink/25 pt-5 text-stat-label font-bold text-ink">
                  {stat.label}
                </dt>

                <dd className="mt-1.5 text-stat-desc leading-snug font-medium text-ink/70">
                  {stat.description}
                </dd>
              </div>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
