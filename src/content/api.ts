import type {
  CaseStudyPage,
  HomePage,
  PartnersPage,
  SiteSettings,
  TeamPage,
  WhatWeDoPage,
  WorkPage,
} from './types';

const source = import.meta.env.VITE_CONTENT_SOURCE ?? 'static';

function assertHomePage(data: HomePage): HomePage {
  if (data.hero.awards.length < 3) {
    throw new Error(`Expected at least 3 hero awards, received ${data.hero.awards.length}`);
  }
  if (data.featuredProjects.length !== 5) {
    throw new Error(
      `Expected exactly 5 featured projects, received ${data.featuredProjects.length}`,
    );
  }
  if (data.impact.stats.length !== 4) {
    throw new Error(`Expected exactly 4 impact stats, received ${data.impact.stats.length}`);
  }
  return data;
}

export async function getHomePage(): Promise<HomePage> {
  if (source === 'mock') {
    return assertHomePage(await (await import('./mock/source')).getHomePage());
  }
  return assertHomePage((await import('./static/home')).home);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (source === 'mock') {
    return (await import('./mock/source')).getSiteSettings();
  }
  return (await import('./static/settings')).settings;
}

const WHAT_WE_DO_SECTIONS = [
  'sbcc',
  'digital',
  'accountManagement',
  'media',
  'experiential',
  'brandStrategy',
  'pr',
  'creative',
  'production',
] as const satisfies readonly (keyof WhatWeDoPage)[];

function assertWhatWeDoPage(data: WhatWeDoPage): WhatWeDoPage {
  for (const key of WHAT_WE_DO_SECTIONS) {
    if (!data[key]?.id) throw new Error(`What We Do section "${key}" is missing or has no id`);
  }
  return data;
}

export async function getWhatWeDoPage(): Promise<WhatWeDoPage> {
  if (source === 'mock') {
    return assertWhatWeDoPage(await (await import('./mock/source')).getWhatWeDoPage());
  }
  return assertWhatWeDoPage((await import('./static/whatWeDo')).whatWeDo);
}

function assertTeamPage(data: TeamPage): TeamPage {
  for (const row of data.rows) {
    for (const section of Array.isArray(row) ? row : [row]) {
      if (section.members.length === 0) throw new Error(`Team section "${section.id}" has no members`);
    }
  }
  return data;
}

export async function getTeamPage(): Promise<TeamPage> {
  if (source === 'mock') {
    return assertTeamPage(await (await import('./mock/source')).getTeamPage());
  }
  return assertTeamPage((await import('./static/team')).team);
}

function assertWorkPage(data: WorkPage): WorkPage {
  if (data.pageSize < 1) throw new Error(`Work pageSize must be at least 1, received ${data.pageSize}`);
  const categoryIds = new Set(data.categories.map((c) => c.id));
  const slugs = new Set<string>();
  for (const project of data.projects) {
    if (slugs.has(project.slug)) throw new Error(`Duplicate work project slug "${project.slug}"`);
    slugs.add(project.slug);
    for (const id of project.categoryIds) {
      if (!categoryIds.has(id)) {
        throw new Error(`Work project "${project.slug}" uses unknown category "${id}"`);
      }
    }
  }
  return data;
}

export async function getWorkPage(): Promise<WorkPage> {
  if (source === 'mock') {
    return assertWorkPage(await (await import('./mock/source')).getWorkPage());
  }
  return assertWorkPage((await import('./static/work')).work);
}

function assertCaseStudy(data: CaseStudyPage): CaseStudyPage {
  if (data.story.length === 0) throw new Error(`Case study "${data.slug}" has no story`);
  if (data.gallery.length === 0) throw new Error(`Case study "${data.slug}" has no gallery`);
  data.gallery.forEach((art, i) => {
    const where = `Case study "${data.slug}" gallery item ${i + 1}`;
    if (art.image.width <= 0 || art.image.height <= 0) throw new Error(`${where} needs image width and height`);
    if (art.side && art.size !== 'feature') throw new Error(`${where}: "side" only applies to a feature`);
    if (art.size === 'feature') {
      const next = data.gallery[i + 1];
      if (!next || next.size === 'full' || next.size === 'feature') {
        throw new Error(`${where}: a feature needs an artwork after it to sit beside`);
      }
    }
  });
  return data;
}

/** Resolves to undefined for an unknown slug, so the route can answer 404. */
export async function getCaseStudy(slug: string): Promise<CaseStudyPage | undefined> {
  const found =
    source === 'mock'
      ? await (await import('./mock/source')).getCaseStudy(slug)
      : (await import('./static/work')).caseStudies.find((c) => c.slug === slug);
  return found ? assertCaseStudy(found) : undefined;
}

function assertPartnersPage(data: PartnersPage): PartnersPage {
  if (data.sectors.length === 0) throw new Error('Partners page has no sectors');
  const sectorIds = new Set<string>();
  const logoIds = new Set<string>();
  for (const sector of data.sectors) {
    if (sectorIds.has(sector.id)) throw new Error(`Duplicate partner sector id "${sector.id}"`);
    sectorIds.add(sector.id);
    if (sector.logos.length === 0) throw new Error(`Partner sector "${sector.id}" has no logos`);
    for (const logo of sector.logos) {
      if (logoIds.has(logo.id)) throw new Error(`Duplicate partner logo id "${logo.id}"`);
      logoIds.add(logo.id);
      if (logo.image.width <= 0 || logo.image.height <= 0) {
        throw new Error(`Partner logo "${logo.id}" needs image width and height`);
      }
      // Case-study links are internal routes (ui/Link runs the page transition).
      if (logo.href !== undefined && !/^\/(?!\/)/.test(logo.href)) {
        throw new Error(`Partner logo "${logo.id}" href must be an internal path, received "${logo.href}"`);
      }
    }
  }
  return data;
}

export async function getPartnersPage(): Promise<PartnersPage> {
  if (source === 'mock') {
    return assertPartnersPage(await (await import('./mock/source')).getPartnersPage());
  }
  return assertPartnersPage((await import('./static/partners')).partners);
}
