import { useLoaderData } from 'react-router';
import { getPartnersPage } from '@/content/api';
import { PartnersHero } from '@/components/partners/PartnersHero';
import { PartnersIntro } from '@/components/partners/PartnersIntro';
import { SectorTable } from '@/components/partners/SectorTable';
import { useSeo } from '@/lib/useSeo';

export const partnersLoader = async () => ({
  page: await getPartnersPage(),
});

/**
 * Our Partners (/partners): motif hero, intro line, then the sector filter and the client table.
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage (settings.cta).
 */
export function PartnersRoute() {
  const { page } = useLoaderData<typeof partnersLoader>();
  useSeo({ ...page.seo, path: '/partners' });

  return (
    <div className="bg-paper">
      <PartnersHero hero={page.hero} />
      <PartnersIntro intro={page.intro} />
      <SectorTable
        sectors={page.sectors}
        filterLabel={page.filterLabel}
        allLabel={page.allLabel}
        labels={page.labels}
      />
    </div>
  );
}
