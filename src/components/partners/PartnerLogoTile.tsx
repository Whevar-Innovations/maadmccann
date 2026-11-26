import type { PartnerLogo } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { Link } from '@/components/ui/Link';

export type PartnerLogoTileProps = {
  logo: PartnerLogo;
  /** Hover hint under a linked logo, e.g. "View case study". */
  hint: string;
};

/** Logos sit in fixed-height boxes so every shape (wordmark, badge, square) reads at a similar weight. */
const LOGO_BOX = 'flex h-12 w-full items-center justify-center px-1 md:h-14 lg:h-16';
const LOGO_IMG = 'h-auto max-h-full w-auto max-w-full object-contain';
const SIZES = '(min-width: 768px) 128px, 30vw';
/**
 * Hover lift shared by every logo (fine pointers only, so taps don't leave a logo stuck up).
 * Linked logos also lift on keyboard focus. Transform only; off under reduced motion.
 */
const LOGO_LIFT =
  'transition-transform duration-500 ease-brand [@media(hover:hover)]:group-hover:-translate-y-1 [@media(hover:hover)]:group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:transform-none';

/**
 * One client logo. Every logo lifts slightly on hover (fine pointers). With an `href` it also links
 * to that client's case study: a small arrow badge marks it on every device, it lifts on keyboard
 * focus too, and a "View case study" hint fades in below. Unlinked logos get the lift only (no
 * pointer, badge or hint), so nothing looks clickable that isn't. Transform and opacity only.
 */
export function PartnerLogoTile({ logo, hint }: PartnerLogoTileProps) {
  if (!logo.href) {
    return (
      <div className="group w-full">
        <div className={`${LOGO_BOX} ${LOGO_LIFT}`}>
          <Img image={logo.image} sizes={SIZES} className={LOGO_IMG} />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={logo.href}
      aria-label={`${logo.name}: ${hint}`}
      className="group relative block rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-impact-red"
    >
      <span
        className={`${LOGO_BOX} ${LOGO_LIFT} group-focus-visible:-translate-y-1 group-focus-visible:scale-[1.04]`}
      >
        <Img image={logo.image} sizes={SIZES} className={LOGO_IMG} />
      </span>
      {/* Marks a linked logo on touch screens too, where there is no hover hint. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="absolute top-0 right-0 size-2.5 fill-none stroke-impact-red stroke-[1.6] md:size-3"
      >
        <path d="M3 9 9 3M4 3h5v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-5 hidden text-center text-small font-semibold whitespace-nowrap text-impact-red opacity-0 transition-opacity duration-300 ease-brand [@media(hover:hover)]:block group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {hint}
      </span>
    </Link>
  );
}
