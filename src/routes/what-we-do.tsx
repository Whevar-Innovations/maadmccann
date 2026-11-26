import { useLoaderData } from 'react-router';
import { getWhatWeDoPage } from '@/content/api';
import { Services } from '@/components/what-we-do/Services';
import { WhatWeDoHero } from '@/components/what-we-do/WhatWeDoHero';
import { useSeo } from '@/lib/useSeo';

export const whatWeDoLoader = async () => ({
  page: await getWhatWeDoPage(),
});

/**
 * What We Do (/what-we-do).
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage (settings.cta), identical to the homepage.
 */
export function WhatWeDoRoute() {
  const { page } = useLoaderData<typeof whatWeDoLoader>();
  useSeo({ ...page.seo, path: '/what-we-do' });

  return (
    <>
      <WhatWeDoHero hero={page.hero} />
      <Services page={page} />
    </>
  );
}
