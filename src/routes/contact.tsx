import { useLoaderData, useRouteLoaderData } from 'react-router';
import { getContactPage } from '@/content/api';
import type { rootLoader } from '@/components/layout/RootLayout';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactMap } from '@/components/contact/ContactMap';
import { ContactSection } from '@/components/contact/ContactSection';
import { ServicesTicker } from '@/components/contact/ServicesTicker';
import { useSeo } from '@/lib/useSeo';

export const contactLoader = async () => ({
  page: await getContactPage(),
});

/**
 * Contact Us (/contact), from "MAAD McCANN Website Contact Us.pdf": motif hero, services ticker,
 * Get In Touch + the form, then the map. "Talk To Us" and "Let's Talk" (SiteSettings) link here.
 * The social row reuses the site-wide footer socials from the root loader.
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage (settings.cta).
 */
export function ContactRoute() {
  const { page } = useLoaderData<typeof contactLoader>();
  const root = useRouteLoaderData<typeof rootLoader>('root');
  useSeo({ ...page.seo, path: '/contact' });

  return (
    <div className="bg-ink text-paper">
      <ContactHero hero={page.hero} />
      <ServicesTicker services={page.services} label={page.servicesLabel} />
      <ContactSection
        intro={page.intro}
        details={page.details}
        followLabel={page.followLabel}
        socials={root?.settings.footer.socials ?? []}
        form={page.form}
      />
      <ContactMap map={page.map} />
    </div>
  );
}
