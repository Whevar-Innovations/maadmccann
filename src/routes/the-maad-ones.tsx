import { useLoaderData } from 'react-router';
import { getTeamPage } from '@/content/api';
import { TeamGrid } from '@/components/team/TeamGrid';
import { TeamHero } from '@/components/team/TeamHero';
import { TeamIntro } from '@/components/team/TeamIntro';
import { useSeo } from '@/lib/useSeo';

export const theMaadOnesLoader = async () => ({
  page: await getTeamPage(),
});

/**
 * The MAAD Ones (/the-maad-ones): team photo header, intro, then the people by department.
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage (settings.cta), identical to the homepage.
 */
export function TheMaadOnesRoute() {
  const { page } = useLoaderData<typeof theMaadOnesLoader>();
  useSeo({ ...page.seo, path: '/the-maad-ones', image: page.hero.src });

  return (
    <div className="bg-paper">
      <TeamHero image={page.hero} />
      <TeamIntro intro={page.intro} />
      <TeamGrid rows={page.rows} />
    </div>
  );
}
