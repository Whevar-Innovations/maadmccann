import type { HomePage, SiteSettings, TeamPage, WhatWeDoPage } from '../types';
import { home } from '../static/home';
import { settings } from '../static/settings';
import { team } from '../static/team';
import { whatWeDo } from '../static/whatWeDo';
import { mapAward } from '../sanity/mappers';
import { mockAwards } from './data/awards';
import { mockImageUrl } from './imageUrl';

/**
 * Mock async CMS source to verify that swapping VITE_CONTENT_SOURCE requires
 * zero component edits (SPEC §10 Acceptance Criterion 1). Awards come back as
 * Sanity-shaped documents and go through the same mapper the real source will use.
 */
export async function getHomePage(): Promise<HomePage> {
  await Promise.resolve();
  const page = structuredClone(home);
  page.hero.awards = mockAwards.map((award) => mapAward(award, mockImageUrl));
  return page;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await Promise.resolve();
  return structuredClone(settings);
}

export async function getWhatWeDoPage(): Promise<WhatWeDoPage> {
  await Promise.resolve();
  return structuredClone(whatWeDo);
}

export async function getTeamPage(): Promise<TeamPage> {
  await Promise.resolve();
  return structuredClone(team);
}
