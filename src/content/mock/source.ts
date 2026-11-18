import type { HomePage, SiteSettings } from '../types';
import { home } from '../static/home';
import { settings } from '../static/settings';

/**
 * Mock async CMS source to verify that swapping VITE_CONTENT_SOURCE requires
 * zero component edits (SPEC §10 Acceptance Criterion 1).
 */
export async function getHomePage(): Promise<HomePage> {
  await Promise.resolve();
  return structuredClone(home);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await Promise.resolve();
  return structuredClone(settings);
}
