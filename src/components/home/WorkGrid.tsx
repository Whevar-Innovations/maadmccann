import { useEffect, useState } from 'react';
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
 * Zero-gap tiles sized to the design (1920 artboard):
 * - Slot 0: tall, left half (960x1413), spans three rows.
 * - Slots 1 to 3: stacked, right half (960x471 each).
 * - Slot 4: full-width banner (1920x800).
 * Single column in order 0 to 4 below 768px.
 * On touch devices one card at a time can be "active" (tapped once to reveal View work).
 */
export function WorkGrid({ projects }: WorkGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Tapping anywhere outside a work card dismisses the active card.
  useEffect(() => {
    if (!activeId) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest('[data-work-card]')) setActiveId(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeId]);

  return (
    <section
      id="work"
      aria-labelledby="work-grid-heading"
      data-work-grid
      className="overflow-x-clip"
    >
      <h2 id="work-grid-heading" className="sr-only">
        Featured Work
      </h2>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {projects.slice(0, 5).map((project, index) => (
          <WorkCard
            key={project.id}
            project={project}
            slotIndex={index}
            active={activeId === project.id}
            onActivate={() => setActiveId(project.id)}
            className={SLOT_LAYOUT[index] ?? ''}
          />
        ))}
      </div>
    </section>
  );
}
