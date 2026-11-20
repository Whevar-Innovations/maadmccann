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
  cta: { headlineLines: string[]; body: string; button: Link };
};

export type SiteSettings = {
  nav: Link[];
  navCta: Link;
  footer: {
    navigation: Link[];
    services: Link[];
    contact: { email: string; phone: string; landline: string; address: string[] };
    socials: { platform: 'x' | 'facebook' | 'youtube' | 'linkedin' | 'instagram'; url: string }[];
    copyright: string;
  };
};

export type SocialPlatform = SiteSettings['footer']['socials'][number]['platform'];
