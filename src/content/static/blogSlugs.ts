/**
 * Slugs of the articles in blog.ts. Kept in a plain module (no Vite-only imports) so
 * vite.config.ts can read it to expand `/blog/:slug` in the sitemap. blog.ts checks it stays in sync.
 */
export const BLOG_POST_SLUGS = [
  'iron-sharpens-iron',
  'run-for-the-nile',
  'rotary-cancer-run',
  'inspiring-the-next-generation-at-gayaza-high-school',
] as const;
