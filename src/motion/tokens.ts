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
  linear: 'none', // scrubbed / constant-speed tweens
  in: 'power3.in', // exits (dialog close)
  softInOut: 'power3.inOut', // carousel steps, awards loop moves
  quadOut: 'power2.out',
  quadIn: 'power2.in',
  pulse: 'sine.out', // org chart halo glow
  popStrong: 'back.out(1.6)', // service-card circles
  popOrbit: 'back.out(1.7)', // SBCC centre, org chart lead
  popNode: 'back.out(2)', // org chart team nodes
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
  skippedLoaderLead: 0.15, // short lead-in when the loader was already shown this session
  motifFromX: -160, // × distFactor
  motifSlideDur: 2.2,
  motifVLag: 0.15,
  motifDrawDur: 1.8,
  motifFillAt: 1.3, // after motifStart
  motifFloatY: 12,
  motifFloatDurs: [4, 5] as const, // A, V
  headlineFromXPercent: 40, // × distFactor
  trophyFloatY: -6, // × distFactor
  headerFromY: -12,
  trophyFloatDurs: [3.2, 3.8, 4.4] as const,
  trophyFloatDelays: [0, 0.4, 0.8] as const,
  glowDur: 5.0,
  shineRepeatDelays: [6.0, 7.0, 8.0] as const,
} as const;

export const MOTIF_LAB = {
  restOpacity: 0.14,
  bloomPeakOpacity: 0.34,
  bloomScaleFrom: 0.9, // each doodle grows from this scale about its centre as it blooms
  bloomDistanceDelayFactor: 1.6,
  bloomSettleDelay: 1.5,
  spotOpacity: 0.24,
  spotRadiusPx: 240,
} as const;

export const REVEAL = {
  imageClipDuration: 1.2,
  imageScaleDuration: 1.6,
  imageScaleFrom: 1.06,
  parallaxPercent: 3,
  ctaParallaxPercent: 6,
  ctaBgScale: 1.12,
  counterDuration: 1.6,
  counterStart: 'top 80%',
  clientsStagger: 0.05,
  workHoverScale: 1.05,
  workHoverDuration: 0.8,
  magneticMaxPx: 8,
  // "Fall into grid" entry for work tiles
  fallY: 40,
  fallYMobile: 24,
  fallScale: 0.72,
  fallDuration: 1.1,
  fallCaptionDelay: 0.35,
  carouselHold: 3,
  carouselStep: 0.9,
} as const;

export const TRANSITION = {
  // The new page slides up over a still copy of the old one; its hero layers lag and settle last.
  slideDur: 1.1,
  cornerRadiusPx: 24, // the incoming page's top corners while it travels
  oldDrift: 0.12, // × viewport height: the old page drifts up as it is covered
  oldDimClick: 0.15, // immediate feedback while the next route loads
  oldDim: 0.55,
  parallaxLag: 0.35, // × viewport height: [data-page-parallax] layers start this much lower (halved on mobile)
  parallaxExtra: 0.5, // they arrive this much later than the page
  pageEnterY: 24, // back/forward rise-in
  revealDur: 0.6, // back/forward rise-in
  reducedFade: 0.2, // reduced motion: plain crossfade
  releaseMs: 1500, // safety: give scrolling back if a navigation never lands
} as const;

/* ---------- Component choreography (values specific to one component) ---------- */

export const AWARDS_LOOP = {
  moveDuration: 1.2,
  holdDuration: 2,
  backScale: 0.83,
  backBrightness: 0.85,
  hoverPause: 0.4, // timeScale ease to 0 on hover, back to 1 on leave
} as const;

export const SHOWREEL = {
  widenStart: 'top 88%',
  widenEnd: 'top 20%',
} as const;

export const HEADER_MENU = {
  reducedFade: 0.2,
  wipe: 0.45,
  itemsOverlap: '-=0.2',
} as const;

export const SERVICE_CARD = {
  start: 'top 88%',
  itemStart: 'top 92%',
  rise: 56, // × 0.5 on mobile
  clipFrom: 'inset(12% 0% 0% 0% round 16px)',
  clipTo: 'inset(0% 0% 0% 0% round 16px)',
  duration: 1.1,
  itemRise: 26, // × 0.5 on mobile
  itemStagger: 0.07,
  itemDelay: 0.15,
  popScaleFrom: 0.6,
  popDuration: 0.8,
  popStagger: 0.1,
  popDelay: 0.35,
} as const;

