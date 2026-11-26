import type { FocusEvent, PointerEvent } from 'react';
import type { TeamMember } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { preloadDialogPhoto } from './ProfileDialog';

export type TeamCardProps = {
  member: TeamMember;
  /** Unique per rendered card (a person can appear in several sections). */
  cardId: string;
  /** This card's bio panel is showing. */
  active: boolean;
  onHoverStart: (cardId: string, el: HTMLElement) => void;
  onHoverEnd: () => void;
  onOpen: (cardId: string, el: HTMLElement) => void;
};

/**
 * Every card is the same size. Below lg it is a fraction of the row (--card-n per row, set by
 * TeamGrid); from lg it is the fixed --card width and each group is capped to its column count.
 */
const CARD_WIDTH =
  'shrink-0 w-[calc((100%-(var(--card-n)-1)*var(--gap))/var(--card-n))] lg:w-[var(--card)]';

/**
 * Black-and-white portrait card: name, title and "See profile" over a dark bottom fade.
 * With a bio it is a button: mouse hover or keyboard focus shows the floating bio panel, and a
 * click or tap opens the full profile dialog (the only route on touch screens). Without a bio it
 * is a plain figure with no "See profile".
 */
export function TeamCard({ member, cardId, active, onHoverStart, onHoverEnd, onOpen }: TeamCardProps) {
  const hasBio = Boolean(member.bio);

  const face = (
    <>
      <div data-card-media className="absolute inset-0 will-change-transform">
        <Img
          image={member.image}
          sizes="(min-width: 1440px) 11vw, (min-width: 1024px) 15vw, (min-width: 768px) 24vw, (min-width: 640px) 31vw, 48vw"
          className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-expo group-hover:scale-[1.06] group-focus-visible:scale-[1.06] group-data-[active=true]:scale-[1.06]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black via-black/70 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col px-[9%] pb-[7%] text-left text-paper">
        <span
          data-card-caption
          className="font-display text-[clamp(0.9rem,3.6vw,1.05rem)] leading-[1.1] font-bold tracking-[-0.01em] sm:text-[clamp(0.85rem,1.9vw,1.05rem)] lg:text-[clamp(0.78rem,min(1.02vw,max(1.2rem,1vw)),1.6rem)]"
        >
          {member.name}
        </span>
        <span
          data-card-caption
          className="mt-[0.3em] text-[clamp(0.66rem,2.6vw,0.76rem)] leading-[1.25] font-medium text-paper/85 sm:text-[clamp(0.62rem,1.3vw,0.76rem)] lg:text-[clamp(0.56rem,0.66vw,1.056rem)]"
        >
          {member.title}
        </span>
        {/*
          "See profile" row. With a mouse it starts collapsed (0fr), so the name and title sit at
          the bottom of the card; on hover/focus it opens (1fr), lifting them up to make room.
          Touch screens have no hover, so it stays open there. Cards without a bio keep the row
          (invisible) so names stay aligned with their neighbours.
        */}
        <div
          className={`grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-expo pointer-fine:grid-rows-[0fr] ${
            hasBio
              ? 'group-hover:grid-rows-[1fr]! group-focus-visible:grid-rows-[1fr]! group-data-[active=true]:grid-rows-[1fr]!'
              : ''
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <span
              data-card-caption
              aria-hidden={hasBio ? undefined : true}
              className={`${hasBio ? '' : 'invisible'} block pt-[0.6em] text-center text-[clamp(0.58rem,2.2vw,0.66rem)] font-medium tracking-[0.12em] text-paper/80 uppercase sm:text-[clamp(0.55rem,1.1vw,0.66rem)] lg:text-[clamp(0.5rem,0.56vw,0.896rem)]`}
            >
              <span className="relative inline-block pb-[0.2em] opacity-100 transition-opacity duration-500 ease-expo pointer-fine:opacity-0 group-hover:opacity-100! group-focus-visible:opacity-100! group-data-[active=true]:opacity-100!">
                See profile
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-paper transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100 group-data-[active=true]:scale-x-100" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const shell = `group relative block aspect-[2/3] overflow-hidden bg-placeholder ${CARD_WIDTH}`;

  if (!hasBio) {
    return (
      <figure data-team-card className={shell}>
        {face}
      </figure>
    );
  }

  const onPointerEnter = (e: PointerEvent<HTMLButtonElement>) => {
    // Fetch the dialog's larger portrait now, so it's ready when the profile opens.
    preloadDialogPhoto(member);
    if (e.pointerType === 'mouse') onHoverStart(cardId, e.currentTarget);
  };
  const onPointerLeave = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse') onHoverEnd();
  };
  // Keyboard focus shows the panel too; mouse clicks also focus, but they're already hovering.
  const onFocus = (e: FocusEvent<HTMLButtonElement>) => {
    if (e.currentTarget.matches(':focus-visible')) onHoverStart(cardId, e.currentTarget);
  };

  return (
    <button
      type="button"
      data-team-card
      data-active={active}
      aria-haspopup="dialog"
      aria-describedby={active ? 'team-bio-panel' : undefined}
      aria-label={`${member.name}, ${member.title}. See profile`}
      onPointerEnter={onPointerEnter}
      onPointerDown={() => preloadDialogPhoto(member)}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onHoverEnd}
      onClick={(e) => onOpen(cardId, e.currentTarget)}
      className={`${shell} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-impact-red focus-visible:ring-offset-2`}
    >
      {face}
    </button>
  );
}
