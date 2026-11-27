# MAAD McCANN Kampala — Web Platform

> **"Truth Well Told"** • 360° Creative Advertising & Communications Agency  
> Plot 2436, Ntinda (off Bukoto–Ntinda Road), Kampala, Uganda

---

## 1. Overview

This repository contains the web experience for **MAAD McCANN Kampala**, Uganda's premier 360° creative agency. Built with a bespoke design system, tactile GSAP motion choreography, Lenis smooth scrolling, and a decoupled content architecture, the platform showcases the agency's award-winning campaigns, brand philosophy, culture, and client impact.

The application is engineered strictly to official agency design packages stored in `MAAD WEBSITE FILES/`, adhering to a zero-magic-number motion contract and a headless CMS interface contract.

---

## 2. Design Package & Source Mapping (`MAAD WEBSITE FILES/`)

All digital assets, layouts, typography, and motifs are derived directly from the source design packages in `MAAD WEBSITE FILES/`. The table below outlines how each design package maps to the platform's architectural modules:

| Folder / Package | Design Source Files | Digital Implementation | Content & Components |
|---|---|---|---|
| **`The MAADness/`** | `MAAD McCANN Website Homepage.ai`<br>• `Homepage Awards/` (Gorilla trophies)<br>• `Ka Weekie/` (GOtv TVC & posters)<br>• `PrideBank/` (Campaign posters & TVC)<br>• `CCBU/` (Coca-Cola Beverages Uganda)<br>• `Showreel/` (`MAAD REEL.mp4`) | **Homepage Core**<br>• Hero master timeline<br>• 3D-float awards trophies<br>• Fullscreen Showreel video modal<br>• Continuous footer motif stage | • `src/routes/home.tsx`<br>• `src/components/home/Hero.tsx`<br>• `src/components/home/Trophies.tsx`<br>• `src/components/home/Showreel.tsx`<br>• `src/components/home/Impact.tsx`<br>• `src/components/home/CtaBand.tsx` |
| **`What We Do/`** | `MAAD McCANN Website Services.ai`<br>• `Services Motif.png`<br>• Font packages | **Services & Capabilities**<br>• Brand Strategy & Development<br>• Creative & Art Direction<br>• PR & Reputation Management<br>• Experiential & Events<br>• Media Planning & Buying<br>• Production, Digital & SBCC | • `src/routes/what-we-do.tsx`<br>• `src/components/what-we-do/*`<br>• `src/content/types.ts` (`WhatWeDoPage`)<br>• `src/content/static/whatWeDo.ts`<br>• Footer services grid in `Footer.tsx` |
| **`Our Work/`** | `MAAD McCANN Website Our Work.ai`<br>• `Our Work Motif.png`<br>• High-res campaign key visuals | **Our Work & Case Studies**<br>• Sector filter pills + paginated project grid (URL-driven)<br>• `/work/:slug` case studies: video or hero image, story, artwork mosaic<br>• Homepage tile grid (`WorkGrid`) links into them | • `src/routes/work.tsx`, `src/routes/work-detail.tsx`<br>• `src/components/work/*`<br>• `src/content/types.ts` (`WorkPage`, `CaseStudyPage`)<br>• `src/content/static/work.ts`, `workSlugs.ts`<br>• `src/components/home/WorkGrid.tsx`, `WorkCard.tsx`<br>• `src/assets/img/work/*` |
| **`CSR/`** | `MAAD McCANN CSR.ai`<br>• `Run For The Nile/`<br>• `Iron Sharpens Iron/`<br>• `CSR Motif.png` | **Corporate Social Responsibility**<br>• Purpose-driven campaigns<br>• Master dark line-art motif backdrop | • `src/assets/img/dark-motif-bg.webp`<br>• Mobile header menu backdrop |
| **`Our Partners/`** | `MAAD McCANN Website Our Clients.ai`<br>• `Our Clients Motif.png`<br>• Partner brand marks (cropped from the artwork) | **Our Partners & Client Roster**<br>• `/partners`: motif hero, sector filter (URL-driven), hairline sector table of client logos, optional case-study links<br>• Homepage clients row | • `src/routes/partners.tsx`<br>• `src/components/partners/*`<br>• `src/content/types.ts` (`PartnersPage`)<br>• `src/content/static/partners.ts`<br>• `src/assets/img/partners/*`<br>• `src/components/home/ClientsRow.tsx` |
| **`The Maad Ones/`** | `The MAAD Ones.ai`<br>• `People Page.docx`<br>• Leadership portraits | **Agency Team & Culture**<br>• Creative leadership<br>• Department heads & culture | • `src/routes/the-maad-ones.tsx`<br>• `src/components/team/*`<br>• `src/content/types.ts` (`TeamPage`, `TeamMember`)<br>• `src/content/static/team.ts` |
| **`Blog/`** | `MAAD McCANN Website BLOG.ai`<br>• Gayaza High School workshop assets | **Insights & Thought Leadership**<br>• Creative masterclasses<br>• Community engagement articles | • `src/content/types.ts` (`Article`) |
| **`Awards/`** | `MAAD McCANN Website Awards.ai`<br>• Silverback Awards photo archive | **Awards & Recognition**<br>• Grand Prix, Agency of the Year<br>• Category plaques & certificates | • `src/components/home/Trophies.tsx`<br>• `public/trophies/*` |
| **`Talk To Us/`** | `MAAD McCANN Website Contact Us.ai`<br>• `Contact Us Motif.png` | **Contact & Location**<br>• Ntinda headquarters details<br>• Interactive contact pill CTA | • `src/components/layout/Footer.tsx`<br>• Desktop & mobile nav CTAs |
| **`Motif Images/`** | Master high-res motif library:<br>• `CSR Motif.png`<br>• `Contact Us Motif.png`<br>• `Our Blog Motif.png`<br>• `Our Clients Motif.png`<br>• `Our Work Motif.png`<br>• `Services Motif.png` | **Brand Design System**<br>• Distinct vector motifs for each vertical<br>• Optimized WebP asset delivery | • `src/assets/img/dark-motif-bg.webp`<br>• `FooterMotifStage.tsx` |

