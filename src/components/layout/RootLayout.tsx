import { Outlet, useLoaderData } from 'react-router';
import { getSiteSettings } from '@/content/api';
import { CtaBand } from '@/components/home/CtaBand';
import { LoaderProvider } from '@/motion/LoaderProvider';
import { PageTransition } from '@/motion/PageTransition';
import { RouteScrollReset, SmoothScroll } from '@/motion/SmoothScroll';
import { BackToTop } from './BackToTop';
import { Footer } from './Footer';
import { FooterMotifStage } from './FooterMotifStage';
import { Header } from './Header';

export const rootLoader = async () => ({
  settings: await getSiteSettings(),
});

/**
 * App shell (SPEC §4, §7 & §8).
 * Wraps the site in Lenis SmoothScroll, LoaderProvider, and PageTransition (the new page slides up
 * over a still of the old one, SPEC §8.8). Header stays outside the page wrapper so its fixed positioning is unaffected.
 * CtaBand (settings.cta, site-wide) and Footer share a single continuous FooterMotifStage with zero seam.
 */
export function RootLayout() {
  const { settings } = useLoaderData<typeof rootLoader>();

  return (
    <SmoothScroll>
      <LoaderProvider>
        <div className="min-h-svh bg-paper text-ink">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-5 focus:py-2.5 focus:text-small focus:font-semibold focus:text-ink"
          >
            Skip to content
          </a>

          {/* Navigation context wraps page content & footer. The header sits inside it (so its
              links navigate) but outside the page wrapper. */}
          <PageTransition outsideStage={<Header settings={settings} />}>
            {/* tabIndex -1: focus target for the skip link and BackToTop. */}
            <main id="main" tabIndex={-1} className="focus:outline-none">
              {/* Must stay before <Outlet />: resets scroll before the page's triggers exist. */}
              <RouteScrollReset />
              <Outlet />
            </main>

            <FooterMotifStage>
              <CtaBand cta={settings.cta} />
              <Footer settings={settings} />
            </FooterMotifStage>
          </PageTransition>

          <BackToTop />
        </div>
      </LoaderProvider>
    </SmoothScroll>
  );
}
