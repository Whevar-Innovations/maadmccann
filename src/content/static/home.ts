import type { ClientLogo, HomePage, ImageAsset, Project } from '../types';
import { img, logoImage, trophySet } from './assets';
import showreelPosterSrc from '@/assets/img/showreel-poster.webp';
import gotvSrc from '@/assets/img/work/gotv-ka-weekie.webp';
import cocacolaSrc from '@/assets/img/work/cocacola-digital.webp';
import tuskerSrc from '@/assets/img/work/tuskerlite-turn-on.webp';
import baatiSrc from '@/assets/img/work/uganda-baati-crown.webp';
import prideSrc from '@/assets/img/work/pride-bank-growing.webp';
import cocaColaLogo from '@/assets/img/clients/coca-cola.webp';
import unicefLogo from '@/assets/img/clients/unicef.webp';
import diageoLogo from '@/assets/img/clients/diageo.webp';
import emiratesLogo from '@/assets/img/clients/emirates.webp';
import ugachickLogo from '@/assets/img/clients/ugachick.webp';
import multichoiceLogo from '@/assets/img/clients/multichoice.webp';

type RawProject = Omit<Project, 'href'>;

/** Projects with a case study open /work/{slug}; the rest open the Our Work grid. */
const WITHOUT_CASE_STUDY = new Set(['cocacola-digital']);

const withProjectHref = (project: RawProject): Project => ({
  ...project,
  href: WITHOUT_CASE_STUDY.has(project.slug) ? '/work' : `/work/${project.slug}`,
});

const rawProjects: RawProject[] = [
  {
    id: 'gotv',
    slug: 'gotv-ka-weekie',
    client: 'GOtv',
    title: 'Ka Weekie',
    image: img(gotvSrc, 1600, 2230, 'GOtv: Ka Weekie campaign poster'),
  },
  {
    id: 'coke',
    slug: 'cocacola-digital',
    client: 'CocaCola',
    title: 'Digital',
    image: img(cocacolaSrc, 1600, 900, 'CocaCola: Digital campaign artwork'),
  },
  {
    id: 'tusker',
    slug: 'tuskerlite-turn-on',
    client: 'TuskerLite',
    title: 'Turn On Your Lite',
    image: img(tuskerSrc, 1600, 806, 'TuskerLite: Turn On Your Lite campaign artwork'),
  },
  {
    id: 'baati',
    slug: 'uganda-baati-crown',
    client: 'Uganda Baati',
    title: 'Crown Your Home',
    image: img(baatiSrc, 1600, 900, 'Uganda Baati: Crown Your Home campaign artwork'),
    // Keep the top-right logo whole; crop the contact strip at the bottom instead.
    focus: 'center top',
  },
  {
    id: 'pride',
    slug: 'pride-bank-growing',
    client: 'Pride Bank',
    title: 'Take Pride in Growing Together',
    image: img(prideSrc, 1600, 666, 'Pride Bank: Take Pride in Growing Together campaign artwork'),
  },
];

// Client logos. The original six are trimmed exports in assets/img/clients; the rest reuse the
// cropped partner exports (assets/img/partners/{id}-{w}.webp) via logoImage. Global and local
// brands alternate so the strip reads varied at any point of the loop.
const logo = (id: string, name: string, image: ImageAsset): ClientLogo => ({ id, name, image });
const partnerLogo = (id: string, name: string, w: number, h: number): ClientLogo =>
  logo(id, name, logoImage(id, w, h, `${name} logo`));

