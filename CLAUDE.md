# CLAUDE.md: MAAD McCANN Kampala website

Marketing site for MAAD McCANN Kampala, a 360° creative agency ("Truth Well Told").
It is a React 19 + TypeScript SPA built with Vite, Tailwind v4, React Router v7 (data router),
GSAP and Lenis, and deployed on Vercel. `README.md` is the human overview. `docs/spec.md` is
the source of truth for content architecture (§5), tokens (§6), sections (§7), motion (§8)
and acceptance criteria (§10). Read the relevant spec section before building or changing a section.

## Commands

```bash
npm run dev          # http://localhost:5173, static content source
npm run dev:mock     # VITE_CONTENT_SOURCE=mock (Sanity-shaped mock CMS)
npm run check:rules  # project rule guard (scripts/check-rules.mjs), see below
npm run typecheck    # tsc -b: must pass before you call work done
npm run build        # check:rules && tsc -b && vite build
VITE_CONTENT_SOURCE=mock npm run build   # proves components don't depend on the content source
```

There is no linter or test runner. `check:rules` + `typecheck` + `build` is the gate. For visual or
motion changes, also check the page in the browser at 1440, 1024, 768 and 390px, with reduced
motion both on and off.

**`npm run check:rules` fails the build** on:

| Rule | Fails when | Fix |
| --- | --- | --- |
| `static-import` | a file outside `src/content/` imports `content/static` | add a fetcher in `api.ts`, load it in the route loader, pass props |
| `raw-colour` | a hex / `rgb()` / `hsl()` literal outside `src/content/` and `src/styles/` | add a token to `@theme` in `globals.css`, use its utility (`bg-x`, `fill-x`) or `var(--color-x)` |
| `string-ease` | `ease: '…'` outside `src/motion/tokens.ts` | use or add an `EASE.*` token |
| `route-registry` | a `path` in `router.tsx` is missing from `ENABLED_ROUTES` or `SITEMAP_ROUTES` | add it to both |

Never weaken the guard to get a build through. Fix the code, or ask.

## Map

| Path | What lives there |
| --- | --- |
| `src/router.tsx` | All routes. Each route exports `xxxLoader` and `XxxRoute` from `src/routes/`. |
| `src/components/layout/` | `RootLayout` (shell, loader, transitions), `Header`, `Footer`, `FooterMotifStage` (CtaBand + Footer share one stage) |
| `src/components/<page>/` | Page sections: `home/`, `what-we-do/`, `team/` |
| `src/components/ui/` | Primitives: `Link`, `Button`, `Img`, `PlayButton` |
| `src/motion/` | `tokens.ts`, `gsap-setup.ts`, `SmoothScroll`, `LoaderProvider`, `PageTransition`, reveal primitives (`RevealText`, `RevealImage`, `FadeUp`, `Counter`, `Magnetic`, `LogoCarousel`, `useFallIn`, `useHeroEntrance`, `useMotifBloom`), page-transition helpers (`pageSnapshot`, `sharedTransition`) |
| `src/content/` | `types.ts` (CMS contract), `api.ts` (async fetchers), `static/` (content), `mock/` + `sanity/` (CMS adapter + mappers) |
| `src/styles/globals.css` | Tailwind `@theme` with every colour, font, breakpoint and type size |
| `src/lib/useSeo.ts`, `src/lib/site.ts` | Per-route title, description, canonical and OG tags. `site.ts` holds site-wide SEO defaults (build config, not CMS content). |
| `scripts/check-rules.mjs` | The rule guard run by `npm run build` |
| `public/` | Fonts, trophies, team photos, favicons, `og-image.jpg` |
| `MAAD WEBSITE FILES/` | The agency's design packages (`.ai`, PDFs, motifs, photography), one folder per page. Read-only source material. |
| `design/` | `homepage.pdf` + screenshots |

## Grounding rules

### Content and data
1. **Components are dumb.** They take props and never import `content/static` (enforced by
   `check:rules`). Content goes `api.ts` → route loader → `useLoaderData` → props. Every page
   follows this, so copy `routes/what-we-do.tsx` or `routes/the-maad-ones.tsx`.