export const SBCC_ORBIT = {
  ringDraw: 1.6,
  centerScaleFrom: 0.4,
  centerIn: 0.9,
  centerAt: 0.2,
  iconScaleFrom: 0.3,
  iconsIn: 1.1,
  iconsStagger: 0.07,
  iconsAt: 0.45,
} as const;

export const ORG_CHART = {
  leadScaleFrom: 0.4,
  leadIn: 0.9,
  wiresIn: 1.1,
  wiresStagger: 0.12,
  wiresAt: 0.35,
  nodesIn: 0.6,
  nodesStagger: 0.08,
  nodesAt: 0.75,
  haloPeak: 0.5,
  haloIn: 0.45,
  haloLead: 0.25,
  breatheScale: 1.04,
  breatheDur: 1.8,
} as const;

/** Tile-to-case-study expand (befreaky-style): the tile image grows to the screen, then settles into the hero frame. */
export const SHARED_TRANSITION = {
  expand: 0.9,
  settle: 0.8,
  dimOpacity: 0.35, // the old page behind the growing image
  radiusPx: 12, // tile image corner radius at the start
  fadeOut: 0.4, // overlay fades away when the destination has no target frame
  readyTimeoutMs: 1500, // give up and release scrolling if the route never lands
} as const;

/** Entrance of above-the-fold items on inner pages (starts once the first-visit loader is done). */
export const ENTRANCE = {
  clipFrom: 'inset(100% 0% 0% 0%)', // un-clips from the bottom up, like the content rising
  clipTo: 'inset(0% 0% 0% 0%)',
  lead: 0.05, // short lead-in when the loader was already shown this session
} as const;

export const WORK_HERO = {
  motifOpacity: 0.25, // soft-light strokes: lift the metal's own lighting (dark left stays subtle, lit right glows)
  subDelay: 0.25,
} as const;

export const CASE_STUDY = {
  storyStagger: 0.12, // paragraph rise-in
} as const;

/** Case-study hero video/poster frame. */
export const CASE_MEDIA = {
  enterScale: 1.12, // poster settles from a zoom as the frame un-clips
  enterDelay: 0.15, // after the header's rise starts
  growScale: 1.13, // scroll "lean in": the max-w-7xl frame (1280) grows to the design's ~1448
  growVh: 0.6, // × viewport height of scroll over which it grows
  scrub: 0.6, // scrub smoothing (s)
} as const;

/** Case-study artwork gallery reveal. */
export const GALLERY = {
  scaleFrom: 1.08, // inner artwork settles from a slight zoom as its frame wipes up
  captionDelay: 0.35, // captions rise after their artwork
} as const;

/** Site-wide back-to-top button (layout/BackToTop). Fades/rises in with DUR.ui, EASE.soft, DIST.rise. */
export const BACK_TO_TOP = {
  showAfterVh: 1, // × viewport height scrolled before the button appears
} as const;

export const TEAM_INTRO = {
  delay: 0.2,
} as const;

export const TEAM_GRID = {
  start: 'top 94%',
  reducedStart: 'top 92%',
  reducedStagger: 0.03,
  headingStart: 'top 90%',
  headingFromYPercent: 110,
  rise: 56, // × 0.5 on mobile
  scaleFrom: 0.9,
  origin: '50% 70%',
  mediaScaleFrom: 1.2,
  captionRise: 14,
  batchMax: 6,
  stagger: 0.08,
  duration: 1.15,
  mediaDuration: 1.6,
  captionDuration: 0.7,
  captionStagger: 0.03,
  captionDelay: 0.35,
} as const;

export const BIO_PANEL = {
  hideDrop: 8,
  hide: 0.25,
  enterRise: 14,
  enterScale: 0.98,
  enter: 0.45,
  move: 0.55,
  itemRise: 8,
  items: 0.45,
  itemStagger: 0.035,
  itemDelay: 0.05,
} as const;

