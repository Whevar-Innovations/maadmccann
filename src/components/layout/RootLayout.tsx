import { Outlet, useLoaderData, useRouteLoaderData } from 'react-router';
import { getSiteSettings } from '@/content/api';
import { CtaBand } from '@/components/home/CtaBand';
import { LoaderProvider } from '@/motion/LoaderProvider';
import { PageTransition } from '@/motion/PageTransition';
import { SmoothScroll } from '@/motion/SmoothScroll';
import type { homeLoader } from '@/routes/home';
import { Footer } from './Footer';
import { FooterMotifStage } from './FooterMotifStage';
import { Header } from './Header';

export const rootLoader = async () => ({
  settings: await getSiteSettings(),
});

/**
 * App shell (SPEC §4, §7 & §8).
 * Wraps the site in Lenis SmoothScroll, LoaderProvider, and PageTransition.
 * CtaBand and Footer share a single continuous FooterMotifStage so the red metallic
 * texture and animated SVG motif span both sections with zero seam (Screenshot 14-36-34.png).
 */
export function RootLayout() {
  const { settings } = useLoaderData<typeof rootLoader>();
  const homeData = useRouteLoaderData('home') as
    | Awaited<ReturnType<typeof homeLoader>>
    | undefined;

  return (
    <SmoothScroll>
      <LoaderProvider>
        <PageTransition>
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

            <FooterMotifStage>
              {homeData?.home.cta && <CtaBand cta={homeData.home.cta} />}
              <Footer settings={settings} />
            </FooterMotifStage>
          </div>
        </PageTransition>
      </LoaderProvider>
    </SmoothScroll>
  );
}
