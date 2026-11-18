import type { Project } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { Link } from '@/components/ui/Link';

export type WorkCardProps = {
  project: Project;
  slotIndex: number;
  className?: string;
};

/**
 * Individual work tile (SPEC §7 #5 & §8.6).
 * Full-bleed image, bottom gradient, label bottom-left (`Client: Title`) and `View work ——` with a line.
 */
export function WorkCard({ project, slotIndex, className = '' }: WorkCardProps) {
  const isBanner = slotIndex === 4;
  const isTall = slotIndex === 0;

  const sizes = isBanner
    ? '100vw'
    : '(min-width: 768px) 50vw, 100vw';

  return (
    <article
      data-work-card
      data-work-slot={slotIndex}
      className={`group relative overflow-hidden bg-ink text-paper ${className}`.trim()}
    >
      <Link
        href={project.href}
        aria-label={`${project.client}: ${project.title} — View work`}
        className="relative block h-full w-full"
      >
        <div
          className={`relative h-full w-full overflow-hidden ${
            isTall
              ? 'aspect-[3/4] md:aspect-auto md:h-full'
              : isBanner
                ? 'aspect-[16/9] md:aspect-[21/9]'
                : 'aspect-[16/9]'
          }`}
        >
          <Img
            image={project.image}
            sizes={sizes}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Bottom dark gradient overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500"
          />
        </div>

        {/* Bottom-left caption: Client: Title + View work —— */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">
          <h3 className="text-tile-label leading-tight font-semibold text-paper">
            {project.client}: {project.title}
          </h3>
          <div className="mt-2 inline-flex items-center gap-3 text-sub font-regular text-paper/90">
            <span>View work</span>
            <span
              data-work-line
              aria-hidden="true"
              className="inline-flex items-center"
            >
              <span className="inline-block h-[1.5px] w-6 bg-paper/90 transition-all duration-500 group-hover:w-12" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="-ml-1"
              >
                <path d="m4 2 4 4-4 4" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
