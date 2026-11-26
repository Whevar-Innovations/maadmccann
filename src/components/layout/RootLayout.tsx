import { Outlet, useLoaderData, useRouteLoaderData } from 'react-router';
import { getSiteSettings } from '@/content/api';
import { CtaBand } from '@/components/home/CtaBand';
import { LoaderProvider } from '@/motion/LoaderProvider';
import { PageTransition } from '@/motion/PageTransition';
import { SmoothScroll } from '@/motion/SmoothScroll';
import type { csrLoader } from '@/routes/csr';
import type { homeLoader } from '@/routes/home';
import type { theMaadOnesLoader } from '@/routes/the-maad-ones';
import type { whatWeDoLoader } from '@/routes/what-we-do';
import { Footer } from './Footer';
import { FooterMotifStage } from './FooterMotifStage';
import { Header } from './Header';

export const rootLoader = async () => ({
  settings: await getSiteSettings(),
});

/**
 * App shell (SPEC §4, §7 & §8).
 * Wraps the site in Lenis SmoothScroll, LoaderProvider, and PageTransition (direct navigation,
 * no curtain). Header stays outside the page wrapper so its fixed positioning is unaffected.
 * CtaBand and Footer share a single continuous FooterMotifStage with zero seam.
 */
export function RootLayout() {
  const { settings } = useLoaderData<typeof rootLoader>();
  const homeData = useRouteLoaderData('home') as
    | Awaited<ReturnType<typeof homeLoader>>
    | undefined;
  const whatWeDoData = useRouteLoaderData('what-we-do') as
    | Awaited<ReturnType<typeof whatWeDoLoader>>
    | undefined;
  const teamData = useRouteLoaderData('the-maad-ones') as
    | Awaited<ReturnType<typeof theMaadOnesLoader>>
    | undefined;
  const csrData = useRouteLoaderData('csr') as
    | Awaited<ReturnType<typeof csrLoader>>
    | undefined;
  const cta = homeData?.home.cta ?? whatWeDoData?.cta ?? teamData?.cta ?? csrData?.cta;

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
            <main id="main">
              <Outlet />
            </main>

            <FooterMotifStage>
              {cta && <CtaBand cta={cta} />}
              <Footer settings={settings} />
            </FooterMotifStage>
          </PageTransition>
        </div>
      </LoaderProvider>
    </SmoothScroll>
  );
}
