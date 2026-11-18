import type { Project } from '@/content/types';
import { WorkCard } from './WorkCard';

export type WorkGridProps = {
  projects: Project[];
};

const SLOT_LAYOUT: readonly string[] = [
  // Slot 0: tall, left half, spans three rows on md+
  'md:col-start-1 md:row-start-1 md:row-span-3',
  // Slot 1: stacked right half, row 1
  'md:col-start-2 md:row-start-1',
  // Slot 2: stacked right half, row 2
  'md:col-start-2 md:row-start-2',
  // Slot 3: stacked right half, row 3
  'md:col-start-2 md:row-start-3',
  // Slot 4: full-width banner across both columns
  'md:col-span-2',
];

/**
 * Work grid section (SPEC §7 #5 & §8.9).
 * Zero-gap tiles:
 * - Slot 0: tall, left half, spans three rows.
 * - Slots 1 to 3: stacked, right half.
 * - Slot 4: full-width banner (about 21:9).
 * Single column in order 0 to 4 below 768px.
 */
export function WorkGrid({ projects }: WorkGridProps) {
  return (
    <section id="work" aria-labelledby="work-grid-heading" data-work-grid>
      <h2 id="work-grid-heading" className="sr-only">
        Featured Work
      </h2>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {projects.slice(0, 5).map((project, index) => (
          <WorkCard
            key={project.id}
            project={project}
            slotIndex={index}
            className={SLOT_LAYOUT[index] ?? ''}
          />
        ))}
      </div>
    </section>
  );
}
