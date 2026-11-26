export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  lqip?: string;     // base64 blur placeholder (Sanity metadata.lqip later)
  srcSet?: string;   // optional responsive set
};

export type Link = { label: string; href: string; external?: boolean };

export type Award = { id: string; title: string; year: number; image: ImageAsset };

export type Project = {
  id: string;
  slug: string;
  client: string;
  title: string;     // rendered as `${client}: ${title}`
  image: ImageAsset;
  /** Optional CSS object-position so logos stay inside the cropped tile (default: center). */
  focus?: string;
  href: string;      // /work/{slug}
};

export type Stat = {
  value: number;
  decimals?: number;
  suffix: string;    // 9.5 + 'M+'
  label: string;
  description: string;
};

export type ClientLogo = { id: string; name: string; image: ImageAsset };

export type HomePage = {
  hero: {
    headlineLines: string[];     // one string per visual line (drives line masks)
    subheading: string;
    cta: Link;
    ghostText: string;           // 'TRUTH WELL TOLD'
    awards: Award[];             // 3+; first 3 = [back-left, back-right, front], extras = rotation pool
  };
  showreel: { heading: string; subheading: string; poster: ImageAsset; videoUrl: string };
  clients: { heading: string; logos: ClientLogo[] };
  featuredProjects: Project[];   // exactly 5
  impact: { heading: string; body: string; stats: Stat[] }; // 4 stats
};

/** Site-wide CTA band ("Got something in mind?") rendered above the footer on every page. */
export type CtaContent = { headlineLines: string[]; body: string; button: Link };

export type SiteSettings = {
  nav: Link[];
  navCta: Link;
  cta: CtaContent;
  footer: {
    navigation: Link[];
    services: Link[];
    contact: { email: string; phone: string; landline: string; address: string[] };
    socials: { platform: 'x' | 'facebook' | 'youtube' | 'linkedin' | 'instagram'; url: string }[];
    /** `{year}` is replaced with the current year when rendered, e.g. '©{year} MAAD McCANN.' */
    copyright: string;
  };
};

export type SocialPlatform = SiteSettings['footer']['socials'][number]['platform'];

/* ---------- Page SEO (per-route title + description) ---------- */

export type PageSeo = { title: string; description: string };

/* ---------- What We Do (/what-we-do) ---------- */

/** Every service section carries `id`, its deep-link anchor (footer SERVICES column links to it). */
type ServiceSection = { id: string };

export type CreativeIcon = 'ideation' | 'concept' | 'graphic-design' | 'animation';

export type WhatWeDoPage = {
  seo: PageSeo;
  hero: { headlineLines: string[]; bodyLines: string[] };
  sbcc: ServiceSection & {
    title: string;
    tagline: string;
    body: string;
    bullets: string[];
    approaches: { title: string; body: string };
    humanCentered: { title: string; body: string };
    strength: { title: string; paragraphs: string[] };
    experience: { title: string; body: string };
  };
  digital: ServiceSection & {
    title: string;
    tagline: string;
    intro: string;
    /** Each pill is rendered one word per line. */
    pills: string[][];
    leftParagraphs: string[];
    rightParagraphs: string[];
  };
  accountManagement: ServiceSection & { title: string; taglineLines: string[]; body: string };
  media: ServiceSection & { title: string; taglineLines: string[]; body: string; servicesLines: string[] };
  experiential: ServiceSection & { titleLines: string[]; taglineLines: string[]; body: string };
  brandStrategy: ServiceSection & { titleLines: string[]; tagline: string; body: string };
  pr: ServiceSection & { titleLines: string[]; taglineLines: string[]; body: string; bullets: string[] };
  creative: ServiceSection & {
    title: string;
    tagline: string;
    body: string;
    tiles: { icon: CreativeIcon; labelLines: string[] }[];
  };
  production: ServiceSection & {
    title: string;
    tagline: string;
    body: string;
    /** One circle per entry, one line per string. */
    circles: string[][];
  };
};

/* ---------- The MAAD Ones (/the-maad-ones) ---------- */

export type TeamBio = {
  paragraphs: string[];
  brands?: string;
  projects?: string;
};

export type TeamPerson = {
  name: string;
  /** People without a bio (some board members) render with no "See profile" affordance. */
  bio?: TeamBio;
};

export type TeamMember = TeamPerson & {
  slug: string;
  /** Card title. Can differ per section (e.g. Mike is "Director" on the board). */
  title: string;
  image: ImageAsset;
};

export type TeamSection = {
  id: string;
  title: string;
  /** Cards per row on desktop. */
  columns: number;
  members: TeamMember[];
};

/** A row is one full-width section, or a pair rendered side by side on wide screens. */
export type TeamRow = TeamSection | [TeamSection, TeamSection];

export type TeamPage = {
  seo: PageSeo;
  /** Full team photo at the top of the page. */
  hero: ImageAsset;
  intro: { accent: string; headline: string; body: string };
  rows: TeamRow[];
};

/* ---------- Our Work (/work) and case studies (/work/:slug) ---------- */

export type WorkCategory = { id: string; label: string };

/** A project tile in the Our Work grid. `hasCaseStudy: false` tiles render without a link. */
export type WorkProject = Project & {
  categoryIds: string[];
  hasCaseStudy: boolean;
};

