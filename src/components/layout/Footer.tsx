import type { SiteSettings, SocialPlatform } from '@/content/types';
import { ContentLink, Link } from '@/components/ui/Link';
import maadLogoWhiteSrc from '@/assets/svg/maad-logo-white.svg';

export type FooterProps = {
  settings: SiteSettings;
};

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M13.5 22v-8.2h2.76l.41-3.2H13.5V8.56c0-.93.26-1.56 1.59-1.56h1.7V4.14c-.29-.04-1.3-.14-2.47-.14-2.45 0-4.12 1.49-4.12 4.23v2.37H7.44v3.2h2.76V22z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4l6.27 3.6z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.05-.41-2.22C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41C8.42 2.21 8.8 2.2 12 2.2m0-2.2C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.39 5.88 5.88 0 0 0 1.39-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.39-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
        </svg>
      );
  }
}

/**
 * Charcoal rounded block footer (SPEC §7 #8).
 * Sits over the lower crimson background at the bottom of the page.
 */
export function Footer({ settings }: FooterProps) {
  const { footer } = settings;

  return (
    <footer className="relative z-10 bg-crimson-950 px-3 pb-0 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[90rem] rounded-t-[2.25rem] bg-charcoal px-6 pt-14 pb-10 text-paper sm:px-12 lg:px-16 lg:pt-20 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left column: Logo + Socials */}
          <div className="flex flex-col justify-between gap-8 lg:col-span-5">
            <Link href="/" aria-label="MAAD McCANN Home" className="inline-block w-fit">
              <img
                src={maadLogoWhiteSrc}
                alt="MAAD McCANN"
                width={230}
                height={26}
                className="h-6 w-auto sm:h-7"
              />
            </Link>

            <div>
              <h2 className="text-connect font-semibold tracking-wider text-paper uppercase">
                LET’S CONNECT
              </h2>
              <ul className="mt-3 flex items-center gap-4">
                {footer.socials.map((social) => (
                  <li key={social.platform}>
                    <Link
                      href={social.url}
                      external={social.url !== '#'}
                      aria-label={social.platform}
                      className="inline-flex h-8 w-8 items-center justify-center text-paper/85 transition-opacity hover:text-paper"
                    >
                      <SocialIcon platform={social.platform} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right 3 columns: Navigation, Services, Info */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            {/* Navigation */}
            <div>
              <h2 className="text-footer-title font-bold tracking-wide text-paper uppercase">
                NAVIGATION
              </h2>
              <ul className="mt-4 space-y-2">
                {footer.navigation.map((item) => (
                  <li key={item.label}>
                    <ContentLink
                      link={item}
                      className="text-small font-regular text-paper/80 transition-opacity hover:text-paper"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-footer-title font-bold tracking-wide text-paper uppercase">
                SERVICES
              </h2>
              <ul className="mt-4 space-y-2">
                {footer.services.map((item) => (
                  <li key={item.label}>
                    <ContentLink
                      link={item}
                      className="text-small font-regular text-paper/80 transition-opacity hover:text-paper"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h2 className="text-footer-title font-bold tracking-wide text-paper uppercase">
                INFO
              </h2>
              <address className="mt-4 space-y-4 text-small font-semibold text-paper/85 not-italic">
                <div className="space-y-1">
                  <p>
                    <a
                      href={`mailto:${footer.contact.email}`}
                      className="transition-opacity hover:text-paper"
                    >
                      {footer.contact.email}
                    </a>
                  </p>
                  <p>
                    Phone:{' '}
                    <a
                      href={`tel:${footer.contact.phone.replace(/\s+/g, '')}`}
                      className="transition-opacity hover:text-paper"
                    >
                      {footer.contact.phone}
                    </a>
                  </p>
                  <p>Landline: {footer.contact.landline}</p>
                </div>

                <div>
                  {footer.contact.address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 border-t border-paper/15 pt-8 text-center lg:mt-16">
          <p className="text-small font-regular text-paper/75">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
