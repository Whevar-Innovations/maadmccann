import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import type { WorkPage } from '@/content/types';
import { clampPage, fill } from '@/lib/pagination';
import { FadeUp } from '@/motion/FadeUp';
import { useSmoothScroll } from '@/motion/SmoothScroll';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { Pagination } from './Pagination';
import { ProjectCard } from './ProjectCard';

export type ProjectGridProps = {
  page: Pick<
    WorkPage,
    'filterLabel' | 'allLabel' | 'categories' | 'pageSize' | 'projects' | 'labels'
  >;
};

/**
 * Sector filter + project grid + paginator. The selection lives in the URL
 * (`?category=finance&page=2`), so it's shareable and the back button steps through it.
 * An unknown category falls back to all work; an out-of-range page clamps to the last page.
 */
export function ProjectGrid({ page }: ProjectGridProps) {
  const { filterLabel, allLabel, categories, pageSize, projects, labels } = page;
  const [params, setParams] = useSearchParams();
  const { scrollToHash } = useSmoothScroll();

  const requested = params.get('category');
  const category = categories.some((c) => c.id === requested) ? requested : null;

  const filtered = useMemo(
    () => (category ? projects.filter((p) => p.categoryIds.includes(category)) : projects),
    [projects, category],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = clampPage(Number(params.get('page') ?? 1), pageCount);
  const start = (current - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  const update = (next: { category?: string | null; page?: number }) => {
    const nextParams = new URLSearchParams(params);
    if (next.category !== undefined) {
      if (next.category) nextParams.set('category', next.category);
      else nextParams.delete('category');
      nextParams.delete('page'); // a new sector starts on its first page
    }
    if (next.page !== undefined) {
      if (next.page > 1) nextParams.set('page', String(next.page));
      else nextParams.delete('page');
    }
    setParams(nextParams, { preventScrollReset: true });
  };

  // After a page change, bring the top of the results back into view.
  const lastPageRef = useRef(current);
  useEffect(() => {
    if (lastPageRef.current !== current) scrollToHash('#work-results');
    lastPageRef.current = current;
  }, [current, scrollToHash]);

  const from = filtered.length === 0 ? 0 : start + 1;
  const to = start + visible.length;

  return (
    <section
      id="work-results"
      aria-labelledby="work-results-heading"
      className="scroll-mt-24 bg-paper py-14 md:py-20"
    >
      <h2 id="work-results-heading" className="sr-only">
        Projects
      </h2>
      <div className="container-site">
        <CategoryFilter
          label={filterLabel}
          allLabel={allLabel}
          categories={categories}
          value={category}
          onChange={(id) => update({ category: id })}
        />

        <div className="mx-auto mt-12 max-w-grid md:mt-16">
          {visible.length > 0 ? (
            <>
              <p className="mb-4 text-small text-ink/60 tabular-nums">
                {fill(labels.summary, { from, to, total: filtered.length })}
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-body text-ink/70">{labels.empty}</p>
          )}

          {pageCount > 1 && (
            <FadeUp className="mt-12 border-t border-line pt-8 md:mt-16">
              <Pagination
                page={current}
                pageCount={pageCount}
                labels={labels}
                onChange={(next) => update({ page: next })}
              />
            </FadeUp>
          )}
          <p aria-live="polite" className="sr-only">
            {fill(labels.announce, { page: current, total: pageCount, count: visible.length })}
          </p>
        </div>
      </div>
    </section>
  );
}
