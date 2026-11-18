import type { HomePage } from '@/content/types';

export type ImpactProps = {
  impact: HomePage['impact'];
};

/**
 * Formats the impact body into the two paragraphs shown in Screenshot 14-01-42.png,
 * bolding "MAAD McCANN" when present.
 */
function renderImpactBody(body: string) {
  const splitMarker = 'At MAAD McCANN,';
  const idx = body.indexOf(splitMarker);
  if (idx === -1) {
    return <p>{body}</p>;
  }

  const firstParagraph = body.slice(0, idx).trim();
  const secondRest = body.slice(idx + splitMarker.length);

  return (
    <>
      <p>{firstParagraph}</p>
      <p className="mt-5">
        At <strong className="font-bold text-ink">MAAD McCANN</strong>,{secondRest}
      </p>
    </>
  );
}

/**
 * Impact section (SPEC §7 #6, matching Screenshot From 2026-11-18 14-01-42.png).
 * Two columns: OUR IMPACT in impact-red on the left, two-paragraph copy on the right.
 * Below: four stats in a row (2x2 below 1024px) with big red number, divider line, bold label, and small description.
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
        <div className="mx-auto max-w-5xl">
          {/* Top 2 columns: OUR IMPACT left, paragraph right */}
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-3">
              <h2
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
              </h2>
            </div>

            <div className="text-body leading-relaxed font-medium text-ink/90 lg:col-span-9">
              {renderImpactBody(impact.body)}
            </div>
          </div>

          {/* Bottom 4 stats row (2x2 below 1024px) */}
          <dl className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-12">
            {impact.stats.map((stat) => {
              const formattedValue = stat.decimals
                ? stat.value.toFixed(stat.decimals)
                : String(stat.value);

              return (
                <div key={stat.label} data-stat-item className="flex flex-col">
                  <dd className="font-display text-stat font-black tracking-display text-impact-red tabular-nums">
                    <span data-stat-value={stat.value} data-stat-decimals={stat.decimals ?? 0}>
                      {formattedValue}
                    </span>
                    <span>{stat.suffix}</span>
                  </dd>

                  <dt className="mt-5 border-t border-ink/25 pt-5 text-stat-label font-bold text-ink">
                    {stat.label}
                  </dt>

                  <dd className="mt-1.5 text-stat-desc leading-snug font-medium text-ink/70">
                    {stat.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