export const PROFILE_DIALOG = {
  reducedFade: 0.2,
  closeMobile: 0.45,
  closeDesktop: 0.35,
  closeDrop: 30,
  sheetScale: 0.98,
  overlayOut: 0.35,
  overlayOutAt: 0.05,
  overlayIn: 0.45,
  reducedIn: 0.3,
  enterAt: 0.04,
  enterRise: 28,
  enter: 0.7,
  photoScaleFrom: 1.08,
  photoIn: 1.2,
  itemRise: 16,
  itemIn: 0.7,
  itemStagger: 0.05,
  itemsAt: 0.25,
  pageShift: 48,
  pageIn: 0.6,
  pagePhotoIn: 1,
  snapBack: 0.45,
  overlayBack: 0.3,
  pageSnapBack: 0.4,
} as const;

export const TEAM_HERO = {
  driftYPercent: 8,
} as const;

export const FALL_IN = {
  start: 'top 95%',
  origin: '50% 60%',
  captionRise: 18,
  fadeFactor: 0.45, // × REVEAL.fallDuration
  captionLag: 0.4, // after REVEAL.fallCaptionDelay
  stagger: 0.12,
  durationFactor: 0.7, // × DUR.text
} as const;

/** Our Partners: hero motif and the sector table's row entrance. */
export const PARTNERS = {
  motifOpacity: 0.25, // soft-light strokes over the metal (same treatment as WORK_HERO)
  subDelay: 0.25,
  rowStagger: 0.12, // rows entering together start one after another
  sideAt: 0.1, // label/logo divider draws just after the row's top rule
  labelAt: 0.15,
  logosAt: 0.3,
  logoRise: 16, // px (halved on mobile)
  logoScaleFrom: 0.9,
  logoStagger: 0.04, // tighter than STAGGER.items: a busy row lands in under a second
} as const;

/** Blog index hero (ui/MotifHero) and card grid. */
export const BLOG = {
  motifOpacity: 0.25, // soft-light strokes over the metal (same treatment as WORK_HERO)
  subDelay: 0.25,
  cardStart: 'top 92%',
  cardClipFrom: 'inset(10% 0% 0% 0%)', // cards un-clip upward as they rise
  cardDuration: 1.1,
  cardStagger: 0.12, // cards entering together, left to right
  imageZoomFrom: 1.12, // photo settles from a slight zoom
  textRise: 18, // px (date/category line + title; ~half on mobile)
  textRiseMobile: 10,
  textAt: 0.35,
  textStagger: 0.08,
} as const;

/** Blog article: title words, hero wipe, photo row, logo lockup, paragraphs. */
export const BLOG_ARTICLE = {
  wordsAt: 0.1,
  heroAt: 0.3, // hero frame wipes open just after the title starts rising
  heroWipe: 0.75, // × DUR.heroBg
  photoWipe: 0.7, // × DUR.heroBg
  photoDelay: 0.15,
  photoStagger: 0.12,
  imageZoomFrom: 1.12,
  popFrom: 0.85, // logo lockup scale-in
  popDuration: 0.9,
  revealRise: 26, // px paragraph rise (halved on mobile)
  revealStagger: 0.07,
  revealDelay: 0.1,
  start: 'top 92%',
  photoStart: 'top 92%',
  popStart: 'top 90%',
} as const;

/** Contact Us: hero motif, services ticker, Get In Touch + form entrance, map reveal. */
export const CONTACT = {
  motifOpacity: 0.14, // paper strokes on ink: the design's #292929 lines on near-black (= MOTIF_LAB.restOpacity)
  subDelay: 0.25,
  tickerPxPerSec: 70, // services ticker speed (constant, linear)
  tickerHoverScale: 0.25, // ticker slows to this timeScale under a fine pointer
  tickerActiveStart: 'top bottom', // the ticker only runs while on screen
  tickerActiveEnd: 'bottom top',
  ruleFrom: 0, // KEEP CLOSE rule draws from scaleX 0
  ruleDur: 0.9,
  titleAt: 0.15, // title lines rise after the rule starts
  bodyAt: 0.3,
  detailsStart: 'top 90%',
  iconScaleFrom: 0.6, // detail circles pop in
  detailStagger: 0.1,
  fieldRise: 24, // px (halved on mobile)
  fieldStagger: 0.07,
  mapClipFrom: 'inset(10% 6% 10% 6% round 12px)', // map frame opens out from the centre
  mapClipTo: 'inset(0% 0% 0% 0% round 12px)',
  mapScaleFrom: 1.08, // the map settles from a slight zoom as its frame opens
} as const;
