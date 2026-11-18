import { useLoaderData } from 'react-router';
import { getHomePage } from '@/content/api';
import { ClientsRow } from '@/components/home/ClientsRow';
import { Hero } from '@/components/home/Hero';
import { Impact } from '@/components/home/Impact';
import { Showreel } from '@/components/home/Showreel';
import { WorkGrid } from '@/components/home/WorkGrid';

export const homeLoader = async () => ({
  home: await getHomePage(),
});

/**
 * Homepage route (SPEC §7).
 * Note: CtaBand is rendered inside RootLayout's shared FooterMotifStage right above Footer
 * so the two share a single continuous animated SVG motif stage with zero seam.
 */
export function HomeRoute() {
  const { home } = useLoaderData<typeof homeLoader>();

  return (
    <>
      <Hero hero={home.hero} />
      <Showreel showreel={home.showreel} />
      <ClientsRow clients={home.clients} />
      <WorkGrid projects={home.featuredProjects} />
      <Impact impact={home.impact} />
    </>
  );
}
