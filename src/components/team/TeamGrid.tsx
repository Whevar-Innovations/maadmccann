import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { TeamMember, TeamRow, TeamSection } from '@/content/types';
import { gsap, MEDIA_QUERIES, ScrollTrigger, useGSAP } from '@/motion/gsap-setup';
import { useLoaderState } from '@/motion/LoaderProvider';
import { DUR, EASE, TEAM_GRID } from '@/motion/tokens';
import { BioPanel, type BioPanelTarget } from './BioPanel';
import { ProfileDialog } from './ProfileDialog';
import { TeamCard } from './TeamCard';

const HOVER_CLOSE_DELAY_MS = 140;

const cardIdOf = (section: TeamSection, member: TeamMember) => `${section.id}--${member.slug}`;

/**
 * Department groups from the design: Board, Management, Creative, three side-by-side pairs
 * (Digital/PR, Operations/Finance, Media/SBCC), Business Development and Production.
 *
 * Sizing: 2 cards per row on phones, 3 on large phones, 4 on tablets; from lg every card is a
 * fixed --card width and a group wraps at its design column count. Pairs sit side by side from
 * 1440px, where there is room for them at full card size.
 *
 * The profile dialog opens on the department's list of people with bios, so it can page
 * through colleagues without closing.
 *
 * Motion: headings rise out of a mask; cards "fall" into place in batches as they scroll in
 * (rise + scale + fade, portrait settles from a zoom, captions follow).
 */
export type TeamGridProps = { rows: TeamRow[] };

