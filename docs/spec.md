## 3. Stack

| Purpose | Package |
| --- | --- |
| Build | `vite`, `react`, `react-dom`, `typescript` |
| Routing | `react-router` (data router, loaders fetch content) |
| Styling | Tailwind CSS v4, brand tokens as CSS variables in `@theme` |
| Animation | `gsap` (core, ScrollTrigger, SplitText) + `@gsap/react`. GSAP and all its plugins are free |
| Smooth scroll | `lenis` |
| Added later for the CMS | `@sanity/client`, `@sanity/image-url`, `@portabletext/react` |
| Only if a Lottie file is supplied | `lottie-react` |

Do not mix in Motion/framer-motion. GSAP owns all animation so timing stays consistent.

## 4. Project structure

```
src/
  content/
    types.ts            // TS types = future Sanity schema shape
    api.ts              // getHomePage(), getSiteSettings(), getWhatWeDoPage(), getTeamPage(), getWorkPage(), getCaseStudy(slug)...
    static/             // static source; only src/content/ may import it (check:rules)
      home.ts  settings.ts  whatWeDo.ts  team.ts
    mock/               // Sanity-shaped mock source (VITE_CONTENT_SOURCE=mock)
    sanity/             // mappers.ts now; client.ts, queries.ts later
  motion/
    tokens.ts  gsap-setup.ts
    SmoothScroll.tsx  LoaderProvider.tsx  PageTransition.tsx
    RevealText.tsx  RevealImage.tsx  FadeUp.tsx  Counter.tsx  Magnetic.tsx
  components/
    ui/   Img.tsx  Button.tsx  Link.tsx
    layout/  Header.tsx  Footer.tsx  RootLayout.tsx
    home/  Hero.tsx  Trophies.tsx  Showreel.tsx  ClientsRow.tsx
           WorkGrid.tsx  WorkCard.tsx  Impact.tsx  CtaBand.tsx
    what-we-do/  WhatWeDoHero.tsx  Services.tsx  ServiceCard.tsx  SbccOrbit.tsx  OrgChart.tsx
    team/  TeamHero.tsx  TeamIntro.tsx  TeamGrid.tsx  TeamCard.tsx  BioPanel.tsx  ProfileDialog.tsx
    work/  WorkHero.tsx  CategoryFilter.tsx  ProjectGrid.tsx  ProjectCard.tsx  Pagination.tsx
           CaseHeader.tsx  CaseMedia.tsx  CaseStory.tsx  ArtworkGallery.tsx
  routes/  home.tsx  what-we-do.tsx  the-maad-ones.tsx  work.tsx  work-detail.tsx (loader + page each)
  lib/     useSeo.ts  site.ts (site-wide SEO defaults)
  styles/  globals.css (tokens)
scripts/check-rules.mjs   // rule guard, runs before every build
public/trophies/   grand-prix-{700,1400}.webp  digital-social-{700,1400}.webp  creative-director-{700,1400}.webp
src/assets/svg/    maad-logo-white.svg  a-pattern.svg  lower-pattern.svg
src/assets/img/    hero-bg.jpg  cta-bg.jpg  work/*.jpg
```

## 5. Content architecture (built for the Sanity swap)

### 5.1 Principles

- **Components are dumb.** They take props. They never import from `content/static`.
- **Everything is async from day one.** `api.ts` returns Promises and React Router loaders await them, so swapping in Sanity changes nothing about how pages load.
- **Types are the contract.** `types.ts` is designed so each type maps 1:1 to a Sanity document or object. Sanity mappers convert query results into these exact types.
- **Motion and layout are not content.** Editors control copy, images, links and order. Animation, grid layout and timings live in code only.
- **Images go through one component** (`<Img>`) fed by an `ImageAsset` object, so the Sanity image URL builder can replace local imports without touching layouts.
- **Switch by env var:** `VITE_CONTENT_SOURCE=static | sanity`.
- **Site-wide content is settings, not page content.** Nav, footer and the CTA band (`SiteSettings.cta`) load once in the root loader. Page loaders only fetch their own page.
- **Enforced, not just documented.** `npm run check:rules` (`scripts/check-rules.mjs`, run by `npm run build`) fails if any file outside `src/content/` imports `content/static`, and also on raw colours, string eases and unregistered routes (§6, §8.1).

### 5.2 Types (`src/content/types.ts`)

