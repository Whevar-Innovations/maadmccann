/**
 * Slugs of the case studies in work.ts. Kept in a plain module (no Vite-only imports) so
 * vite.config.ts can read it to expand `/work/:slug` in the sitemap. work.ts checks it stays in sync.
 */
export const CASE_STUDY_SLUGS = [
  'gotv-ka-weekie',
  'uganda-baati-crown',
  'pride-bank-growing',
  'tuskerlite-turn-on',
] as const;
