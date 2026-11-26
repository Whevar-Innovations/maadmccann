import { useLoaderData } from 'react-router';
import { getWorkPage } from '@/content/api';
import { ProjectGrid } from '@/components/work/ProjectGrid';
import { WorkHero } from '@/components/work/WorkHero';
import { useSeo } from '@/lib/useSeo';

export const workLoader = async () => ({
  page: await getWorkPage(),
});

/**
 * Our Work (/work): crimson motif hero, sector filter, paginated project grid.
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage (settings.cta).
 */
export function WorkRoute() {
  const { page } = useLoaderData<typeof workLoader>();
  useSeo({ ...page.seo, path: '/work', image: page.projects[0]?.image.src });

  return (
    <div className="bg-paper">
      <WorkHero hero={page.hero} />
      <ProjectGrid page={page} />
    </div>
  );
}