```ts
export type ImageAsset = {
  src: string; alt: string; width: number; height: number;
  lqip?: string;     // base64 blur placeholder (Sanity metadata.lqip later)
  srcSet?: string;   // optional responsive set
};
export type Link = { label: string; href: string; external?: boolean };

export type Award = { id: string; title: string; year: number; image: ImageAsset };

export type Project = {
  id: string; slug: string;
  client: string; title: string;   // rendered as `${client}: ${title}`
  image: ImageAsset;
  href: string;                    // /work/{slug}
};

export type Stat = {
  value: number; decimals?: number; suffix: string; // 9.5 + 'M+'
  label: string; description: string;
};

export type ClientLogo = { id: string; name: string; image: ImageAsset };

export type HomePage = {
  hero: {
    headlineLines: string[];     // one string per visual line (drives line masks)
    subheading: string; cta: Link;
    ghostText: string;           // 'TRUTH WELL TOLD'
    awards: Award[];             // exactly 3; order = [back-left, back-right, front]
  };
  showreel: { heading: string; subheading: string; poster: ImageAsset; videoUrl: string };
  clients: { heading: string; logos: ClientLogo[] };
  featuredProjects: Project[];   // exactly 5
  impact: { heading: string; body: string; stats: Stat[] };  // 4 stats
};

/** Site-wide CTA band rendered above the footer on every page. */
export type CtaContent = { headlineLines: string[]; body: string; button: Link };

export type SiteSettings = {
  nav: Link[]; navCta: Link;
  cta: CtaContent;
  footer: {
    navigation: Link[]; services: Link[];
    contact: { email: string; phone: string; landline: string; address: string[] };
    socials: { platform: 'x'|'facebook'|'youtube'|'linkedin'|'instagram'; url: string }[];
    copyright: string;
  };
};

export type PageSeo = { title: string; description: string };

// What We Do: one object per service card; each carries `id`, its deep-link anchor
export type WhatWeDoPage = {
  seo: PageSeo;
  hero: { headlineLines: string[]; bodyLines: string[] };
  sbcc: { id; title; tagline; body; bullets; approaches; humanCentered; strength; experience };
  digital: { id; title; tagline; intro; pills: string[][]; leftParagraphs; rightParagraphs };
  accountManagement, media, experiential, brandStrategy, pr, creative, production: { id; … };
};  // full definition in src/content/types.ts

// The MAAD Ones
export type TeamBio = { paragraphs: string[]; brands?: string; projects?: string };
export type TeamPerson = { name: string; bio?: TeamBio };
export type TeamMember = TeamPerson & { slug: string; title: string; image: ImageAsset };
export type TeamSection = { id: string; title: string; columns: number; members: TeamMember[] };
export type TeamRow = TeamSection | [TeamSection, TeamSection];  // a pair renders side by side
export type TeamPage = { seo: PageSeo; hero: ImageAsset; intro: { accent; headline; body }; rows: TeamRow[] };

// Our Work (/work) and case studies (/work/:slug)
export type WorkProject = Project & { categoryIds: string[]; hasCaseStudy: boolean };  // grid card
export type WorkPage = { seo; hero: { headlineLines; subheading; motif }; filterLabel; allLabel;
  categories: WorkCategory[]; pageSize: number; projects: WorkProject[]; labels: { ... } };
export type CaseMedia = { kind: 'video'; videoUrl; poster } | { kind: 'image'; image };  // Mux video or hero image
export type GalleryBlock = { layout: 'rows'; rows: GalleryItem[][] }
  | { layout: 'beside'; tallSide: 'left' | 'right'; tall: GalleryItem; rows: GalleryItem[][] };
export type CaseStudyPage = { slug; seo; clientLabel; client; title; media: CaseMedia; headline;
  story: { label?; body }[]; gallery: GalleryBlock[] };
```

### 5.3 API layer (`src/content/api.ts`)

```ts
import type { HomePage, SiteSettings } from './types';
const source = import.meta.env.VITE_CONTENT_SOURCE ?? 'static';

export async function getHomePage(): Promise<HomePage> {
  if (source === 'sanity') return (await import('./sanity/queries')).getHomePage();
  return (await import('./static/home')).home;
}
export async function getSiteSettings(): Promise<SiteSettings> {
  if (source === 'sanity') return (await import('./sanity/queries')).getSiteSettings();
  return (await import('./static/settings')).settings;
}
// Same pattern for every page: getWhatWeDoPage(): WhatWeDoPage, getTeamPage(): TeamPage.
// Each fetcher passes its result through an assertXxx() that throws on structural problems
// (wrong number of featured projects, a missing service section, an empty team section).
// mock/source.ts exports a structuredClone version of each.
```

The dynamic imports keep the Sanity client out of the bundle in static mode. Loaders:

