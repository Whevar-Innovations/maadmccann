import { getHomePage } from '@/content/api';
import { csr } from '@/content/static/csr';
import cancerRunLogoSrc from '@/assets/svg/csr/cancer-run-logo.svg';
import runForTheNileLogoSrc from '@/assets/svg/csr/run-for-the-nile-logo.svg';
import { MotifHero, type MotifData } from '@/components/layout/MotifHero';
import { CampaignPanel } from '@/components/csr/CampaignPanel';
import { CsrIntro } from '@/components/csr/CsrIntro';
import { CsrServices } from '@/components/csr/CsrServices';
import { IronSharpensIron } from '@/components/csr/IronSharpensIron';
import { CSR_BODY, CSR_CONTAINER } from '@/components/csr/styles';
import {
  CSR_MOTIF_CENTERS,
  CSR_MOTIF_H,
  CSR_MOTIF_PATHS,
  CSR_MOTIF_VIEWBOX,
  CSR_MOTIF_W,
} from '@/components/csr/csrMotifPaths';
import { useSeo } from '@/lib/useSeo';

const MOTIF: MotifData = {
  w: CSR_MOTIF_W,
  h: CSR_MOTIF_H,
  viewBox: CSR_MOTIF_VIEWBOX,
  paths: CSR_MOTIF_PATHS,
  centers: CSR_MOTIF_CENTERS,
};

/** Shares the homepage CTA ("Got something in mind?") so the copy has one source. */
export const csrLoader = async () => ({
  cta: (await getHomePage()).cta,
});

/**
 * Corporate Social Responsibility (/csr), from "MAAD McCANN CSR.pdf".
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage, identical to every other page.
 */
export function CsrRoute() {
  useSeo({ ...csr.seo, path: '/csr', image: '/images/csr/cancer-run-poster-960.webp' });
  const { hero, cancerRun, runForTheNile } = csr;

  return (
    <div className="bg-paper text-ink">
      <MotifHero
        id="csr-hero"
        motif={MOTIF}
        eyebrow={hero.eyebrow}
        headlineLines={hero.headlineLines}
        bodyLines={hero.bodyLines}
        heightClassName="min-h-[30rem] sm:min-h-[34rem] lg:min-h-[max(35.2vw,26rem)]"
        headlineClassName="text-[clamp(2.1rem,3.65vw,5.05rem)] leading-[1.05] tracking-[-0.01em]"
        bodyClassName="mt-5 max-w-[62ch] text-[clamp(0.95rem,1.2vw,1.65rem)] leading-[1.45] font-semibold sm:mt-6 lg:mt-[1.1vw] lg:max-w-none"
      />

      <CsrIntro />

      <div className={CSR_CONTAINER}>
        {/* ---------------- Rotary Cancer Run ---------------- */}
        <CampaignPanel
          id={cancerRun.id}
          toneClassName="bg-[#0000fd] text-paper"
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
          toneClassName="bg-[#cdf3fb] text-ink"
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
            className="mt-6 text-[clamp(1.6rem,2.1875vw,3rem)] leading-[1.1] font-bold tracking-[-0.01em] text-[#46ab33] lg:mt-[1.6vw]"
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

      <IronSharpensIron />
    </div>
  );
}
