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
    /** White line-art on black: blended over the crimson hero. */
    motif: ImageAsset;
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

export type GalleryItem = { image: ImageAsset; caption?: string };

/** Items on one row share a height (widths follow their aspect ratios). */
export type GalleryRow = GalleryItem[];

export type GalleryBlock =
  | { layout: 'rows'; rows: GalleryRow[] }
  /** One tall item beside a stack of rows, e.g. Take Pride's "Women Improvement Loan". */
  | { layout: 'beside'; tallSide: 'left' | 'right'; tall: GalleryItem; rows: GalleryRow[] };

export type CaseStudyPage = {
  slug: string;
  seo: PageSeo;
  clientLabel: string;      // 'CLIENT:'
  client: string;
  title: string;
  media: CaseMedia;
  headline: string;
  story: { label?: string; body: string }[];
  gallery: GalleryBlock[];
};
