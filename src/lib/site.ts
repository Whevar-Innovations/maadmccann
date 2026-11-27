/** Single source of truth for site-wide SEO defaults (mirrors the static tags in index.html). */
export const siteConfig = {
  // Injected at build time by vite.config.ts (VITE_SITE_URL, else Vercel's production URL).
  url: import.meta.env.VITE_SITE_URL ?? 'https://maadmccann.vercel.app',
  name: 'MAAD McCANN',
  titleSuffix: ' | MAAD McCANN',
  defaultTitle: 'MAAD McCANN | 360° Creative Agency in Kampala, Uganda',
  description:
    'MAAD McCANN is a 360° creative agency in Kampala bringing together strategy, creativity, digital and culture to create work that gets people talking and brands moving.',
  ogImage: '/og-image.jpg',
  /** Contact form endpoint (VITE_CONTACT_ENDPOINT). Empty: the form falls back to a mailto: draft. */
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || undefined,
  ogImageAlt:
    'MAAD McCANN: Ideas that move the world, with three Silverback Awards gorilla trophies',
} as const;
