import { useEffect } from 'react';
import { siteConfig } from '@/lib/site';

export type SeoOptions = {
  /** Page title. Omit on the homepage to use the default. A suffix is added automatically. */
  title?: string;
  description?: string;
  /** Path of this page, e.g. "/" or "/work/gotv". */
  path?: string;
  /** Absolute URL or site-relative path. */
  image?: string;
  noindex?: boolean;
};

function upsert(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key: 'name' | 'property', name: string, content: string) =>
  upsert(
    `meta[${key}="${name}"]`,
    () => {
      const m = document.createElement('meta');
      m.setAttribute(key, name);
      return m;
    },
    'content',
    content,
  );

const abs = (u: string) => (u.startsWith('http') ? u : `${siteConfig.url}${u}`);

/**
 * Updates title, description, canonical, Open Graph, Twitter and robots tags that already exist
 * statically in index.html. Call once per route; the static tags remain the source for crawlers
 * that do not run JavaScript.
 */
export function useSeo({
  title,
  description = siteConfig.description,
  path = '/',
  image = siteConfig.ogImage,
  noindex = false,
}: SeoOptions = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title}${siteConfig.titleSuffix}` : siteConfig.defaultTitle;
    const url = abs(path);
    const img = abs(image);

    document.title = fullTitle;
    meta('name', 'description', description);
    meta(
      'name',
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    upsert('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.rel = 'canonical';
      return l;
    }, 'href', url);

    meta('property', 'og:title', fullTitle);
    meta('property', 'og:description', description);
    meta('property', 'og:url', url);
    meta('property', 'og:image', img);
    meta('name', 'twitter:title', fullTitle);
    meta('name', 'twitter:description', description);
    meta('name', 'twitter:image', img);
  }, [title, description, path, image, noindex]);
}
