import { useRef, useState, type ReactNode } from 'react';
import type { TeamBio } from '@/content/types';
import { gsap } from '@/motion/gsap-setup';
import { EASE } from '@/motion/tokens';

export type BioContentProps = {
  bio: TeamBio;
  /** Smaller type for the hover panel. */
  compact?: boolean;
  /** Brands / Projects start collapsed behind a toggle (phones, where the lists are very long). */
  collapsible?: boolean;
};

const LABEL = 'font-display text-[0.7rem] font-bold tracking-[0.1em] text-impact-red uppercase';

/** Bio body shared by the hover panel and the profile dialog. */
export function BioContent({ bio, compact = false, collapsible = false }: BioContentProps) {
  const text = compact
    ? 'text-[0.8rem] leading-[1.55] xl:text-[0.84rem]'
    : 'text-[0.95rem] leading-[1.65] sm:text-[0.95rem]';

  const lists = [
    bio.brands && { title: 'Brands / Organisations', body: bio.brands },
    bio.projects && { title: 'Projects', body: bio.projects },
  ].filter((x): x is { title: string; body: string } => Boolean(x));

  return (
    <div className={`text-ink/90 ${text}`}>
      <div className="space-y-[1em]">
        {bio.paragraphs.map((p) => (
          <p key={p.slice(0, 32)} data-bio-item>
            {p}
          </p>
        ))}
      </div>

      {lists.length > 0 &&
        (collapsible ? (
          <div data-bio-item className="mt-7 border-t border-ink/10">
            {lists.map((l) => (
              <Disclosure key={l.title} title={l.title}>
                {l.body}
              </Disclosure>
            ))}
          </div>
        ) : (
          <div className="mt-[1.2em] space-y-[1em]">
            {lists.map((l) => (
              <div key={l.title} data-bio-item>
                <h4 className={LABEL}>{l.title}</h4>
                <p className="mt-1">{l.body}</p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

/** Full-width toggle row with a +/× icon; the body animates its height open and closed. */
function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => {
    const body = bodyRef.current;
    const next = !open;
    setOpen(next);
    if (!body) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(body, { height: next ? 'auto' : 0 });
      return;
    }
    gsap.to(body, {
      height: next ? 'auto' : 0,
      duration: next ? 0.55 : 0.35,
      ease: next ? EASE.out : EASE.soft,
      overwrite: 'auto',
    });
  };

  return (
    <div className="border-b border-ink/10">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          onClick={toggle}
          className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left"
        >
          <span className={LABEL}>{title}</span>
          <span
            aria-hidden="true"
            className={`relative h-3.5 w-3.5 shrink-0 text-impact-red transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          >
            <span className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2 bg-current" />
            <span className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 bg-current" />
          </span>
        </button>
      </h4>
      <div ref={bodyRef} className="h-0 overflow-hidden" inert={!open}>
        <p className="pb-4">{children}</p>
      </div>
    </div>
  );
}
