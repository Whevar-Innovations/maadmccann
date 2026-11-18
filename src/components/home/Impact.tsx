import type { HomePage } from '@/content/types';

export type ImpactProps = {
  impact: HomePage['impact'];
};

/**
 * Impact section (SPEC §7 #6).
 * Two columns: OUR IMPACT in impact-red on the left, paragraph on the right.
 * Below: four stats in a row (2x2 below 1024px) with big number, divider, bold label, and small grey description.
 */
export function Impact({ impact }: ImpactProps) {
  const headingWords = impact.heading.split(' ');

  return (
    <section
      aria-labelledby="impact-heading"
      data-impact-section
      className="bg-paper py-20 text-ink lg:py-28"
    >
      <div className="container-site">
        {/* Top 2 columns: OUR IMPACT left, paragraph right */}
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2
              id="impact-heading"
              className="font-display text-impact font-black tracking-display text-impact-red uppercase"
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

          <div className="lg:col-span-8">
            <p className="max-w-[68ch] text-body font-medium text-ink/90">
              {impact.body}
            </p>
          </div>
        </div>

        {/* Bottom 4 stats row (2x2 below 1024px) */}
        <dl className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-12">
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

                <dt className="mt-5 border-t border-ink/20 pt-5 text-stat-label font-bold text-ink">
                  {stat.label}
                </dt>

                <dd className="mt-1.5 text-stat-desc font-medium text-ink/65">
                  {stat.description}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
