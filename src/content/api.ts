import type { HomePage, SiteSettings } from './types';

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
