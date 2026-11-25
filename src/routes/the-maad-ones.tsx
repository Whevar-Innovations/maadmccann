import { getHomePage } from '@/content/api';
import { team } from '@/content/static/team';
import { TeamGrid } from '@/components/team/TeamGrid';
import { TeamHero } from '@/components/team/TeamHero';
import { TeamIntro } from '@/components/team/TeamIntro';
import { useSeo } from '@/lib/useSeo';

/** Shares the homepage CTA ("Got something in mind?") so the copy has one source. */
export const theMaadOnesLoader = async () => ({
  cta: (await getHomePage()).cta,
});

/**
 * The MAAD Ones (/the-maad-ones): team photo header, intro, then the people by department.
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage, identical to the homepage.
 */
export function TheMaadOnesRoute() {
  useSeo({ ...team.seo, path: '/the-maad-ones', image: '/team/team-hero-1600.webp' });

  return (
    <div className="bg-paper">
      <TeamHero />
      <TeamIntro />
      <TeamGrid />
    </div>
  );
}
