import { Outlet, useLoaderData } from 'react-router';
import { getSiteSettings } from '@/content/api';

export const rootLoader = async () => ({
  settings: await getSiteSettings(),
});

/**
 * App shell. In Step 2, renders raw site settings through the loader to verify
 * the data pipeline before Header and Footer are built in Step 3.
 */
export function RootLayout() {
  const { settings } = useLoaderData<typeof rootLoader>();

  return (
    <div className="min-h-svh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <header className="container-site border-b border-ink/10 py-4">
        <nav aria-label="Primary" className="flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap items-center gap-4 text-small">
            {settings.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <a href={settings.navCta.href} className="text-small font-semibold">
            {settings.navCta.label}
          </a>
        </nav>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="container-site border-t border-ink/10 py-8 text-small">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-bold">NAVIGATION</h2>
            <ul className="mt-2 space-y-1">
              {settings.footer.navigation.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold">SERVICES</h2>
            <ul className="mt-2 space-y-1">
              {settings.footer.services.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold">INFO</h2>
            <address className="mt-2 not-italic space-y-1">
              <p>{settings.footer.contact.email}</p>
              <p>{settings.footer.contact.phone}</p>
              <p>{settings.footer.contact.landline}</p>
              <p>{settings.footer.contact.address.join(' ')}</p>
            </address>
          </div>
          <div>
            <h2 className="font-bold">LET’S CONNECT</h2>
            <ul className="mt-2 flex gap-3">
              {settings.footer.socials.map((social) => (
                <li key={social.platform}>
                  <a href={social.url}>{social.platform}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6">{settings.footer.copyright}</p>
      </footer>
    </div>
  );
}