export type WorkPage = {
  seo: PageSeo;
  hero: {
    headlineLines: string[];
    subheading: string;
  };
  filterLabel: string;      // accessible name of the pill group
  allLabel: string;         // 'ALL WORK'
  categories: WorkCategory[];
  pageSize: number;
  projects: WorkProject[];
  /** Interface copy. `{from}`, `{to}`, `{total}`, `{page}` and `{n}` are filled in by the grid. */
  labels: {
    summary: string;        // 'Showing {from}–{to} of {total} projects'
    empty: string;          // shown when a sector has no projects
    paginationLabel: string;
    previous: string;
    next: string;
    pageOf: string;         // 'Page {page} of {total}' (compact mobile paginator)
    goToPage: string;       // 'Go to page {n}'
    announce: string;       // live region: 'Page {page} of {total}, {count} projects'
  };
};

/** Case-study header media: a Mux video (poster as the still) or a plain hero image. */
export type CaseMedia =
  | { kind: 'video'; videoUrl: string; poster: ImageAsset }
  | { kind: 'image'; image: ImageAsset };

/**
 * One artwork in a case-study gallery. Editors list artworks in reading order; code packs them
 * into equal-height rows by aspect ratio (components/work/galleryLayout.ts). The hints are optional
 * art direction:
 * - `auto` (default): packed with its neighbours, up to three per row.
 * - `full`: a full-width row of its own.
 * - `small`: prefers sharing a row (counts as half its width when packing), e.g. a 2-up pair.
 * - `feature`: a tall piece placed beside a stack of the items that follow it (`side`, default right).
 * - `newRow`: start a new row at this item.
 */
export type GalleryItem = {
  image: ImageAsset;
  caption?: string;
  size?: 'auto' | 'full' | 'small' | 'feature';
  /** `feature` only. */
  side?: 'left' | 'right';
  newRow?: boolean;
};

export type CaseStudyPage = {
  slug: string;
  seo: PageSeo;
  clientLabel: string;      // 'CLIENT:'
  client: string;
  title: string;
  media: CaseMedia;
  headline: string;
  story: { label?: string; body: string }[];
  /** Flat, in reading order: the layout is computed from aspect ratios + hints. */
  gallery: GalleryItem[];
};

// ---------- Our Partners (/partners) ----------

/** A client logo on the Our Partners page; `href` links it to a case study when one exists. */
export type PartnerLogo = ClientLogo & { href?: string };

/**
 * One sector row: the label cell and its logos, in display order. `id` is the `?sector=` value;
 * `filterLabel` is an optional shorter name for the filter pill (e.g. "SBCC").
 */
export type PartnerSector = { id: string; label: string; filterLabel?: string; logos: PartnerLogo[] };

export type PartnersPage = {
  seo: PageSeo;
  hero: {
    headlineLines: string[];
    subheading: string;
  };
  intro: string;
  /** Accessible name of the sector filter, and the "show everything" pill. */
  filterLabel: string;
  allLabel: string;
  sectors: PartnerSector[];
  labels: {
    announce: string;       // live region: 'Showing {count} partners in {sector}'
    announceOne: string;    // live region, one logo: 'Showing 1 partner in {sector}'
    announceAll: string;    // live region, no filter: 'Showing all {count} partners'
    viewCaseStudy: string;  // hover hint under a linked logo
  };
};

// ---------- Corporate Social Responsibility (/csr) ----------

export type CsrServiceIcon =
  | 'campaign-strategy'
  | 'experiential-marketing'
  | 'media-pr'
  | 'digital-content'
  | 'branding-identity'
  | 'event-experience'
  | 'community-engagement'
  | 'digital-storytelling';

export type CsrService = { icon: CsrServiceIcon; title: string; body: string };

/** A campaign panel (poster + copy) and the "What we do for …" icon grid under it. */
type CsrCampaign = {
  /** Section anchor, also the prefix for the panel's heading id. */
  id: string;
  logoAlt: string;
  paragraphs: string[];
  poster: ImageAsset;
  servicesTitle: string;
  services: CsrService[];
};

export type CsrPage = {
  seo: PageSeo;
  hero: { eyebrow: string; headlineLines: string[]; bodyLines: string[] };
  intro: {
    eyebrow: string;
    headlineLines: string[];
    body: string;
    /** Right column. `**text**` is rendered bold. */
    paragraphs: string[];
  };
  cancerRun: CsrCampaign & { title: string; tagline: string };
  runForTheNile: CsrCampaign & { headlineLines: string[] };
  ironSharpensIron: {
    id: string;
    logoAlt: string;
    titleLines: string[];
    subtitle: string;
    body: string;
    paragraphs: string[];
    posters: ImageAsset[];
  };
};

// ---------- Blog (/blog, /blog/:slug) ----------

/** Logo lockup between an article's hero and its copy. */
export type BlogLockup = 'iron-sharpens-iron' | 'run-for-the-nile' | 'rotary-cancer-run';

export type BlogPost = {
  slug: string;
  /** ISO date for <time>. */
  date: string;
  /** As printed on the card, e.g. "June 24, 2026". */
  dateLabel: string;
  category: string;
  /** Red part of the title on the article page; the card prints lead + rest as one title. */
  titleLead: string;
  titleRest: string;
  card: ImageAsset;
  hero: ImageAsset;
  /** CSS object-position of the hero on wide (cropped) frames. */
  heroPosition: string;
  /** Desktop hero frame aspect ratio from the design, as CSS ("1582 / 647"). */
  heroRatio: string;
  lockup?: BlogLockup;
  /** Photo row under the hero. */
  gallery?: ImageAsset[];
  paragraphs: string[];
  seo: PageSeo;
};

export type BlogPage = {
  seo: PageSeo;
  /** Share image for /blog (site-relative path). */
  ogImage: string;
  hero: { headlineLines: string[]; subheading: string };
  /** Accessible name of the card grid. */
  postsLabel: string;
  posts: BlogPost[];
  /** Shown at /blog/:slug when no article has that slug. */
  notFound: { title: string; body: string; backLabel: string };
};