2. **Everything is async.** Every page has a `getXxx()` in `src/content/api.ts` (`getHomePage`,
   `getSiteSettings`, `getWhatWeDoPage`, `getTeamPage`) with a matching export in
   `mock/source.ts`. The Sanity swap is then a change to `api.ts` alone. Each fetcher runs an
   `assertXxx()` that fails loudly on structural problems (a missing section, an empty list).
3. **`types.ts` is the contract.** Each type maps 1:1 to a future Sanity document or object.
   All content types live there, never in `static/*.ts`. Static files are typed with them
   (`export const whatWeDo: WhatWeDoPage = …`), so a shape change breaks the build, not the page.
4. **No hard-coded copy, hrefs or image paths in components.** Editors own copy, images, links
   and order. Code owns layout, motion and timings. Deep-link anchors are content too: service
   sections carry their own `id`.
5. **Site-wide content lives in `SiteSettings`** (nav, footer, and `cta`, the "Got something in
   mind?" band). `RootLayout` renders it from the root loader, so a new page gets the CTA band
   and footer for free. Don't fetch another page's data to borrow its copy.

### Routing and links
6. **New routes need three edits:** `router.tsx`, `ENABLED_ROUTES` in `src/components/ui/Link.tsx`
   (any other internal link renders `aria-disabled`), and `SITEMAP_ROUTES` in `vite.config.ts`.
   `check:rules` fails if one is missing. Call `useSeo({ ...page.seo, path })` in the route
   component. Placeholder pages get `noindex`.
7. **Always use `ui/Link` or `ui/Button`** for internal navigation, never a bare `<a>` or
   `RouterLink`. Those components run the page transition (`motion/PageTransition.tsx`).
8. Navigation labels, hrefs and footer columns live in `content/static/settings.ts`. The
   planned pages are `/work`, `/csr`, `/partners`, `/blog`, `/awards` and Talk To Us (`#footer`).

### Styling
9. **Use theme tokens only.** The stock Tailwind palette, fonts and breakpoints are deliberately
   reset (`--color-*: initial`), so `bg-red-500` won't exist. Brand: `crimson-*`, `impact-red`,
   `ink`, `charcoal`, `paper`, `cream`, `maroon-*`. Page-specific ones: `service-red`, `graphite`,
   `wwd-ink`, `ash`, `line`, `slate`, `placeholder`, `mist`, `menu-ink`, `blush`, `berry`,
   `ink-soft`. Shadows: `shadow-pill|play|panel`, `drop-shadow-trophy`. CSS easings: `ease-brand`,
   `ease-expo`. **Need a new colour, shadow or easing? Add the token to `@theme` first**, with a
   comment naming where it's used, then use the utility. In SVG, use `fill-x`/`stroke-x` classes.
   In JS strings (GSAP, third-party props), use `var(--color-x)`. Multi-stop gradients become an
   `@utility` in `globals.css` (see `bg-wwd-glow`). Raw colour literals fail `check:rules`. The
   one exception is the keyword `black` in alpha masks, where only alpha matters.
10. Type sizes come from the named scale (`text-hero`, `text-cta`, `text-body`, `text-small`, and
    the rest). Their values follow the spec's fluid rule `clamp(0.8×, size/19.2 vw, 1.15×)` measured
    off the 1920-wide designs. Follow the same rule for any new size.
11. Page width uses `container-site` (max 1440, gutter `clamp(20px, 5vw, 72px)`). Breakpoints
    are `sm` 640, `md` 768, `lg` 1024 and `xl` 1440.
12. Fonts: `font-display` is Haas Grot Disp (trial, falling back to Inter until licensed).
    `font-body` is Inter. `font-accent` is Futura, and only for the "VIEW OUR WORK" style link.
    Never commit Haas trial files, Futura BT or Helvetica Neue to `public/`.

### Motion
13. **No magic numbers.** Durations, eases, distances, staggers and ScrollTrigger starts come from
    `src/motion/tokens.ts`. Shared values live in `DUR`, `EASE`, `DIST`, `STAGGER`, `SCROLL`,
    `REVEAL` and `HERO_TIMELINE`. Choreography specific to one component gets its own named group
    (`SERVICE_CARD`, `TEAM_GRID`, `PROFILE_DIALOG`, `ORG_CHART`, `SBCC_ORBIT`, `BIO_PANEL`, …).
    **Add the token first, then use it.** Reuse an existing token when the value and meaning
    match. String eases (`ease: 'power3.out'`) fail `check:rules`, so use `EASE.*`. Numeric
    literals aren't machine-checked, so review for them.
14. **Import GSAP from `@/motion/gsap-setup`**, never from `gsap` directly. Plugins are registered there.
15. **Every animation lives in `useGSAP(..., { scope })`** so ScrollTriggers die on unmount.
    Return a cleanup for anything created outside the context (`ScrollTrigger.batch`, listeners).
16. **Branch with `gsap.matchMedia()`** using `MEDIA_QUERIES`:
    - `reducedMotion`: a plain opacity fade (`DUR.ui`). No parallax, idle loops or transforms.
    - `motionOk` + `mobile` (<768px): halve the `DIST` values and turn off pointer effects.
    - `finePointer` gates magnetic, cursor-follow and hover-only effects.
17. Animate only `transform`, `opacity` and `clip-path`. Never animate layout properties.
18. Reach for the existing primitives (`RevealText`, `RevealImage`, `FadeUp`, `Counter`,
    `Magnetic`, `useFallIn`, `useHeroEntrance` for above-the-fold items that must wait for the loader,
    `useMotifBloom` for motif heroes) before writing a bespoke timeline.
    Mark a hero's motif, photo or trophy layer with `data-page-parallax` so it lags the page
    transition and settles last. Put it on an element whose own tweens never touch `y` (the SVG
    or a wrapper), because the transition owns that element's `y`.
19. Lenis owns scrolling. Stop it for overlays (menu, modal, dialog) and resume it on close.
    Anything `position: fixed` (header, drawers, dialogs) must sit outside transformed wrappers,
    so portal it to `document.body` as `Header` and `ProfileDialog` do.

### Images and assets
20. **All raster images go through `<Img>`** with an `ImageAsset` (src, alt, width, height,
    optional srcSet/lqip). This keeps CLS at zero and makes Sanity's URL builder a drop-in. Use
    `priority` only for above-the-fold heroes. Decorative images get `decorative` (`alt=""`).
21. Ship WebP with a srcset (e.g. `name-700.webp` / `name-1400.webp`, numbered by pixel size).
    Optimise exports from `MAAD WEBSITE FILES/` into `src/assets/img/` or `public/`. Never link to
    the design-package files directly, and never modify that folder.
22. SVG marks and motifs go in `src/assets/svg/`. Long motif path data lives in a sibling
    `*MotifPaths.ts` file (see `footerMotifPaths.ts`, `headerMotifPaths.ts`).

### Accessibility and quality
23. Keep everything keyboard reachable with a visible `:focus-visible` style. Dialogs and modals
    trap focus, close on Esc and restore focus. Sections use `aria-labelledby` on their heading.
24. Targets: LCP < 2.0s, CLS < 0.05, Lighthouse mobile ≥ 85, 60fps on a mid-range Android.
25. TypeScript is strict with `noUncheckedIndexedAccess`, so handle `undefined` from index access
    instead of using `!`. Use the `@/` path alias for cross-folder imports.

## Adding a page (checklist)

Follow this order. `routes/the-maad-ones.tsx` is the reference implementation.

1. **Type:** add `XxxPage` to `src/content/types.ts` (include `seo: PageSeo`).
2. **Content:** add `src/content/static/xxx.ts`, exporting `xxx: XxxPage`.
3. **Fetcher:** add `getXxxPage()` + `assertXxxPage()` to `src/content/api.ts`, and a
   `structuredClone` version to `src/content/mock/source.ts`.
4. **Route:** add `src/routes/xxx.tsx` with `xxxLoader = async () => ({ page: await getXxxPage() })`
   and a component that reads `useLoaderData`, calls `useSeo({ ...page.seo, path })`, and passes
   slices of `page` to section components.
5. **Sections:** add `src/components/xxx/*`. They take typed props (`XxxPage['hero']`) and import
   only types from `@/content/types`. Use `<Img>`, `ui/Link`, the motion primitives, and theme
   and motion tokens. Pick up the page's motif from `MAAD WEBSITE FILES/` and tag the hero's
   motif layer `data-page-parallax` (rule 18).
6. **Register:** `router.tsx` + `ENABLED_ROUTES` (`ui/Link.tsx`) + `SITEMAP_ROUTES` (`vite.config.ts`).
7. **Verify:** `npm run build` (runs `check:rules`), `VITE_CONTENT_SOURCE=mock npm run build`, then
   check it in the browser at four widths with reduced motion on and off.
8. **Docs:** update the README structure tree and the `docs/spec.md` §5.2/§5.3 lists.

## Design direction

**The feel:** a confident, award-winning African agency. Editorial, cinematic and tactile, never
template-y. The work and the trophies are the heroes. The UI frames them and stays out of the way.

**Colour story.** The brand runs on **deep crimson-to-maroon metallic red** (hero, CTA band,
footer stage), set against **ink/near-black** (showreel, mobile menu,
dark service cards) and **paper white** (clients, impact, team). Sections alternate between these
three worlds to set the rhythm. Crimson sections hold white type and white pill buttons. Paper
sections use ink type, with `impact-red` for display accents. Keep it to these: no blues, greens
or gradients that aren't the red metallic family. Gold shows up only as trophy glow.

**Typography.** Display type is big, bold, **uppercase**, tightly tracked (−0.02em) and set
tight (0.95 leading): `TRUTH WELL TOLD`, `OUR IMPACT`, section titles. Oversized "ghost" type
can bleed off the section edge. Body copy is Inter in sentence case at 1.5 leading, with
paragraphs capped around 52–60ch. The contrast between huge display type and calm body text is
the signature, so don't shrink headlines to be polite.

**Motifs.** Every vertical has its own line-art motif in `MAAD WEBSITE FILES/Motif Images/`
(CSR, Contact, Blog, Clients, Work, Services). The inverted-"A" pattern and these motifs are
the main brand graphics. Use them as faint embossed or overlay backdrops (≈0.14 resting opacity,
blooming on scroll entry), never as foreground decoration. A new page should pick up its own
motif from the matching design-package folder.

**Layout.** Generous negative space, a strong left alignment, and full-bleed imagery. The work
grid is zero-gap with tiles that butt together. Cards use a 16px radius (`rounded-2xl`). Pills
are fully rounded. Dividers are hairlines. The footer is a rounded charcoal block on the
continuous red motif stage.

**Motion personality.** *Restraint wins.* Things enter once, smoothly (`expo.out`), and stay
put: masked line reveals for headings, clip-path reveals for images, gentle rises for groups.
The hero is the only place with continuous idle motion (trophy float, glow, shine). Interactions
feel physical: magnetic pills, a fill that wipes from the pointer's entry point, a work-tile
line that stretches on hover, a cursor-following WATCH button. Page changes slide the new page up over
a still of the old one, its hero motif (`data-page-parallax`) settling into place last; a project
tile expands into its case-study hero. When in doubt, make it slower, softer and do less.

**Voice.** Copy is confident, warm, a little cheeky ("Got something in mind?", "The MAAD Ones",
"Ka Weekie"), and proudly Ugandan. Keep the brand names and capitalisation exactly as given:
**MAAD McCANN**, The MAADness, The MAAD Ones.

## Working agreements
- Match the designs in `MAAD WEBSITE FILES/<Page>/` and `design/`. When the design and the spec
  disagree, or a value is unclear, ask rather than invent. Colour values are approximations
  still pending designer sign-off.
- Keep changes scoped. Don't reformat or refactor unrelated files.
- Commit messages follow the existing `feat: …` / `fix: …` conventional style.
- When a page ships, update `README.md` (structure table) if the architecture changed.
