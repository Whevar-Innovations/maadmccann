import type {
  CaseStudyPage,
  GalleryItem,
  ImageAsset,
  WorkPage,
  WorkProject,
} from '../types';
import { img } from './assets';
import { home } from './home';
import { CASE_STUDY_SLUGS } from './workSlugs';
import motif1600 from '@/assets/img/work-motif-1600.webp';
import motif2800 from '@/assets/img/work-motif-2800.webp';

/**
 * Our Work (/work) and the case studies behind it (/work/:slug).
 * Copy is transcribed from "MAAD McCANN Website Our Work" (artboards 1 to 5).
 * Images are optimised exports from that package in src/assets/img/work/<slug>/ as
 * {name}-700.webp / {name}-1400.webp; the grid placeholders in work/tiles/ are interim stills
 * from the design and should be replaced with real thumbnails.
 */

const files = import.meta.glob<string>('/src/assets/img/work/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Builds an ImageAsset from every `{base}-{width}.webp` export found for `base`. */
function asset(base: string, width: number, height: number, alt: string): ImageAsset {
  const variants = Object.entries(files)
    .map(([path, url]) => {
      const m = path.match(new RegExp(`/work/${base}-(\\d+)\\.webp$`));
      return m ? { w: Number(m[1]), url } : null;
    })
    .filter((v): v is { w: number; url: string } => v !== null)
    .sort((a, b) => a.w - b.w);
  const largest = variants[variants.length - 1];
  if (!largest) throw new Error(`Missing work image export: ${base}`);
  const srcSet =
    variants.length > 1 ? variants.map((v) => `${v.url} ${v.w}w`).join(', ') : undefined;
  return img(largest.url, width, height, alt, srcSet);
}

const item = (image: ImageAsset, caption?: string): GalleryItem =>
  caption ? { image, caption } : { image };

const LEGAL = 'DRINK RESPONSIBLY. EXCESSIVE CONSUMPTION OF ALCOHOL IS HARMFUL TO YOUR HEALTH. NOT FOR SELL TO PERSONS UNDER THE AGE OF 18.';

/** Placeholder tiles: image only, no case study yet. */
const tile = (name: string, alt: string) => asset(`tiles/${name}`, 802, 443, alt);

const projects: WorkProject[] = [
  {
    id: 'what-makes-us-ugandan',
    slug: 'what-makes-us-ugandan',
    client: 'Uganda Development Bank',
    title: 'What Makes Us Ugandan',
    image: tile('what-makes-us-ugandan', 'Aerial view of Kampala'),
    href: '/work',
    categoryIds: ['finance'],
    hasCaseStudy: false,
  },
  {
    id: 'tusker-malt',
    slug: 'tusker-malt',
    client: 'Uganda Breweries',
    title: 'Tusker Malt',
    image: tile('tusker-malt', 'Tusker Malt bottle on ice'),
    href: '/work',
    categoryIds: ['food-beverages'],
    hasCaseStudy: false,
  },
  {
    id: 'tuskerlite',
    slug: 'tuskerlite-turn-on',
    client: 'Tusker Lite',
    title: 'Turn On The Lite',
    image: asset('tuskerlite-turn-on/poster', 3016, 1260, 'Tusker Lite: Turn On The Lite film still'),
    href: '/work/tuskerlite-turn-on',
    categoryIds: ['food-beverages'],
    hasCaseStudy: true,
  },
  {
    id: 'mastercard',
    slug: 'mastercard-documentary',
    client: 'Mastercard',
    title: 'Mastercard Documentary',
    image: tile('mastercard', 'Women applauding in face masks'),
    href: '/work',
    categoryIds: ['finance', 'social-responsibility'],
    hasCaseStudy: false,
  },
  {
    id: 'kampala-waste',
    slug: 'kampala-waste-management',
    client: 'KMW',
    title: 'Kampala Waste Management',
    image: tile('kampala-waste', 'Aerial view of a Kampala taxi park'),
    href: '/work',
    categoryIds: ['social-responsibility'],
    hasCaseStudy: false,
  },
  {
    id: 'jesa',
    slug: 'jesa-start-tv',
    client: 'JESA',
    title: 'JESA_Start_TV',
    image: tile('jesa', 'A hand holding a carton of JESA milk'),
    href: '/work',
    categoryIds: ['food-beverages'],
    hasCaseStudy: false,
  },
  {
    id: 'topowa',
    slug: 'topowa',
    client: 'CCEDU',
    title: 'Topowa',
    image: tile('topowa', 'Presenter in a Kampala taxi park'),
    href: '/work',
    categoryIds: ['sbcc', 'social-responsibility'],
    hasCaseStudy: false,
  },
  {
    id: 'gotv',
    slug: 'gotv-ka-weekie',
    client: 'Multichoice',
    title: 'GOtv Ka Weekie',
    image: asset('gotv-ka-weekie/poster', 2575, 1445, 'GOtv: Ka Weekie film still'),
    href: '/work/gotv-ka-weekie',
    categoryIds: ['media'],
    hasCaseStudy: true,
  },
  {
    id: 'malayo',
    slug: 'malayo-ne-pride',
    client: 'Pride Bank',
    title: 'Malayo ne Pride',
    image: tile('malayo', 'Market vendor and boda rider'),
    href: '/work',
    categoryIds: ['finance'],
    hasCaseStudy: false,
  },
  {
    id: 'baati',
    slug: 'uganda-baati-crown',
    client: 'Uganda Baati',
    title: 'Crown Your Home',
    image: asset('uganda-baati-crown/poster', 3016, 1697, 'Uganda Baati: Crown Your Home film still'),
    href: '/work/uganda-baati-crown',
    categoryIds: ['real-estate'],
    hasCaseStudy: true,
  },
  {
    id: 'bulamu',
    slug: 'bulamu',
    client: 'UNICEF',
    title: 'Bulamu',
    image: tile('bulamu', 'A father caring for a baby in a hospital ward'),
    href: '/work',
    categoryIds: ['sbcc', 'social-responsibility'],
    hasCaseStudy: false,
  },
  {
    id: 'pride',
    slug: 'pride-bank-growing',
    client: 'Pride Bank',
    title: 'Take Pride',
    image: asset('pride-bank-growing/poster', 3016, 1696, 'Pride Bank: Take Pride film still'),
    href: '/work/pride-bank-growing',
    categoryIds: ['finance'],
    hasCaseStudy: true,
  },
  {
    id: 'ubl-fundi',
    slug: 'ubl-fundi',
    client: 'Uganda Baati',
    title: 'UBL Fundi',
    image: tile('ubl-fundi', 'A roofing fundi in a hard hat'),
    href: '/work',
    categoryIds: ['real-estate'],
    hasCaseStudy: false,
  },
];

export const work: WorkPage = {
  seo: {
    title: 'Our Work',
    description:
      'Campaigns from MAAD McCANN Kampala: deep brand strategy meets world-class creative execution, across finance, food and beverages, media, real estate, social change and more.',
  },
  hero: {
    headlineLines: ['We don’t just make ads.', 'We make cultural waves.'],
    subheading:
      'Where deep brand strategy meets world-class creative execution. See how we turn real truths into market growth.',
    motif: img(motif2800, 6336, 2688, '', `${motif1600} 1600w, ${motif2800} 2800w`),
  },
  filterLabel: 'Filter work by sector',
  allLabel: 'ALL WORK',
  categories: [
    { id: 'sbcc', label: 'SBCC' },
    { id: 'cosmetics', label: 'COSMETICS' },
    { id: 'finance', label: 'FINANCE' },
    { id: 'food-beverages', label: 'FOOD & BEVERAGES' },
    { id: 'media', label: 'MEDIA' },
    { id: 'real-estate', label: 'REAL ESTATE' },
    { id: 'social-responsibility', label: 'SOCIAL RESPONSIBILITY' },
    { id: 'telecom', label: 'TELECOM' },
    { id: 'tourism', label: 'TOURISM' },
  ],
  pageSize: 9,
  projects,
};

/** Header video: the showreel stands in until each project has its own Mux asset. */
const showreelUrl = home.showreel.videoUrl;

export const caseStudies: CaseStudyPage[] = [
  {
    slug: 'gotv-ka-weekie',
    seo: {
      title: 'GOtv Ka Weekie',
      description:
        'Big value in seven days: how MAAD McCANN positioned Ka Weekie as the smartest 7 days in Ugandan entertainment for Multichoice.',
    },
    clientLabel: 'CLIENT:',
    client: 'Multichoice',
    title: 'Big value in seven days: The ka weekie story.',
    media: {
      kind: 'video',
      videoUrl: showreelUrl,
      poster: asset('gotv-ka-weekie/poster', 2575, 1445, 'GOtv Ka Weekie film still'),
    },
    headline:
      'How MAAD McCann Positioned Ka Weekie as the Smartest 7 Days in Ugandan Entertainment.',
    story: [
      {
        body: 'When MultiChoice Uganda introduced 7-day packages across DStv and GOtv, the challenge wasn’t just communicating a price point—it was shifting consumer behavior. MAAD McCann developed the Ka Weekie campaign identity to tap directly into the heartbeat of Ugandan culture, translating complex pricing tiers into a simple, relatable message: premium sports, news, and drama available on your own terms. By elevating everyday consumer stories and framing short-term subscriptions around real-life moments—like long weekends, village trips, or key football fixtures—we created a campaign that felt intimately tailored to the everyday viewer.',
      },
      {
        body: 'From eye-catching billboard placements to memorable radio jingles and digital engagements, every touchpoint was engineered to drive immediate action. The campaign successfully removed the friction of monthly commitments, making it effortless for customers to subscribe, pause, and renew as needed. The result was a culture-defining creative campaign that not only boosted short-term package consumption and customer retention for MultiChoice Uganda, but also demonstrated the power of hyper-local strategy in driving commercial success.',
      },
    ],
    gallery: [
      {
        layout: 'rows',
        rows: [
          [
            item(asset('gotv-ka-weekie/kv-introducing-young', 977, 1383, 'Ka Weekie: Introducing, three neighbours in bright prints')),
            item(asset('gotv-ka-weekie/kv-introducing-elders', 978, 1384, 'Ka Weekie: Introducing, three elders seated together')),
            item(asset('gotv-ka-weekie/kv-kaakano', 982, 1390, 'Ka Weekie kaakano: friends on stools with a milk can')),
          ],
          [item(asset('gotv-ka-weekie/banner-introducing', 3012, 1146, 'Ka Weekie: Introducing, two friends dancing, with the weekly package prices'))],
          [item(asset('gotv-ka-weekie/banner-kaakano', 3010, 1145, 'Ka Weekie kaakano banner with the weekly package prices'))],
        ],
      },
    ],
  },
  {
    slug: 'uganda-baati-crown',
    seo: {
      title: 'Crown Your Home',
      description:
        'How MAAD McCANN turned the roof into the crown of every home for Uganda Baati.',
    },
    clientLabel: 'CLIENT:',
    client: 'Uganda Baati',
    title: 'Crown Your Home',
    media: {
      kind: 'video',
      videoUrl: showreelUrl,
      poster: asset('uganda-baati-crown/poster', 3016, 1697, 'A red-tiled roof on a family home'),
    },
    headline:
      'We turned the roof into more than a functional element of a building. We positioned it as the crown of every home',
    story: [
      {
        body: 'The finishing touch that represents pride, protection, achievement and the fulfilment of a dream. The campaign celebrated the idea that every home deserves a crown, and that the right roofing choice makes all the difference.',
      },
      {
        label: 'The Execution',
        body: 'Through a compelling creative direction, the campaign brought the emotional connection between homeownership and quality roofing to life. By placing Uganda Baati at the heart of this aspiration, we developed a campaign that connected product value with the deeper meaning of owning and building a home. The idea was brought to life through an integrated communication approach designed to build brand affinity, strengthen product consideration and inspire audiences to crown their homes with confidence.',
      },
      {
        label: 'The Impact',
        body: 'Crown Your Home gave Uganda Baati a meaningful platform to connect with homeowners and aspiring homeowners beyond the functional benefits of roofing. It reinforced the brand’s role in helping Ugandans turn houses into homes, while celebrating the pride that comes with building something of lasting value.',
      },
      {
        label: 'The Takeaway',
        body: 'Because every home deserves more than a roof. It deserves a crown.',
      },
    ],
    gallery: [
      {
        layout: 'beside',
        tallSide: 'right',
        tall: item(asset('uganda-baati-crown/ad-woman-tall', 875, 1241, 'Crown Your Home with Orientile: a homeowner pointing at her roof')),
        rows: [
          [item(asset('uganda-baati-crown/ad-man', 1640, 922, 'Crown Your Home with Orientile: a man pointing at a red tiled roof'))],
          [item(asset('uganda-baati-crown/ad-woman', 1640, 922, 'Crown Your Home with Orientile: a woman pointing at a red tiled roof'))],
        ],
      },
      {
        layout: 'rows',
        rows: [
          [
            item(asset('uganda-baati-crown/dyk-1', 983, 1364, 'Did you know? Orientile roof tile launched in 2022')),
            item(asset('uganda-baati-crown/dyk-2', 983, 1364, 'Did you know? Orientile comes in 28 gauge, 26 gauge on order')),
            item(asset('uganda-baati-crown/dyk-3', 984, 1364, 'Did you know? A fundi can clean the roof daily during installation')),
          ],
        ],
      },
    ],
  },
  {
    slug: 'pride-bank-growing',
    seo: {
      title: 'Take Pride',
      description:
        'How MAAD McCANN built the Take Pride campaign for Pride Bank around one thought: everyone has something worth taking pride in.',
    },
    clientLabel: 'CLIENT:',
    // The design lists "Uganda Baati" here; Pride Bank is the client. Confirm with the designer.
    client: 'Pride Bank',
    title: 'Take Pride',
    media: {
      kind: 'video',
      videoUrl: showreelUrl,
      poster: asset('pride-bank-growing/poster', 3016, 1696, 'Archive photo of a Pride Microfinance loans manager'),
    },
    headline:
      'We built the Take Pride campaign around a simple but powerful thought: everyone has something worth taking pride in.',
    story: [
      {
        label: 'The Challenge',
        body: 'Banking is more than transactions, savings and financial services. It is about the opportunities people create, the milestones they achieve and the future they work towards. Pride Bank sought to strengthen its connection with Ugandans by building a brand narrative that celebrated personal achievement, financial progress and the confidence that comes with taking ownership of one’s journey.',
      },
      {
        label: 'The Big Idea: Take Pride',
        body: 'We built the campaign around a simple but powerful thought: everyone has something worth taking pride in. From the entrepreneur growing a business to the individual achieving a personal milestone, the campaign celebrated the everyday victories that make a difference. By connecting these moments of achievement to Pride Bank, we positioned the brand as more than a financial institution — but as a partner in people’s ambitions, progress and aspirations.',
      },
      {
        label: 'The Execution',
        body: 'Through a relatable creative direction, the campaign brought the spirit of pride to life, celebrating the people, ambitions and achievements that shape everyday Uganda. The communication placed people at the centre of the story, creating an emotional connection between the bank and the communities it serves. With a campaign identity anchored in the words Take Pride, we created a platform that could communicate the bank’s values while reinforcing its relevance in the lives of its customers.',
      },
      {
        label: 'The Impact',
        body: 'Take Pride created an opportunity for Pride Bank to connect with audiences through a shared sense of achievement and aspiration. It reinforced the emotional value of banking by shifting the conversation beyond financial products to the people, dreams and ambitions behind every financial decision.',
      },
      {
        label: 'The Takeaway',
        body: 'Every milestone matters. Every achievement counts. And every step forward is something to take pride in.',
      },
    ],
    gallery: [
      {
        layout: 'beside',
        tallSide: 'right',
        tall: item(asset('pride-bank-growing/women', 1496, 1871, 'Take Pride in breaking barriers with our Women Improvement Loan')),
        rows: [
          [
            item(asset('pride-bank-growing/agri', 728, 1039, 'Take Pride in working the land with our Agriculture Loan')),
            item(asset('pride-bank-growing/home', 728, 1040, 'Take Pride in building your dream home with our Home Improvement Loan')),
          ],
          [item(asset('pride-bank-growing/school-fees', 1482, 802, 'Take Pride in giving your child a bright future with our School Fees Loan'))],
        ],
      },
      {
        layout: 'rows',
        rows: [[item(asset('pride-bank-growing/rising-stars', 2996, 1461, 'Take Pride in helping their money grow with them using our Rising Stars account'))]],
      },
    ],
  },
  {
    slug: 'tuskerlite-turn-on',
    seo: {
      title: 'Turn On The Lite',
      description:
        'How MAAD McCANN invited a social, music-loving audience to switch on their lighter side for Tusker Lite.',
    },
    clientLabel: 'CLIENT:',
    client: 'Tusker Lite',
    title: 'Turn On The Lite',
    media: {
      kind: 'video',
      videoUrl: showreelUrl,
      poster: asset('tuskerlite-turn-on/poster', 3016, 1260, 'A Tusker Lite bottle on a Kampala rooftop'),
    },
    // The design repeats the Take Pride headline here (placeholder). This one is drawn from the
    // approved Takeaway line. Confirm with the designer.
    headline:
      'Life is full of moments worth experiencing. Sometimes, all it takes is a little switch.',
    story: [
      {
        label: 'The Challenge',
        body: 'In a world where people are constantly looking for new experiences, meaningful connections and moments worth remembering, brands need to do more than simply be present. They need to become part of the experience. Tusker Lite set out to strengthen its connection with a socially active audience by celebrating the moments, occasions and experiences that make life exciting.',
      },
      {
        label: 'The Big Idea: Turn On The Lite',
        body: 'We brought the brand promise to life through an idea that invited audiences to switch on their lighter side. More than a campaign line, Turn On The Lite became an invitation to embrace good energy, explore experiences and enjoy the moments that bring people together. It positioned Tusker Lite as a natural companion to a vibrant social lifestyle, giving the brand a distinctive voice in the world of entertainment and social experiences.',
      },
      {
        label: 'The Execution',
        body: 'We translated the idea into an engaging brand experience built around the energy and personality of Tusker Lite. Through vibrant creative expressions and lifestyle-led communication, the campaign brought the spirit of the brand closer to its audience. The creative direction celebrated social connections, entertainment and the excitement of experiencing life with a lighter perspective, ensuring that the campaign remained true to the brand’s personality across its consumer touchpoints.',
      },
      {
        label: 'The Impact',
        body: 'Turn On The Lite provided Tusker Lite with an engaging creative platform to connect with its audience through shared experiences and lifestyle aspirations. It strengthened the brand’s association with contemporary social culture, creating opportunities for meaningful audience engagement and greater brand affinity.',
      },
      {
        label: 'The Takeaway',
        body: 'Life is full of moments worth experiencing. Sometimes, all it takes is a little switch. Turn On The Lite.',
      },
    ],
    gallery: [
      {
        layout: 'rows',
        rows: [
          [item(asset('tuskerlite-turn-on/dj-green', 2989, 1304, 'Turn on your Lite: a DJ with a mixing desk beside a Tusker Lite bottle'), LEGAL)],
          [
            item(asset('tuskerlite-turn-on/dj-hat', 1480, 646, 'Turn on your Lite: a creative in a neon hat'), LEGAL),
            item(asset('tuskerlite-turn-on/photographer', 1480, 646, 'Turn on your Lite: a photographer with a camera'), LEGAL),
          ],
          [item(asset('tuskerlite-turn-on/singer', 2989, 1304, 'Turn on your Lite: a performer in an orange jacket'), LEGAL)],
        ],
      },
    ],
  },
];

if (caseStudies.map((c) => c.slug).join() !== CASE_STUDY_SLUGS.join()) {
  throw new Error('workSlugs.ts is out of sync with the caseStudies in work.ts');
}
for (const project of projects) {
  if (project.hasCaseStudy !== (CASE_STUDY_SLUGS as readonly string[]).includes(project.slug)) {
    throw new Error(`Work project "${project.slug}": hasCaseStudy does not match its case study`);
  }
}