---

## 3. Technology Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Bundler:** [Vite](https://vitejs.dev/) with Rolldown asset pipeline
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with brand CSS variables (`globals.css`)
- **Routing:** [React Router v7](https://reactrouter.com/) (Data Router with async loaders)
- **Motion Engine:** [GSAP 3.14+](https://gsap.com/) (`useGSAP`, `ScrollTrigger`, `SplitText`)
- **Smooth Scroll:** [Lenis 1.1+](https://github.com/darkroomengineering/lenis) (synchronized to GSAP ticker)
- **Video:** [Mux Player](https://docs.mux.com/guides/player) embedding with Lenis scroll lock

---

## 4. Architectural Highlights

### A. Decoupled Content Layer (Zero-Static-Import Rule)
Only files inside `src/content/` may import `src/content/static/`. All content flows through an async data-fetching contract (`src/content/api.ts`: `getHomePage`, `getSiteSettings`, `getWhatWeDoPage`, `getTeamPage`, `getWorkPage`, `getCaseStudy`), consumed by React Router data loaders (`rootLoader`, `homeLoader`, `whatWeDoLoader`, `theMaadOnesLoader`, `workLoader`, `workDetailLoader`) and passed to section components as props. Content types live in `src/content/types.ts`. Site-wide content (nav, footer, and the CTA band via `SiteSettings.cta`) comes from `rootLoader`, so every page gets the CTA band and footer without extra wiring.
- **Enforced:** `npm run check:rules` (run automatically by `npm run build`) fails on static-content imports outside `src/content/`, raw colour literals in components, string eases outside `src/motion/tokens.ts`, and routes missing from `ENABLED_ROUTES`/`SITEMAP_ROUTES`. See `CLAUDE.md` for the fix for each.
- **Production Mode:** Fetches from the headless CMS endpoint.
- **Mock Mode (`VITE_CONTENT_SOURCE=mock`):** Uses an asynchronous in-memory clone of `mock/source.ts` to simulate CMS latency and verify zero build regressions.

### B. Sticky Desktop Header & Mobile Drawer
- **Desktop Header:** Fixed at `top: 0` (`h-20 lg:h-28`), transitioning from transparent to black (`bg-ink/95`, `bg-paper/95` on light pages) past `80px` scroll. Smoothly hides on downward scroll past `120px` (`yPercent: -100`) and reveals instantly on upward scroll (`yPercent: 0`).
- **Viewport Anchoring:** The `<Header>` is placed directly under the root container outside any CSS `transform` or `will-change` wrappers, ensuring its containing block is always the browser viewport.
- **Mobile Menu Drawer:** Portaled directly to `document.body` (`fixed inset-0 z-[9950]`). Uses a 100% solid, fully opaque dark blackish background (`bg-menu-ink`, `#0E0E10`) with an embossed line-art motif overlay from `CSR Motif.png`. When open, the main desktop header is hidden to prevent double-logo/button ghosting. From `sm` the links scale up (`--text-menu`, capped by viewport height), the top bar matches the header bar so the logo doesn't jump, and the Talk To Us pill and the location line share one row.

### C. Continuous Footer Motif Stage
A unified red metallic texture stage (`src/components/layout/FooterMotifStage.tsx`) spans both the `CtaBand` and `Footer` sections seamlessly, eliminating horizontal seams. An interactive SVG motif bloom runs on scroll entry, with a pointer-tracking radial spotlight.

### D. Motion System & Accessibility
- All motion values (durations, staggers, eases, distances, ScrollTrigger starts) are centralized in `src/motion/tokens.ts`: shared groups (`DUR`, `EASE`, `REVEAL`, …) plus one named group per component with bespoke choreography (`SERVICE_CARD`, `TEAM_GRID`, `PROFILE_DIALOG`, …).
- All colours, shadows and CSS easings are theme tokens in `src/styles/globals.css`. Components contain no raw hex/rgb values.
- Only `transform`, `opacity`, and `clip-path` are animated for 60fps GPU performance.
- Honors `prefers-reduced-motion: reduce`: instantly skips loader timeouts, replaces page transitions with 0.2s crossfades, and cancels floating trophy idle loops.

### E. Page Transitions
Led by the destination page, with no overlay or loader screen (`src/motion/PageTransition.tsx`, SPEC §8.8):
- **Link navigation:** a still copy of the current view (`pageSnapshot.ts`) holds the screen while the route loads. The new page then slides up over it with rounded top corners (`expo.out`), while the copy drifts up and darkens, like scrolling into the next page.
- **Hero layers settle last:** elements marked `data-page-parallax` (the home A/V motif and trophies, the What We Do and Our Work motifs, the team photo) start lower and land after the page, while the hero's own bloom and headline entrance play.
- **Work tile → case study:** the tile image expands into the case-study hero instead (`sharedTransition.ts`).
- **Back/forward:** quick rise-in. **Reduced motion:** 0.2s crossfade. All timings are in `TRANSITION` / `SHARED_TRANSITION` (`tokens.ts`).

---

## 5. Repository Structure

```
├── MAAD WEBSITE FILES/           # Original agency design packages (AI, PDF, fonts, motifs)
├── public/
│   ├── fonts/                    # Self-hosted brand webfonts (Inter, Neue Haas Grotesk)
│   └── trophies/                 # Optimized responsive trophy WebPs
├── src/
│   ├── assets/
│   │   ├── img/                  # Optimized WebP campaign & motif assets
│   │   └── svg/                  # Cleaned vector logos & marks
│   ├── components/
│   │   ├── home/                 # Homepage sections (Hero, Showreel, WorkGrid, CtaBand, etc.)
│   │   ├── layout/               # Shell layout (Header, Footer, FooterMotifStage, RootLayout)
│   │   ├── what-we-do/           # What We Do sections (WhatWeDoHero, Services, ServiceCard, SbccOrbit, OrgChart)
│   │   ├── team/                 # The MAAD Ones sections (TeamHero, TeamIntro, TeamGrid, TeamCard, BioPanel, ProfileDialog)
│   │   ├── work/                 # Our Work + case studies (WorkHero, ProjectGrid, ProjectCard, Pagination, CaseHeader, CaseMedia, CaseStory, ArtworkGallery, galleryLayout.ts packer)
│   │   ├── partners/             # Our Partners (PartnersHero, PartnersIntro, SectorTable, PartnerLogoTile, partnersMotifPaths.ts)
│   │   ├── contact/              # Contact Us (ContactHero, ServicesTicker, ContactSection, ContactForm, ContactMap, ContactIcon, contactMotifPaths.ts)
│   │   └── ui/                   # Shared UI primitives (Button, Link, Img, PlayButton, Pill, CategoryFilter, MotifHero, VideoFrame)
│   ├── content/
│   │   ├── api.ts                # Content fetchers (getHomePage, getSiteSettings, getWhatWeDoPage, getTeamPage, getWorkPage, getCaseStudy, getContactPage)
│   │   ├── types.ts              # CMS schema type definitions (the contract)
│   │   ├── static/               # Source content (settings, home, whatWeDo, team, work): imported only by src/content/
│   │   ├── mock/                 # Mock CMS source adapter
│   │   └── sanity/               # Sanity document types + mappers
│   ├── motion/
│   │   ├── tokens.ts             # Centralized motion constants (DUR, EASE, STAGGER)
│   │   ├── gsap-setup.ts         # GSAP plugin registration & media queries
│   │   ├── SmoothScroll.tsx      # Lenis smooth scroll provider
│   │   ├── LoaderProvider.tsx    # Session-aware initial asset/font preloader
│   │   ├── PageTransition.tsx    # Page transition: new page slides up over a still of the old one; tile-to-case-study expand
│   │   ├── pageSnapshot.ts       # Still copy of the page being left (the transition's underlay)
│   │   ├── sharedTransition.ts   # Tile image overlay that expands into the case-study hero
│   │   ├── RevealText.tsx        # SplitText masked line reveal
│   │   ├── RevealImage.tsx       # Clip-path & scale-in image reveal
│   │   ├── FadeUp.tsx            # Fluid translateY fade-up primitive
│   │   ├── Counter.tsx           # Layout-stable numerical metric counter
│   │   └── Magnetic.tsx          # Cursor-attraction spring physics primitive
│   ├── lib/
│   │   ├── useSeo.ts             # Per-route SEO tags
│   │   └── site.ts               # Site-wide SEO defaults (mirrors index.html)
│   ├── routes/
│   │   ├── home.tsx              # Homepage data loader & route view
│   │   ├── what-we-do.tsx        # What We Do loader & route view
│   │   ├── the-maad-ones.tsx     # The MAAD Ones loader & route view
│   │   ├── work.tsx              # Our Work loader & route view
│   │   ├── work-detail.tsx       # Case study (/work/:slug) loader & route view
│   │   ├── partners.tsx          # Our Partners loader & route view
│   │   ├── contact.tsx           # Contact Us loader & route view (Talk To Us / Let’s Talk)
│   │   └── RouteError.tsx        # Top-level error boundary
│   ├── styles/
│   │   └── globals.css           # Tailwind v4 theme & typography tokens
│   ├── main.tsx                  # App bootstrapper
│   └── router.tsx                # React Router v7 configuration
├── scripts/
│   └── check-rules.mjs           # Project rule guard (runs before every build)
├── docs/
│   └── spec.md                   # Complete architectural specification
├── CLAUDE.md                     # Grounding rules, page checklist & design direction
└── package.json
```

---

## 6. Development & Build Commands

```bash
# Install dependencies
npm install

# Start local development server (runs on http://localhost:5173)
npm run dev

# Check project rules (static imports, raw colours, string eases, route registry)
npm run check:rules

# Run strict TypeScript typechecking
npm run typecheck

# Build for production (runs check:rules first)
npm run build

# Dev server with the mock CMS source (Sanity-shaped awards via src/content/sanity/mappers.ts)
npm run dev:mock

# Build with mock CMS source (verifies CMS decoupling)
VITE_CONTENT_SOURCE=mock npm run build

# Preview production build locally
npm run preview
```

### Adding a trophy (mock CMS)

1. Export a transparent image as `<name>-700.webp` and `<name>-1400.webp` into `public/trophies/` (the number is the height in px).
2. Add an entry to `src/content/mock/data/awards.ts` (`asset.url` = the `-1400` file, `dimensions` = its size).
3. Run `npm run dev:mock`. The first 3 awards fill the hero triangle; any extra awards rotate in from a pool.

---

## 7. Performance & Quality Standards

- **Core Web Vitals:** Targeted LCP < 2.0s, CLS < 0.05, FID/INP < 100ms.
- **Zero CLS Image Rule:** All images use explicit width/height ratios or aspect-ratio wrappers to prevent layout shifts.
- **Asset Formats:** All bitmap imagery is served in modern WebP format with responsive source sets.
- **Font Preloading:** Critical font weights are preloaded in `index.html` to eliminate FOIT/FOUT.

---

© 2026 MAAD McCANN. All rights reserved.

## SEO

- Static tags (title, description, canonical, Open Graph, Twitter, JSON-LD) live in `index.html` because scrapers don't run JS. Every absolute URL there is the `__SITE_URL__` placeholder, replaced at build time by `vite.config.ts` (also used to generate `robots.txt` and `sitemap.xml`). The URL is `VITE_SITE_URL` if set, else Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (switches to the custom domain automatically once it is attached in Vercel), else `https://maadmccann.vercel.app`. The share image is served from `public/og-image.jpg`. Site-wide defaults are mirrored in `src/lib/site.ts`.
- Per-route updates: call `useSeo({ title, description, path, image, noindex })` from `src/lib/useSeo.ts` in each route component (see `src/routes/home.tsx`). Keep placeholder routes `noindex`.
- `public/` holds `favicon.ico`, PNG icons, `site.webmanifest` and `og-image.jpg` (1200×630). `robots.txt` and `sitemap.xml` are generated by `vite.config.ts`; add real routes to its `routes` list as they ship.
- Hosting must serve `index.html` for every path (SPA fallback) so deep links don't 404.
- Add real social profile URLs to `sameAs` in the JSON-LD (and `settings.ts`) once they exist; they are `#` today.