```ts
// routes/home.tsx
export const homeLoader = async () => ({ home: await getHomePage() });
// routes/what-we-do.tsx, routes/the-maad-ones.tsx
export const whatWeDoLoader = async () => ({ page: await getWhatWeDoPage() });
export const theMaadOnesLoader = async () => ({ page: await getTeamPage() });
// routes/work.tsx, routes/work-detail.tsx (unknown slug throws a 404 Response)
export const workLoader = async () => ({ page: await getWorkPage() });
export const workDetailLoader = async ({ params }) => ({ page: await getCaseStudy(params.slug) });
// RootLayout route loader: settings.cta feeds the CTA band on every page
export const rootLoader = async () => ({ settings: await getSiteSettings() });
```

Components read data with `useLoaderData()` in the route and pass props down. Section components never call the API.

### 5.4 Static content (`src/content/static/`)

Copy below is taken from the approved design. Local images are imported from `src/assets` and wrapped in `ImageAsset` objects (width and height are required). Routes and URLs marked TBC are placeholders.

```ts
export const home: HomePage = {
  hero: {
    headlineLines: ['IDEAS', 'THAT MOVE', 'THE WORLD.'],
    subheading: 'We’re a 360° creative agency bringing together strategy, creativity, digital and culture to create work that gets people talking, brands moving and change happening.',
    cta: { label: 'VIEW OUR WORK', href: '/work' },
    ghostText: 'TRUTH WELL TOLD',
    awards: [
      { id: 'digital',  title: 'Digital - Social Media & Influencer', year: 2025, image: img('/trophies/digital-social-1400.webp', 663, 1400, 'Silverback Awards trophy: Digital, Social Media & Influencer 2025') },
      { id: 'creative', title: 'Creative Director of the Year',       year: 2025, image: img('/trophies/creative-director-1400.webp', 661, 1400, 'Silverback Awards trophy: Creative Director of the Year 2025') },
      { id: 'grand',    title: 'Grand Prix',                          year: 2025, image: img('/trophies/grand-prix-1400.webp', 671, 1400, 'Silverback Awards trophy: Grand Prix 2025') },
    ],
  },
  showreel: {
    heading: 'See The Maadness In Motion.',
    subheading: 'Skip the pitch deck. Watch our showreel and let the work speak for itself.',
    poster: /* showreel still, TBC */, videoUrl: '' /* TBC */,
  },
  clients: {
    heading: 'TRUSTED BY VISIONARY BRANDS',
    logos: [/* Coca-Cola, DStv, UNICEF, Rotary, GOtv, Emirates, BNI (SVGs TBC) */],
  },
  featuredProjects: [
    { id: 'gotv',   slug: 'gotv-ka-weekie',       client: 'GOtv',        title: 'Ka Weekie',                       /* GOtv_Ka_Weekie_A3_Poster */ },
    { id: 'coke',   slug: 'cocacola-digital',     client: 'CocaCola',    title: 'Digital',                         /* image TBC */ },
    { id: 'tusker', slug: 'tuskerlite-turn-on',   client: 'TuskerLite',  title: 'Turn On Your Lite',               /* Tuskerlite---Turn-on-your-Lite */ },
    { id: 'baati',  slug: 'uganda-baati-crown',   client: 'Uganda Baati', title: 'Crown Your Home',                /* Uganda-Baati---Orientile */ },
    { id: 'pride',  slug: 'pride-bank-growing',   client: 'Pride Bank',  title: 'Take Pride in Growing Together',  /* MAAD_website_artworks-04 (confirm) */ },
  ], // each gets href: `/work/${slug}` in the mapper
  impact: {
    heading: 'OUR IMPACT',
    body: 'We’re not here to make work that simply fills a billboard, feeds a timeline or checks a box. We’re here to make people stop. Look twice. Talk about it. Feel something. And DO something. At MAAD McCANN, we blend sharp strategy and fearless creativity to create work that moves brands and the people behind them.',
    stats: [
      { value: 350, suffix: '+',  label: 'Campaigns Delivered',     description: 'Helping brands make their mark online.' },
      { value: 9.5, decimals: 1, suffix: 'M+', label: 'Users reached', description: 'Our designs engage millions globally.' },
      { value: 95,  suffix: '%',  label: 'Client satisfaction rate', description: 'We build long-term partnerships through proven results.' },
      { value: 18,  suffix: '+',  label: 'Years of expertise',      description: 'Decades of experience in delivering impactful digital solutions.' },
    ],
  },
};

export const settings: SiteSettings = {
  nav: [
    { label: 'The MAADness', href: '/the-maadness' }, { label: 'What We Do', href: '/what-we-do' },
    { label: 'Our Work', href: '/work' }, { label: 'CSR', href: '/csr' },
    { label: 'Our Partners', href: '/partners' }, { label: 'The MAAD Ones', href: '/team' },
    { label: 'Blog', href: '/blog' }, { label: 'Awards', href: '/awards' },
  ],
  navCta: { label: 'Talk To Us', href: '/contact' },
  cta: {
    headlineLines: ['Got something in mind?', 'Let’s make something MAAD.'],
    body: 'Bring us the brief, the challenge or even the “we know something needs to change but we’re not quite sure what.” We’ll take it from there.',
    button: { label: 'Let’s Talk', href: '/contact' },
  },
  footer: {
    navigation: [/* Let’s Talk, The MAADness, What We Do, Our Work, Corporate Social Responsibility, Our Partners, The MAAD Ones, Blog, Awards */],
    services: [/* Creative, PR & Reputation Mgt, Brand Strategy & Dev’t, Experiential Marketing, Account Management, Production, Media, Digital, SBCC */],
    contact: {
      email: 'maad@maad.co.ug', phone: '+256 701 222 522', landline: '0414 222 522',
      address: ['Plot 2436, Ntinda', '(off Bukoto–Ntinda Road),', 'Kampala, Uganda'],
    },
    socials: [/* x, facebook, youtube, linkedin, instagram: URLs TBC */],
    copyright: '© {year} MAAD McCANN. All rights reserved.',  // {year} filled in at render time
  },
};
```

