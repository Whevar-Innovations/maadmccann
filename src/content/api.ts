import type { HomePage, SiteSettings, TeamPage, WhatWeDoPage } from './types';

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
