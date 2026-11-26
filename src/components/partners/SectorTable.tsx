import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import type { PartnersPage, PartnerSector } from '@/content/types';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { fill } from '@/lib/pagination';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { DIST, DUR, EASE, PARTNERS, SCROLL, STAGGER } from '@/motion/tokens';
import { PartnerLogoTile } from './PartnerLogoTile';

export type SectorTableProps = {
  sectors: PartnersPage['sectors'];
  filterLabel: string;
  allLabel: string;
  labels: PartnersPage['labels'];
};

const FILTER_ID = 'partners-filter';

/**
 * The sector filter and the partners table.
 *
 * The selected sector lives in the URL (`?sector=beverages`), so a filter is shareable and the back
 * button steps through filters; an unknown id falls back to all sectors. Desktop: a hairline-ruled
 * table (label column + logo grid), like the design. Mobile: stacked sector blocks with a label bar
 * (and count) over a 2–3 column logo grid.
 *
 * Motion: as rows scroll in (batched, in reading order) each row's top rule draws left to right, the
 * desktop divider draws down, the label rises out of its mask and the logos settle in one by one.
 * Changing the filter remounts the table, so the chosen rows replay that entrance. Reduced motion:
 * fades only.
 */
export function SectorTable({ sectors, filterLabel, allLabel, labels }: SectorTableProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [params, setParams] = useSearchParams();
  const { scrollToHash } = useSmoothScroll();

  const requested = params.get('sector');
  const selected: PartnerSector | undefined = sectors.find((s) => s.id === requested);
  const visible = selected ? [selected] : sectors;
  const total = useMemo(() => sectors.reduce((sum, s) => sum + s.logos.length, 0), [sectors]);
  const options = useMemo(
    () => sectors.map((s) => ({ id: s.id, label: s.filterLabel ?? s.label, count: s.logos.length })),
    [sectors],
  );

  const choose = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set('sector', id);
    else next.delete('sector');
    setParams(next, { preventScrollReset: true });
  };

  // After a filter change, bring the filter back into view if the table had scrolled it away.
  const lastRef = useRef(selected?.id ?? null);
  useEffect(() => {
    const current = selected?.id ?? null;
    if (current === lastRef.current) return;
    lastRef.current = current;
    const filter = document.getElementById(FILTER_ID);
    if (filter && filter.getBoundingClientRect().top < 0) scrollToHash(`#${FILTER_ID}`);
  }, [selected, scrollToHash]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-sector]'));
      if (rows.length === 0) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.set(rows, { opacity: 0 });
        const batch = ScrollTrigger.batch(rows, {
          start: SCROLL.start,
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, duration: DUR.ui, ease: EASE.soft, stagger: STAGGER.items }),
        });
        return () => batch.forEach((t) => t.kill());
      });

      mm.add({ motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile }, (context) => {
        const { motionOk, isMobile } = context.conditions ?? {};
        if (!motionOk) return;
        const rise = isMobile ? PARTNERS.logoRise / 2 : PARTNERS.logoRise;
        const scaleFrom = isMobile ? 1 - (1 - PARTNERS.logoScaleFrom) / 2 : PARTNERS.logoScaleFrom;
        const parts = (row: Element) => ({
          top: row.querySelector('[data-rule-top]'),
          side: row.querySelector('[data-rule-side]'),
          label: row.querySelector('[data-label]'),
          logos: Array.from(row.querySelectorAll('[data-logo]')),
        });

        rows.forEach((row) => {
          const p = parts(row);
          if (p.top) gsap.set(p.top, { scaleX: 0 });
          if (p.side) gsap.set(p.side, { scaleY: 0 });
          if (p.label) gsap.set(p.label, { yPercent: DIST.maskFrom });
          gsap.set(p.logos, { opacity: 0, y: rise, scale: scaleFrom });
        });

        const batch = ScrollTrigger.batch(rows, {
          start: SCROLL.start,
          once: true,
          onEnter: (els) => {
            els.forEach((row, i) => {
              const p = parts(row);
              const tl = gsap.timeline({ delay: i * PARTNERS.rowStagger });
              if (p.top) tl.to(p.top, { scaleX: 1, duration: DUR.media, ease: EASE.inOut }, 0);
              if (p.side) tl.to(p.side, { scaleY: 1, duration: DUR.media, ease: EASE.inOut }, PARTNERS.sideAt);
              if (p.label) tl.to(p.label, { yPercent: 0, duration: DUR.text, ease: EASE.out }, PARTNERS.labelAt);
              tl.to(
                p.logos,
                { opacity: 1, y: 0, scale: 1, duration: DUR.text, ease: EASE.out, stagger: PARTNERS.logoStagger },
                PARTNERS.logosAt,
              );
            });
          },
        });
        return () => batch.forEach((t) => t.kill());
      });
    },
    { scope: rootRef, dependencies: [selected?.id] },
  );

  const shownCount = visible.reduce((sum, s) => sum + s.logos.length, 0);

  return (
    <div ref={rootRef} className="container-site pb-24 md:pb-32 lg:pb-40">
      <div id={FILTER_ID} className="scroll-mt-28">
        <CategoryFilter
          label={filterLabel}
          allLabel={allLabel}
          allCount={total}
          categories={options}
          value={selected?.id ?? null}
          onChange={choose}
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {fill(
          !selected ? labels.announceAll : shownCount === 1 ? labels.announceOne : labels.announce,
          { count: shownCount, sector: selected?.label ?? '' },
        )}
      </p>

      {/* Keyed by the filter: a new selection remounts the rows so their entrance replays. */}
      <div key={selected?.id ?? 'all'} className="mx-auto mt-10 max-w-content border-b border-ink md:mt-14 md:border-x">
        {visible.map((sector) => (
          <section
            key={sector.id}
            data-sector
            aria-labelledby={`sector-${sector.id}`}
            className="relative md:grid md:grid-cols-[11rem_1fr] lg:grid-cols-[clamp(15rem,12.5vw,20rem)_1fr]"
          >
            <span data-rule-top aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <span
              data-rule-side
              aria-hidden="true"
              className="absolute inset-y-0 left-[11rem] hidden w-px origin-top bg-ink md:block lg:left-[clamp(15rem,12.5vw,20rem)]"
            />

            <div className="flex items-baseline justify-between gap-4 pt-5 pb-3 md:items-center md:justify-center md:px-6 md:py-10">
              <h2 id={`sector-${sector.id}`} className="overflow-hidden">
                <span
                  data-label
                  className="block text-body leading-snug font-medium text-balance text-ink uppercase md:text-center"
                >
                  {sector.label}
                </span>
              </h2>
              <span className="text-small text-ink/60 tabular-nums md:hidden">{sector.logos.length}</span>
            </div>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 pb-8 min-[380px]:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(clamp(7rem,5.8333vw,9.3333rem),1fr))] md:gap-x-6 md:gap-y-10 md:px-8 md:py-10 lg:px-10">
              {sector.logos.map((logo) => (
                <li key={logo.id} data-logo className="flex items-center justify-center">
                  <PartnerLogoTile logo={logo} hint={labels.viewCaseStudy} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