### 5.5 Future Sanity mapping

| Sanity document | Maps to | Notes |
| --- | --- | --- |
| `siteSettings` (singleton) | `SiteSettings` | nav, footer columns, contact, socials, CTA band |
| `homePage` (singleton) | `HomePage` | hero, showreel, clients, impact objects |
| `whatWeDoPage` (singleton) | `WhatWeDoPage` | seo, hero, one object per service (with anchor `id`) |
| `teamPage` (singleton) | `TeamPage` | seo, hero image, intro, rows of sections referencing `teamMember` |
| `workPage` (singleton) | `WorkPage` | seo, hero, categories, interface labels; projects reference `project` |
| `caseStudy` (collection) | `CaseStudyPage` | slug, media (Mux URL or image), story paragraphs, gallery blocks; referenced from `project` |
| `teamMember` (collection) | `TeamMember` | portrait (hotspot, required `alt`), bio; title is set per section |
| `project` (collection) | `Project` | `client`, `title`, `slug`, `image` (hotspot, required `alt`) |
| `award` (collection) | `Award` | referenced from `homePage.hero.awards` |
| `clientLogo` (collection) | `ClientLogo` | SVG or PNG upload |

Schema rules that keep the swap painless:

- `headlineLines` is an **array of strings**, not one block of text, because line masks depend on visual lines.
- `featuredProjects` is a reference array validated to exactly 5, and `hero.awards` to at least 3 (the first 3 fill the triangle, extras rotate in from a pool). Layout slots are positional (see §7), so editors reorder rather than pick a layout.
- Every image field requires `alt`. Query `asset->metadata{lqip, dimensions}` and map it to `ImageAsset`.
- Stats are an array of objects with numeric `value`, optional `decimals`, `suffix`, `label`, `description`.
- Mappers live in `src/content/sanity/mappers.ts`. They are the only place that knows both shapes.

```groq
*[_type == 'homePage'][0]{
  hero{ headlineLines, subheading, cta, ghostText,
    'awards': awards[]->{ _id, title, year,
      image{ alt, asset->{ _id, url, metadata{ lqip, dimensions } } } } },  // raw shape -> mapAward()
  showreel{ ... }, clients{ ... }, impact{ ... },
  'featuredProjects': featuredProjects[]->{ ... }
}
```

## 6. Design tokens (`globals.css`, Tailwind `@theme`)

Values are approximate, sampled from the design. **Confirm with the designer or eyedropper the PDF before finalising.**

| Token | Value (approx.) | Use |
| --- | --- | --- |
| `--color-crimson-600` | `#C42B4C` | hero highlight (top right of gradient) |
| `--color-crimson-800` | `#8E1B3B` | hero and CTA mid-tone |
| `--color-crimson-950` | `#2A0618` | hero and CTA shadow |
| `--color-impact-red` | `#8B1A1A` | OUR IMPACT heading, stat accents |
| `--color-ink` | `#0B0B0B` | showreel section |
| `--color-charcoal` | `#222222` | footer block |
| `--color-paper` | `#FFFFFF` | light sections |
| `--color-gold-500` | `#D9A93A` | trophy glow only |

**Page-specific tokens** (exact values from the built pages, added in `globals.css` so no component carries a raw colour):

