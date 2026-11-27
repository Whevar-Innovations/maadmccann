/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Content source switch (SPEC §5.1). Defaults to 'static'. */
  readonly VITE_CONTENT_SOURCE?: 'static' | 'mock' | 'sanity';
  /** Absolute site URL, injected by vite.config.ts (VITE_SITE_URL override, else Vercel URL). */
  readonly VITE_SITE_URL?: string;
  /** Contact form POST endpoint (JSON, e.g. a Formspree form URL). Unset: the form opens the visitor's mail app. */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
