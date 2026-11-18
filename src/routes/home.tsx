import { useLoaderData } from 'react-router';
import { getHomePage } from '@/content/api';
import { ClientsRow } from '@/components/home/ClientsRow';
import { CtaBand } from '@/components/home/CtaBand';
import { Hero } from '@/components/home/Hero';
import { Impact } from '@/components/home/Impact';
import { Showreel } from '@/components/home/Showreel';
import { WorkGrid } from '@/components/home/WorkGrid';

export const homeLoader = async () => ({
  home: await getHomePage(),
});

/**
 * Homepage route (SPEC §7 & §10 Step 3).
 * Passes loader data down as props to dumb section components.
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
      <CtaBand cta={home.cta} />
    </>
  );
}
