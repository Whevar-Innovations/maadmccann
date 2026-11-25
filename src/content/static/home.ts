import type { HomePage, Project } from '../types';
import { img, trophySet } from './assets';
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

const withProjectHref = (project: RawProject): Project => ({
  ...project,
  href: '#work',
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

// Client logos (trimmed of padding; source files live in assets/img/clients/color)
const clientLogos = [
  { id: 'coca-cola', name: 'Coca-Cola', src: cocaColaLogo, w: 520, h: 180 },
  { id: 'unicef', name: 'UNICEF', src: unicefLogo, w: 520, h: 134 },
  { id: 'diageo', name: 'Diageo', src: diageoLogo, w: 520, h: 120 },
  { id: 'emirates', name: 'Emirates', src: emiratesLogo, w: 520, h: 116 },
  { id: 'ugachick', name: 'Ugachick', src: ugachickLogo, w: 225, h: 225 },
  { id: 'multichoice', name: 'MultiChoice', src: multichoiceLogo, w: 428, h: 260 },
] as const;

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
    logos: clientLogos.map(({ id, name, src, w, h }) => ({
      id,
      name,
      image: img(src, w, h, `${name} logo`),
    })),
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