export function TeamGrid({ rows }: TeamGridProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [hover, setHover] = useState<BioPanelTarget | null>(null);
  const [dialog, setDialog] = useState<{ people: TeamMember[]; index: number; label: string } | null>(
    null,
  );
  const dialogOpen = dialog !== null;
  const { isHeroReady } = useLoaderState();

  const { membersById, sectionById } = useMemo(() => {
    const members = new Map<string, TeamMember>();
    const sections = new Map<string, TeamSection>();
    for (const row of rows) {
      for (const section of Array.isArray(row) ? row : [row]) {
        for (const m of section.members) {
          members.set(cardIdOf(section, m), m);
          sections.set(cardIdOf(section, m), section);
        }
      }
    }
    return { membersById: members, sectionById: sections };
  }, []);

  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setHover(null), HOVER_CLOSE_DELAY_MS);
  }, []);

  const onHoverStart = useCallback(
    (cardId: string, el: HTMLElement) => {
      const member = membersById.get(cardId);
      if (!member?.bio || dialogOpen) return;
      cancelClose();
      setHover((prev) => (prev?.cardId === cardId ? prev : { cardId, member, el }));
    },
    [membersById, cancelClose, dialogOpen],
  );

  const onOpen = useCallback(
    (cardId: string, el: HTMLElement) => {
      const member = membersById.get(cardId);
      const section = sectionById.get(cardId);
      if (!member?.bio || !section) return;
      const people = section.members.filter((m) => m.bio);
      cancelClose();
      setHover(null);
      returnFocusRef.current = el;
      setDialog({ people, index: Math.max(people.indexOf(member), 0), label: section.title });
    },
    [membersById, sectionById, cancelClose],
  );

  const onDialogClosed = useCallback(() => {
    setDialog(null);
    returnFocusRef.current?.focus({ preventScroll: true });
  }, []);

  // The panel is placed from layout measurements; drop it when the layout changes, and on Esc.
  useEffect(() => {
    const close = () => setHover(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('resize', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  useGSAP(
    () => {
      const root = wrapRef.current;
      if (!root || !isHeroReady) return;
      const headings = gsap.utils.toArray<HTMLElement>('[data-team-heading]', root);
      const cards = gsap.utils.toArray<HTMLElement>('[data-team-card]', root);
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        gsap.set(cards, { opacity: 0 });
        const batch = ScrollTrigger.batch(cards, {
          start: TEAM_GRID.reducedStart,
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, duration: DUR.ui, stagger: TEAM_GRID.reducedStagger }),
        });
        return () => batch.forEach((t) => t.kill());
      });

      mm.add(
        { motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile },
        (context) => {
          const { motionOk, isMobile } = context.conditions ?? {};
          if (!motionOk) return;
          const k = isMobile ? 0.5 : 1;

          headings.forEach((h) => {
            gsap.fromTo(
              h,
              { yPercent: TEAM_GRID.headingFromYPercent },
              {
                yPercent: 0,
                duration: DUR.text,
                ease: EASE.out,
                scrollTrigger: { trigger: h.parentElement, start: TEAM_GRID.headingStart, once: true },
              },
            );
          });

          const mediaOf = (els: Element[]) =>
            els.map((el) => el.querySelector('[data-card-media]')).filter(Boolean);
          const captionsOf = (els: Element[]) =>
            els.flatMap((el) => Array.from(el.querySelectorAll('[data-card-caption]')));

          gsap.set(cards, { y: TEAM_GRID.rise * k, scale: TEAM_GRID.scaleFrom, opacity: 0, transformOrigin: TEAM_GRID.origin });
          gsap.set(mediaOf(cards), { scale: TEAM_GRID.mediaScaleFrom });
          gsap.set(captionsOf(cards), { y: TEAM_GRID.captionRise, opacity: 0 });

          const batch = ScrollTrigger.batch(cards, {
            start: TEAM_GRID.start,
            once: true,
            batchMax: TEAM_GRID.batchMax,
            onEnter: (els) => {
              const stagger = TEAM_GRID.stagger;
              gsap.to(els, {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: TEAM_GRID.duration,
                stagger,
                ease: EASE.out,
                clearProps: 'transform,opacity',
              });
              gsap.to(mediaOf(els), { scale: 1, duration: TEAM_GRID.mediaDuration, stagger, ease: EASE.out, clearProps: 'transform' });
              gsap.to(captionsOf(els), {
                y: 0,
                opacity: 1,
                duration: TEAM_GRID.captionDuration,
                stagger: TEAM_GRID.captionStagger,
                delay: TEAM_GRID.captionDelay,
                ease: EASE.out,
              });
            },
          });
          return () => batch.forEach((t) => t.kill());
        },
      );
    },
    { scope: wrapRef, dependencies: [isHeroReady] },
  );

  const renderSection = (section: TeamSection) => (
    <section
      key={section.id}
      id={section.id}
      aria-labelledby={`team-${section.id}-title`}
      style={{ '--cols': section.columns } as CSSProperties}
      className="flex w-full scroll-mt-28 flex-col items-center xl:w-auto"
    >
      <h2 id={`team-${section.id}-title`} className="overflow-hidden pb-[0.08em]">
        <span
          data-team-heading
          className="block font-display text-[clamp(1.05rem,1.35vw,1.6rem)] leading-none font-bold tracking-[-0.01em] text-ink uppercase will-change-transform"
        >
          {section.title}
        </span>
      </h2>
      <div className="mt-5 flex w-full flex-wrap justify-center gap-(--gap) sm:mt-6 lg:max-w-[calc(var(--cols)*var(--card)+(var(--cols)-1)*var(--gap))]">
        {section.members.map((m) => {
          const cardId = cardIdOf(section, m);
          return (
            <TeamCard
              key={cardId}
              member={m}
              cardId={cardId}
              active={hover?.cardId === cardId}
              onHoverStart={onHoverStart}
              onHoverEnd={scheduleClose}
              onOpen={onOpen}
            />
          );
        })}
      </div>
    </section>
  );

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto flex w-full max-w-[2200px] flex-col gap-y-14 px-3.5 pt-14 pb-24 [--card-n:2] [--gap:0.625rem] sm:gap-y-16 sm:px-8 sm:pt-16 sm:[--card-n:3] sm:[--gap:0.75rem] md:[--card-n:4] lg:gap-y-20 lg:pb-36 lg:[--card:min(15rem,14.5vw)] lg:[--gap:clamp(0.6rem,0.75vw,1rem)] xl:[--card:min(15rem,10.6vw)]"
    >
      {rows.map((row) =>
        Array.isArray(row) ? (
          <div
            key={row.map((s) => s.id).join('+')}
            className="flex flex-col items-center gap-y-14 sm:gap-y-16 lg:gap-y-20 xl:flex-row xl:items-start xl:justify-center xl:gap-x-[3.5vw]"
          >
            {row.map(renderSection)}
          </div>
        ) : (
          renderSection(row)
        ),
      )}

      <BioPanel
        target={hover}
        containerRef={wrapRef}
        onPointerEnter={cancelClose}
        onPointerLeave={scheduleClose}
      />

      {dialog && (
        <ProfileDialog
          people={dialog.people}
          startIndex={dialog.index}
          groupLabel={dialog.label}
          onClosed={onDialogClosed}
        />
      )}
    </div>
  );
}
