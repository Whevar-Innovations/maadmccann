import { useLoaderData } from 'react-router';
import { getHomePage } from '@/content/api';
import { Img } from '@/components/ui/Img';

export const homeLoader = async () => ({
  home: await getHomePage(),
});

/**
 * Build Step 2 verification page: renders all raw static content through the
 * React Router loader and <Img> primitive. Replaced by styled sections in Step 3.
 */
export function HomeRoute() {
  const { home } = useLoaderData<typeof homeLoader>();

  return (
    <div className="container-site space-y-12 py-10">
      {/* 1. Hero data */}
      <section aria-labelledby="hero-heading" className="space-y-4">
        <h1 id="hero-heading" className="font-display text-hero font-bold uppercase">
          {home.hero.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="max-w-[52ch] text-body font-medium">{home.hero.subheading}</p>
        <p>
          <a href={home.hero.cta.href} className="font-accent text-accent font-medium uppercase">
            {home.hero.cta.label}
          </a>
        </p>
        <p className="font-display text-ghost font-bold uppercase">{home.hero.ghostText}</p>
        <div className="grid grid-cols-3 gap-4">
          {home.hero.awards.map((award) => (
            <figure key={award.id} className="space-y-2">
              <Img
                image={award.image}
                priority
                sizes="(min-width: 1024px) 22vw, 33vw"
                className="h-auto w-full max-w-[240px]"
              />
              <figcaption className="text-small">
                {award.title} ({award.year})
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 2. Showreel data */}
      <section aria-labelledby="showreel-heading" className="space-y-4">
        <h2 id="showreel-heading" className="font-display text-showreel font-bold">
          {home.showreel.heading}
        </h2>
        <p className="text-sub font-semibold">{home.showreel.subheading}</p>
        <p className="text-small">Video URL: {home.showreel.videoUrl}</p>
        <Img image={home.showreel.poster} className="h-auto w-full" />
      </section>

      {/* 3. Clients data */}
      <section aria-labelledby="clients-heading" className="space-y-4">
        <h2 id="clients-heading" className="text-small font-semibold uppercase">
          {home.clients.heading}
        </h2>
        <ul className="grid grid-cols-4 gap-4 sm:grid-cols-7">
          {home.clients.logos.map((logo) => (
            <li key={logo.id} className="flex flex-col items-center gap-1">
              <Img image={logo.image} className="h-12 w-auto object-contain" />
              <span className="text-small">{logo.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Featured Projects data */}
      <section aria-labelledby="work-heading" className="space-y-4">
        <h2 id="work-heading" className="sr-only">
          Featured Work
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {home.featuredProjects.map((project) => (
            <article key={project.id} className="space-y-2">
              <Img image={project.image} className="h-auto w-full" />
              <h3 className="text-tile-label font-semibold">
                {project.client}: {project.title}
              </h3>
              <a href={project.href} className="text-sub">
                View work
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Impact data */}
      <section aria-labelledby="impact-heading" className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <h2
            id="impact-heading"
            className="font-display text-impact font-black text-impact-red uppercase"
          >
            {home.impact.heading}
          </h2>
          <p className="text-body font-medium">{home.impact.body}</p>
        </div>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {home.impact.stats.map((stat) => (
            <div key={stat.label} className="border-t border-ink/20 pt-4">
              <dt className="text-stat-label font-bold">{stat.label}</dt>
              <dd className="font-display text-stat font-black text-impact-red">
                {stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}
                {stat.suffix}
              </dd>
              <dd className="mt-1 text-stat-desc font-medium">{stat.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 6. CTA band data */}
      <section aria-labelledby="cta-heading" className="space-y-4">
        <h2 id="cta-heading" className="font-display text-cta font-medium">
          {home.cta.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="max-w-[60ch] text-body font-medium">{home.cta.body}</p>
        <p>
          <a href={home.cta.button.href} className="text-sub font-semibold">
            {home.cta.button.label}
          </a>
        </p>
      </section>
    </div>
  );
}
