export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'expo.inOut',
  SineInOut: 'power2.inOut',
  counterOut: 'power2.out',
  float: 'sine.inOut',
  pop: 'back.out(1.2)',
  loaderLogoOut: 'power2.in',
  ghostOut: 'power4.out',
} as const;

export const DUR = {
  ui: 0.4,
  text: 1.0,
  media: 1.3,
  hero: 1.2,
  heroBg: 1.8,
  heroMotif: 1.6,
  heroGhost: 1.5,
  heroCta: 0.8,
  headerIn: 0.8,
  page: 0.7,
  loaderLogoOut: 0.5,
  loaderWipe: 0.9,
  bloomPath: 1.1,
  bloomSettle: 1.6,
  spotlight: 0.5,
} as const;

export const DIST = {
  rise: 32,
  slide: 60,
  maskFrom: 100, // px or percent as noted at use
  trophyRise: 60,
  floatY: 10,
  parallaxBack: 8,
  parallaxFront: 14,
} as const;

export const STAGGER = {
  lines: 0.1,
  words: 0.04,
  items: 0.08,
  header: 0.05,
  trophies: 0.18,
} as const;

export const SCROLL = {
  start: 'top 85%',
  lerp: 0.1,
} as const;

export const LOADER = {
  minVisibleMs: 1600,
  hardTimeoutMs: 4000,
  heroOverlapSec: 0.35, // hero timeline starts ~0.35s before loader wipe ends (SPEC §8.2)
  storageKey: 'maad:loader-shown',
} as const;

export const HERO_TIMELINE = {
  bgStart: 0.0,
  motifStart: 0.1,
  headlineStart: 0.15,
  ghostStart: 0.2,
  trophiesStart: 0.4,
  subheadingStart: 0.5,
  ctaStart: 0.65,
  headerStart: 0.8,
  idleStart: 1.8,
  trophyFloatDurs: [3.2, 3.8, 4.4] as const,
  trophyFloatDelays: [0, 0.4, 0.8] as const,
  glowDur: 5.0,
  shineRepeatDelays: [6.0, 7.0, 8.0] as const,
} as const;

export const MOTIF_LAB = {
  restOpacity: 0.14,
  bloomPeakOpacity: 0.34,
  bloomDistanceDelayFactor: 1.6,
  bloomSettleDelay: 1.5,
  spotOpacity: 0.24,
  spotRadiusPx: 240,
} as const;

export const REVEAL = {
  imageClipDuration: 1.2,
  imageScaleDuration: 1.6,
  imageScaleFrom: 1.15,
  parallaxPercent: 8,
  ctaParallaxPercent: 6,
  counterDuration: 1.6,
  counterStart: 'top 80%',
  clientsStagger: 0.05,
  workHoverScale: 1.05,
  workHoverDuration: 0.8,
  magneticMaxPx: 8,
} as const;

export const TRANSITION = {
  coverDur: 0.6,
  revealDur: 0.6,
  layerLead: 0.04,
  pageRecedeY: -24,
  pageEnterY: 24,
  pageScale: 0.985,
} as const;
