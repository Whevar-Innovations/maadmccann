/**
 * Shared CSR layout + type classes. The design is drawn at 1920px with a 1274px content column
 * (66.35vw); sizes follow the site's fluid rule clamp(~0.8 × size, size ÷ 19.2 vw, 1.15 × size),
 * with readable floors on phones.
 */

/** Content column: phone/tablet gutters, then 66.35vw (never under 960px, capped at 1.15 × 1274px). */
export const CSR_CONTAINER =
  'mx-auto w-full px-5 sm:px-10 lg:max-w-[min(max(66.35vw,60rem),91.5rem)] lg:px-0';

/** 18px Inter body copy. */
export const CSR_BODY = 'text-body leading-[1.4]';

/** Design red used for headings and icons. */
export const CSR_RED = 'text-[#86161a]';