const clientLogos: ClientLogo[] = [
  logo('coca-cola', 'Coca-Cola', img(cocaColaLogo, 520, 180, 'Coca-Cola logo')),
  partnerLogo('uganda-breweries', 'Uganda Breweries Limited', 206, 191),
  logo('unicef', 'UNICEF', img(unicefLogo, 520, 134, 'UNICEF logo')),
  partnerLogo('gotv', 'GOtv', 320, 66),
  logo('diageo', 'Diageo', img(diageoLogo, 520, 120, 'Diageo logo')),
  partnerLogo('tusker-lite', 'Tusker Lite', 161, 175),
  logo('emirates', 'Emirates', img(emiratesLogo, 520, 116, 'Emirates logo')),
  partnerLogo('kcb', 'KCB Bank', 320, 60),
  partnerLogo('guinness', 'Guinness', 162, 176),
  logo('ugachick', 'Ugachick', img(ugachickLogo, 225, 225, 'Ugachick logo')),
  partnerLogo('mastercard', 'Mastercard', 277, 218),
  logo('multichoice', 'MultiChoice', img(multichoiceLogo, 428, 260, 'MultiChoice logo')),
  partnerLogo('johnnie-walker', 'Johnnie Walker', 320, 169),
  partnerLogo('red-cross', 'Uganda Red Cross Society', 249, 248),
  partnerLogo('unilever', 'Unilever', 215, 237),
  partnerLogo('dstv', 'DStv', 320, 68),
  partnerLogo('totalenergies', 'TotalEnergies', 320, 235),
  partnerLogo('save-the-children', 'Save the Children', 320, 66),
  partnerLogo('western-union', 'Western Union', 320, 100),
  partnerLogo('prudential', 'Prudential', 320, 165),
];

export const home: HomePage = {
  hero: {
    headlineLines: ['IDEAS', 'THAT MOVE', 'THE WORLD.'],
    subheading:
      'We’re a 360° creative agency bringing together strategy, creativity, digital and culture to create work that gets people talking, brands moving and change happening.',
    cta: { label: 'VIEW OUR WORK', href: '#work' },
    ghostText: 'TRUTH WELL TOLD',
    awards: [
      {
        id: 'digital',
        title: 'Digital - Social Media & Influencer',
        year: 2025,
        image: img(
          '/trophies/digital-social-1400.webp',
          663,
          1400,
          'Silverback Awards trophy: Digital, Social Media & Influencer 2025',
          trophySet('digital-social', 332, 663),
        ),
      },
      {
        id: 'creative',
        title: 'Creative Director of the Year',
        year: 2025,
        image: img(
          '/trophies/creative-director-1400.webp',
          661,
          1400,
          'Silverback Awards trophy: Creative Director of the Year 2025',
          trophySet('creative-director', 330, 661),
        ),
      },
      {
        id: 'grand',
        title: 'Grand Prix',
        year: 2025,
        image: img(
          '/trophies/grand-prix-1400.webp',
          671,
          1400,
          'Silverback Awards trophy: Grand Prix 2025',
          trophySet('grand-prix', 335, 671),
        ),
      },
    ],
  },
  showreel: {
    heading: 'See The Maadness In Motion.',
    subheading: 'Skip the pitch deck. Watch our showreel and let the work speak for itself.',
    poster: img(showreelPosterSrc, 1600, 900, 'MAAD McCANN Showreel still'),
    videoUrl: 'https://player.mux.com/watch/roe6Jfa6rZCEclK5LTFqQviEv631iLXxdnP01V3Wlxpc',
  },
  clients: {
    heading: 'TRUSTED BY VISIONARY BRANDS',
    logos: clientLogos,
  },
  featuredProjects: rawProjects.map(withProjectHref),
  impact: {
    heading: 'OUR IMPACT',
    body: 'We’re not here to make work that simply fills a billboard, feeds a timeline or checks a box. We’re here to make people stop. Look twice. Talk about it. Feel something. And DO something. At MAAD McCANN, we blend sharp strategy and fearless creativity to create work that moves brands and the people behind them.',
    stats: [
      {
        value: 350,
        suffix: '+',
        label: 'Campaigns Delivered',
        description: 'Helping brands make their mark online.',
      },
      {
        value: 9.5,
        decimals: 1,
        suffix: 'M+',
        label: 'Users reached',
        description: 'Our designs engage millions globally.',
      },
      {
        value: 95,
        suffix: '%',
        label: 'Client satisfaction rate',
        description: 'We build long-term partnerships through proven results.',
      },
      {
        value: 18,
        suffix: '+',
        label: 'Years of expertise',
        description: 'Decades of experience in delivering impactful digital solutions.',
      },
    ],
  },
};
