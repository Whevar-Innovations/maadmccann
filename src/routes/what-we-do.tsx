import { getHomePage } from '@/content/api';
import { whatWeDo } from '@/content/static/whatWeDo';
import { Services } from '@/components/what-we-do/Services';
import { WhatWeDoHero } from '@/components/what-we-do/WhatWeDoHero';
import { useSeo } from '@/lib/useSeo';

/** Shares the homepage CTA ("Got something in mind?") so the copy has one source. */
export const whatWeDoLoader = async () => ({
  cta: (await getHomePage()).cta,
});

/**
 * What We Do (/what-we-do).
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage, identical to the homepage.
 */
export function WhatWeDoRoute() {
  useSeo({ ...whatWeDo.seo, path: '/what-we-do' });

  return (
    <>
      <WhatWeDoHero />
      <Services />
    </>
  );
}
