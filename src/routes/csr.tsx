import { useLoaderData } from 'react-router';
import { getCsrPage } from '@/content/api';
import cancerRunLogoSrc from '@/assets/svg/csr/cancer-run-logo.svg';
import runForTheNileLogoSrc from '@/assets/svg/csr/run-for-the-nile-logo.svg';
import { CampaignPanel } from '@/components/csr/CampaignPanel';
import { CsrHero } from '@/components/csr/CsrHero';
import { CsrIntro } from '@/components/csr/CsrIntro';
import { CsrServices } from '@/components/csr/CsrServices';
import { IronSharpensIron } from '@/components/csr/IronSharpensIron';
import { CSR_BODY, CSR_CONTAINER } from '@/components/csr/styles';
import { useSeo } from '@/lib/useSeo';

export const csrLoader = async () => ({
  page: await getCsrPage(),
});

/**
 * Corporate Social Responsibility (/csr), from "MAAD McCANN CSR.pdf".
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage (settings.cta).
 */
export function CsrRoute() {
  const { page } = useLoaderData<typeof csrLoader>();
  useSeo({ ...page.seo, path: '/csr', image: page.cancerRun.poster.src });
  const { cancerRun, runForTheNile } = page;

  return (
    <div className="bg-paper text-ink">
      <CsrHero hero={page.hero} />

      <CsrIntro intro={page.intro} />

      <div className={CSR_CONTAINER}>
        {/* ---------------- Rotary Cancer Run ---------------- */}
        <CampaignPanel
          id={cancerRun.id}
          toneClassName="bg-cancer-run-blue text-paper"
          poster={cancerRun.poster}
        >
          <img
            data-pop
            src={cancerRunLogoSrc}
            alt={cancerRun.logoAlt}
            width={1430}
            height={572}
            className="mb-8 block h-auto w-40 sm:w-44 md:mx-auto md:mb-[3.4vw] md:w-[24%]"
          />
          <h2
            id={`${cancerRun.id}-title`}
            data-reveal
            className="text-[clamp(1.6rem,2.1875vw,3rem)] leading-[1.15] font-bold tracking-[-0.01em] uppercase"
          >
            {cancerRun.title}
          </h2>
          <p
            data-reveal
            className="mt-1 text-[clamp(1.05rem,1.146vw,1.58rem)] leading-[1.35] font-medium lg:mt-[0.3vw]"
          >
            {cancerRun.tagline}
          </p>
          <div className={`mt-6 space-y-[1.4em] lg:mt-[1.8vw] ${CSR_BODY}`}>
            {cancerRun.paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </CampaignPanel>

        <CsrServices
          id={cancerRun.id}
          title={cancerRun.servicesTitle}
          services={cancerRun.services}
        />

        {/* ---------------- Run for the Nile ---------------- */}
        <CampaignPanel
          id={runForTheNile.id}
          toneClassName="bg-nile-sky text-ink"
          poster={runForTheNile.poster}
        >
          <img
            data-pop
            src={runForTheNileLogoSrc}
            alt={runForTheNile.logoAlt}
            width={210}
            height={123}
            className="block h-auto w-48 origin-left sm:w-56 md:w-[36%]"
          />
          <h2
            id={`${runForTheNile.id}-title`}
            data-reveal
            className="mt-6 text-[clamp(1.6rem,2.1875vw,3rem)] leading-[1.1] font-bold tracking-[-0.01em] text-nile-green lg:mt-[1.6vw]"
          >
            {runForTheNile.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className={`mt-5 space-y-[1.4em] lg:mt-[1.3vw] ${CSR_BODY}`}>
            {runForTheNile.paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </CampaignPanel>

        <CsrServices
          id={runForTheNile.id}
          title={runForTheNile.servicesTitle}
          services={runForTheNile.services}
        />
      </div>

      <IronSharpensIron section={page.ironSharpensIron} />
    </div>
  );
}
