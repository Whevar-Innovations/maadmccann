import { Outlet, useLoaderData } from 'react-router';
import { getSiteSettings } from '@/content/api';
import { Footer } from './Footer';
import { Header } from './Header';

export const rootLoader = async () => ({
  settings: await getSiteSettings(),
});

/**
 * App shell (SPEC §4 & §7).
 * Renders skip link, Header, main route Outlet, and Footer fed by rootLoader.
 */
export function RootLayout() {
  const { settings } = useLoaderData<typeof rootLoader>();

  return (
    <div className="min-h-svh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-5 focus:py-2.5 focus:text-small focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <Header settings={settings} />

      <main id="main">
        <Outlet />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