| Token | Value | Use |
| --- | --- | --- |
| `--color-crimson-975` / `-990` | `#240610` / `#16020B` | hero ghost text; footer motif base lines |
| `--color-blush` | `#FFCCD8` | footer motif spotlight lines |
| `--color-berry` | `#8E1B3B` | showreel player accent (equals this table's crimson-800; the built crimson-800 is `#8D1819`, so confirm with the designer) |
| `--color-ink-soft` | `#0F0F0F` | hero A/V motif fill |
| `--color-menu-ink` | `#0E0E10` | mobile menu drawer |
| `--color-service-red` / `-hover` | `#880000` / `#9A0000` | What We Do red cards and creative tiles |
| `--color-graphite` | `#1E1E1E` | What We Do dark cards |
| `--color-wwd-ink`, `bg-wwd-glow` | `#121312`, radial `#2A2B2A → #161716 → #0B0C0B` | What We Do hero |
| `--color-ash` | `#A3A5A4` | What We Do hero motif |
| `--color-line` | `#D9D9D9` | ring borders |
| `--color-slate` | `#2B2D33` | org chart icon |
| `--color-placeholder` | `#D6D6D6` | portrait loading background |
| `--color-mist` | `#EEF3F5` | team bio hover panel |
| `--shadow-pill` / `-play` / `-panel`, `--drop-shadow-trophy` | | button lift, play button, bio panel, trophies |
| `--ease-brand` / `--ease-expo` | `cubic-bezier(.22,1,.36,1)` / `(.16,1,.3,1)` | CSS transitions (hover wipes, link underline) |

**Rule:** components never contain hex, `rgb()` or `hsl()` literals (enforced by `check:rules`). A new colour is added here and in `@theme` first.

**Typography is supplied.** The PDF is 1920 units wide, so the sizes below read as px at a 1920px viewport. Display type is uppercase for the hero headline, ghost text and OUR IMPACT, with line-height about 0.95 and letter-spacing about -0.02em (check against the design). Body line-height 1.5. Container: max-width 1440px, side padding `clamp(20px, 5vw, 72px)`. Breakpoints: 640 / 1024 / 1440.

| Style | Font | Design size | Fluid size | Used for |
| --- | --- | --- | --- | --- |
| Display Bold | Haas Grot Disp R 75 Bold | 105.6px | `clamp(2.75rem, 5.5vw, 6.6rem)` | Hero headline |
| Display Bold | Haas Grot Disp R 75 Bold | 204.5px | `clamp(4.5rem, 10.65vw, 12.8rem)` | Ghost text TRUTH WELL TOLD |
| Display Bold | Haas Grot Disp R 75 Bold | 60px | `clamp(2rem, 3.125vw, 3.75rem)` | Showreel heading |
| Display Black | Haas Grot Disp R 95 Black | 45.9px | `clamp(1.75rem, 2.4vw, 2.9rem)` | OUR IMPACT |
| Display Black | Haas Grot Disp R 95 Black | 81.8px | `clamp(3rem, 4.26vw, 5.1rem)` | Stat numbers |
| Display Medium | Haas Grot Disp R 65 Medium | 62px | `clamp(1.75rem, 3.23vw, 3.9rem)` | CTA band headline (sentence case) |
| Medium | Inter 18pt Medium | 18px, 15px | rule below | Hero subheading and Impact paragraph; stat descriptions |
| Bold | Inter 18pt Bold | 26px, 23.5px, 19.2px | rule below | Footer Let’s Talk; stat labels; footer column titles |
| SemiBold | Inter 18pt SemiBold | 30px, 20px, 17.3px, 14.1px | rule below | Work tile labels; showreel subheading; LET’S CONNECT; contact details |
| Regular | Inter 18pt Regular | 20px, 14.1px | rule below | View work; footer link lists |
| Accent | Futura BT Medium | 16.7px | rule below | VIEW OUR WORK link only |
| Fallback glyphs | Helvetica Neue Bold | 81.8px | same as stat numbers | The + and % in the stats only |

Fluid rule for the Inter, Futura and Helvetica sizes: `clamp(0.8 × size, size ÷ 19.2 vw, 1.15 × size)`.

**Licensing before launch**

- **Inter 18pt:** open licence (SIL OFL), free to self-host. Subset woff2 files for all four weights and a ready `fonts.css` are done: copy them to `public/fonts` and import `fonts.css`.
- **Haas Grot Disp R:** the three files are Commercial Type trial fonts with only 75 glyphs each (no % & + / : @ © ° –), and their licence covers personal or internal use. Buy a web licence for the same Round cut (65 Medium, 75 Bold, 95 Black) before launch. Until then `--font-display` falls back to Inter, so nothing breaks. Keep the trial files out of the repo and out of any public deployment.
- **Futura BT Medium:** restricted embedding, used on one link only. Buy a web licence, or ask the designer to approve a fallback (self-hosted Jost is an open Futura-style option).
- **Helvetica Neue Bold:** appears only because the trial Haas has no + or %. The licensed Haas does, so confirm with the designer and do not ship `HelveticaNeue.ttc`.

## 7. Homepage sections

| # | Section | Layout and content | Background |
| --- | --- | --- | --- |
| 1 | **Header** | Logo (white SVG) left. Eight links plus a white pill button *Talk To Us* on the right. Overlays the hero. Hides on scroll down, shows on scroll up. Mobile: full-screen menu with staggered links. | transparent, then `ink` at 80% blur after 80px |
| 2 | **Hero** | Left: 3-line headline, subheading (max 52ch), `VIEW OUR WORK` link with circle-arrow icon. Right: three trophies in a triangle (see §8.4). Behind: inverted-A motif. Bottom: ghosted `TRUTH WELL TOLD`, cropped by the section edge. Min height 100svh. | `hero-bg.jpg` red metallic |
| 3 | **Showreel** | Centred heading and subheading, then a full-width 16:9 video poster with a 96px outlined circle labelled WATCH in the centre. Click opens a fullscreen video modal. | `ink` |
| 4 | **Clients row** | Centred small-caps label, then 7 logos in one row (wraps to 2 rows below 640px). | `paper` |
| 5 | **Work grid** | Zero-gap tiles. Slot 0: tall, left half, spans three rows. Slots 1 to 3: stacked, right half. Slot 4: full-width banner (about 21:9). Each tile: full-bleed image, bottom gradient, label bottom-left (`Client: Title`) and `View work ——` with a line. | image |
| 6 | **Impact** | Two columns: `OUR IMPACT` in impact-red on the left, paragraph on the right. Below, four stats in a row, each with a top divider, big number, bold label and small grey description. 2×2 below 1024px. | `paper` |
| 7 | **CTA band** | Centred two-line headline, paragraph (max 60ch), white pill `Let’s Talk`. `lower-pattern.svg` as a faint overlay. | `cta-bg.jpg` red |
| 8 | **Footer** | Charcoal rounded block. Logo and *LET’S CONNECT* social icons left. Columns: NAVIGATION, SERVICES, INFO. Divider, then copyright. | `charcoal` |

## 8. Motion system

### 8.0 Principles

Restraint wins. Everything enters once, smoothly, and stays put. The hero is the only place with continuous motion. Animate `transform`, `opacity` and `clip-path` only. Use `gsap.matchMedia()` so reduced-motion users get plain fades.

### 8.1 Tokens (`motion/tokens.ts`)

```ts
export const EASE = { out: 'expo.out', soft: 'power3.out', inOut: 'expo.inOut', float: 'sine.inOut', pop: 'back.out(1.2)' };
export const DUR  = { ui: 0.4, text: 1.0, media: 1.3, hero: 1.2, page: 0.7 };
export const DIST = { rise: 32, slide: 60, maskFrom: 100 };   // px or percent as noted at use
export const STAGGER = { lines: 0.1, words: 0.04, items: 0.08, trophies: 0.18 };
export const SCROLL = { start: 'top 85%', lerp: 0.1 };
```

The file also holds `REVEAL`, `HERO_TIMELINE`, `LOADER`, `TRANSITION` and `MOTIF_LAB`, plus one named group per component with its own choreography (`SERVICE_CARD`, `SBCC_ORBIT`, `ORG_CHART`, `TEAM_GRID`, `TEAM_INTRO`, `TEAM_HERO`, `BIO_PANEL`, `PROFILE_DIALOG`, `HEADER_MENU`, `AWARDS_LOOP`, `SHOWREEL`, `FALL_IN`). Components contain no literal durations, eases, offsets or ScrollTrigger starts. A new value is added as a token first. String eases (`ease: 'power3.out'`) fail `check:rules`, so use `EASE.*`.

### 8.2 Loader

- Full-screen panel (crimson-950) with the logo animation centred. Scroll is locked (`lenis.stop()`), content is already in the DOM underneath.
- **Exit conditions, all required:** the logo animation has finished, `document.fonts.ready` has resolved, and hero assets (background, A-pattern, three trophy WebPs) are decoded.
- **Limits:** minimum visible 1.6s, hard timeout 4s (exit anyway). Show **once per session** (`sessionStorage`); on later visits and route changes skip straight to the hero.
- **Exit:** logo `scale 1 → 0.9` and fade (0.5s, `power2.in`), then panel `yPercent 0 → -100` (0.9s, `expo.inOut`). The hero timeline starts about 0.35s *before* the wipe ends so the two overlap.
- **Logo source (TBC):** `LoaderLogo` exposes `onDone`. Preferred: Lottie from After Effects. Fallback: rebuild from `maad-logo-white.svg` with GSAP (stroke draw or mask reveal). Last resort: GIF converted to muted `<video>` on a matching solid background. Do not use the raw GIF.

### 8.3 Hero timeline

One master timeline, defaults `{ ease: EASE.out }`. Times are seconds from hero start. Wrap in `useGSAP` with `matchMedia`.

| t | Element | From → to | Dur |
| --- | --- | --- | --- |
| 0.0 | Background | `scale 1.08 → 1` | 1.8 |
| 0.1 | Inverted-A motif | `xPercent -14 → 0`, `opacity 0 → 1` (enters from the **left**) | 1.6 |
| 0.15 | Headline lines (SplitText, masked) | `xPercent 40 → 0` (enters from the **right**), stagger 0.1 | 1.2 |
| 0.2 | Ghost text `TRUTH WELL TOLD` | `yPercent 100 → 0` inside an overflow-hidden wrapper (rises from the **bottom**), ease `power4.out` | 1.5 |
| 0.4 | Trophies | see §8.4 | 1.2 |
| 0.5 | Subheading | `x 60 → 0`, `opacity 0 → 1` | 1.0 |
| 0.65 | VIEW OUR WORK | `y 16 → 0`, `opacity 0 → 1` | 0.8 |
| 0.8 | Header (logo, links, button) | `y -12 → 0`, `opacity 0 → 1`, stagger 0.05 | 0.8 |
| 1.8 | Idle loops start | trophies float, glow pulse, shine sweep | loop |

Fonts must be ready before SplitText runs. Call `split.revert()` on cleanup.

### 8.4 Trophies (triangle and loop)

- DOM order and entrance order: **back-left (Digital) → back-right (Creative Director) → front (Grand Prix)**, stagger 0.18. Confirm which back trophy sits left and which right against the design.
- Back trophies are about 85% the size of the front one. Front is lowest, back ones sit higher and slightly overlap it.
- Entrance: `y 60 → 0`, `scale 0.92 → 1`, `opacity 0 → 1`. The front trophy uses `EASE.pop` for a slight overshoot.
- **Three nested elements per trophy**, so transforms never fight: outer = entrance, middle = mouse parallax, inner = idle float. `transform-origin: 50% 100%` on all.
- Idle float: `y 0 → -10`, `rotation ±1.5°`, `yoyo`, `repeat: -1`, `EASE.float`. Durations 3.2 / 3.8 / 4.4s with delays 0 / 0.4 / 0.8s so they never sync.
- Parallax (desktop pointer only): trophies move opposite to the cursor, back ones by ±8px, front by ±14px. Use `gsap.quickTo` for smoothness. Disabled on touch.
- Glow: soft gold radial gradient behind the trio, `opacity 0.6 ↔ 1` over 5s.
- Shine: a diagonal light sweep (masked linear-gradient, `mix-blend-mode: overlay`) crossing each trophy once every 6 to 8s, offset per trophy.
- Contact shadow: soft ellipse under each trophy that scales slightly opposite to the float.
- Images: use `srcSet` with the 700 and 1400 WebPs. `fetchpriority='high'`, no lazy-loading in the hero.

### 8.5 Scroll reveals (reusable primitives)

| Component | Behaviour |
| --- | --- |
| `<RevealText>` | SplitText lines in a mask, `yPercent 100 → 0`, stagger `STAGGER.lines`, `once: true`, `start: SCROLL.start`. Used for all headings and paragraphs. |
| `<RevealImage>` | Wrapper `clip-path: inset(10% 0 0 0) → inset(0)` and `opacity 0 → 1` (1.2s), inner image `scale 1.15 → 1` (1.6s). Optional `parallax` prop adds a scrubbed image drift of `yPercent -8 → 8`. |
| `<FadeUp>` | `y DIST.rise → 0`, `opacity 0 → 1`, optional `delay` and `stagger` for child groups. |
| `<Counter>` | Counts from 0 to `value` (respecting `decimals`) over 1.6s with `power2.out`, triggered once at 80% in view. Layout width is fixed so the number never jiggles. |
| `<Magnetic>` | Optional: pill buttons shift up to 8px toward the cursor. Desktop only. |

Section application: showreel heading uses `RevealText` and the video poster uses `RevealImage`. The clients row uses `FadeUp` with stagger `0.05`. Work tiles use `RevealImage` with parallax. The Impact heading and paragraph use `RevealText`, and its stats use `FadeUp` stagger plus `Counter`. The CTA band background drifts slowly (parallax scrub) and its headline uses `RevealText`.

### 8.6 Interactions

- **Work tile hover:** image `scale 1.05` (0.8s `EASE.out`), overlay darkens slightly, the `——` line extends from 24px to 48px.
- **Showreel circle:** follows the pointer inside the poster (lerped, desktop). On hover it scales 1.15 and inverts to a white fill with dark text. Click opens the video modal and calls `lenis.stop()`.
- **Links and buttons:** underline or fill wipes in from the left (0.4s). Focus-visible styles must be clearly visible.
- **Header:** hides on scroll down and shows on scroll up (0.4s `power3.out`).

### 8.7 Smooth scroll

Lenis with `lerp: 0.1`, synced to ScrollTrigger: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`. Stopped during the loader, mobile menu and video modal. On route change call `lenis.scrollTo(0, { immediate: true })` and `ScrollTrigger.refresh()`. Native scroll is kept on touch devices if Lenis causes jank.

### 8.8 Page transitions

Fixed crimson overlay with the logo mark. Cover (0.6s, `expo.inOut`, from bottom) → navigate → wait until `useNavigation().state === 'idle'` (loader data ready) → reset scroll → reveal (0.6s, wipe up). Implemented in `PageTransition` plus a `TransitionLink`. Every component uses `useGSAP` with a `scope` so ScrollTriggers are killed on unmount.

### 8.9 Reduced motion and mobile

- `prefers-reduced-motion: reduce`: no loader animation (instant), no parallax, no idle loops. Elements simply fade in (0.4s).
- Mobile (under 768px): shorter distances (halve `DIST`), no pointer parallax, hero stacks (text, then trophies), trophy idle loop limited to the float only, work grid becomes a single column in the order 0 to 4.

## 9. Assets

| Asset | Status |
| --- | --- |
| `maad-logo-white.svg`, `a-pattern.svg`, `lower-pattern.svg` | supplied |
| Lower background (red) JPG | supplied. Use for the CTA band. Hero background to be confirmed (same family) |
| Trophy WebPs (3 × two sizes) | optimised, ready in `public/trophies/` |
| GOtv, Tusker Lite, Uganda Baati, Pride Bank artwork | supplied. Export WebP at 1600px wide |
| `MAAD_website_artworks-04.jpg` | supplied, usage to confirm (likely the Pride Bank tile) |
| Coca-Cola Digital tile image | **missing** |
| Client logos (7), showreel poster and video | **missing** |
| Loader logo animation source | **pending** (GIF received, see §8.2) |
| Inter 18pt, four weights | supplied and converted: subset woff2 plus fonts.css, open licence, ready to use |
| Haas Grot Disp R (3 weights), Futura BT, Helvetica Neue | supplied but trial or commercial: web licences needed before launch (see §6) |

## 10. Build order and acceptance criteria

1. **Scaffold.** Vite, TypeScript, Tailwind, React Router data router, path alias `@`, tokens, fonts, `RootLayout`.
2. **Content layer.** `types.ts`, `api.ts`, static content, `<Img>`, loaders. A page that renders raw static data through the loader.
3. **Static layout, no motion.** All eight sections, responsive, matching the design at 1440, 1024, 768 and 390px.
4. **Motion foundation.** `gsap-setup`, tokens, Lenis, `LoaderProvider` (placeholder logo) and gating.
5. **Hero.** Timeline, trophies, glow, shine, parallax.
6. **Reveal primitives and section application**, hovers, counters, header behaviour.
7. **Showreel modal and page transition.**
8. **Polish pass.** Reduced motion, mobile, performance, accessibility, cleanup of ScrollTriggers.

**Acceptance criteria**

- Swapping `VITE_CONTENT_SOURCE` requires no component edits (verified by a mock Sanity source returning the same shapes).
- No hard-coded copy, URLs or image paths in components.
- Loader appears once per session, never exceeds 4s, never blocks without cause, and is skippable by reduced-motion.
- Cumulative Layout Shift under 0.05. Lighthouse mobile performance 85 or higher. Animations hold 60fps on a mid-range Android phone in a throttled test.
- Keyboard navigable, visible focus, all images have meaningful `alt` (decorative ones `alt=''`), video modal traps focus and closes on Esc.
- Hero, scroll reveals and page transition use only the shared tokens and primitives.
