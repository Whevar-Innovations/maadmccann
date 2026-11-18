/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Content source switch (SPEC §5.1). Defaults to 'static'. */
  readonly VITE_CONTENT_SOURCE?: 'static' | 'mock' | 'sanity';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
