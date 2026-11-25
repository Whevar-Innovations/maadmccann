import { WHAT_WE_DO_IDS as IDS, whatWeDo } from '@/content/static/whatWeDo';
import ideationSrc from '@/assets/svg/services/ideation.svg';
import conceptSrc from '@/assets/svg/services/concept.svg';
import graphicDesignSrc from '@/assets/svg/services/graphic-design.svg';
import animationSrc from '@/assets/svg/services/animation.svg';
import { OrgChart } from './OrgChart';
import { SbccOrbit } from './SbccOrbit';
import { Body, CardTitle, RingCircle, ServiceCard, Tagline } from './ServiceCard';

const CREATIVE_ICONS: Record<(typeof whatWeDo.creative.tiles)[number]['icon'], string> = {
  ideation: ideationSrc,
  concept: conceptSrc,
  'graphic-design': graphicDesignSrc,
  animation: animationSrc,
};

const SUBHEAD = 'text-[clamp(1.05rem,1.2vw,1.45rem)] leading-[1.2] font-semibold';

/**
 * What We Do service cards (design: MAAD McCANN Website-what_we_do.jpg).
 * Desktop: bento layout. Tablet: two columns. Mobile: single column stack.
 */
export function Services() {
  const { sbcc, digital, accountManagement: am, media, experiential, brandStrategy, pr, creative, production } =
    whatWeDo;

  return (
    <div className="bg-paper py-20 sm:py-28 lg:py-40">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-4 sm:gap-3.5 sm:px-8">
        {/* ---------------- SBCC ---------------- */}
        <ServiceCard id={IDS.sbcc} tone="dark" className="p-6 sm:p-10 lg:px-14 lg:py-14">
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
            <div className="flex flex-col">
              <CardTitle id={`${IDS.sbcc}-title`} lines={[sbcc.title]} />
              <Tagline lines={[sbcc.tagline]} className="mt-4" />
              <Body className="mt-3 max-w-[48ch]">{sbcc.body}</Body>
              <ul
                data-reveal
                className="mt-5 list-disc pl-5 text-[clamp(0.875rem,0.85vw,1.05rem)] leading-[1.6] font-semibold marker:text-paper sm:grid sm:grid-flow-col sm:grid-rows-4 sm:justify-start sm:gap-x-10"
              >
                {sbcc.bullets.map((b) => (
                  <li key={b} className="sm:whitespace-nowrap">
                    {b}
                  </li>
                ))}
              </ul>

              <div className="my-10 lg:my-14">
                <SbccOrbit />
              </div>

              <h3 data-reveal className={`${SUBHEAD} mt-auto`}>
                {sbcc.approaches.title}
              </h3>
              <Body className="mt-3">{sbcc.approaches.body}</Body>
            </div>

            <div className="flex flex-col gap-10 lg:pt-[3.1rem]">
              <div>
                <h3 data-reveal className={SUBHEAD}>
                  {sbcc.humanCentered.title}
                </h3>
                <Body className="mt-3">{sbcc.humanCentered.body}</Body>
              </div>
              <div>
                <h3 data-reveal className={SUBHEAD}>
                  {sbcc.strength.title}
                </h3>
                <div className="mt-3 space-y-5">
                  {sbcc.strength.paragraphs.map((p) => (
                    <Body key={p.slice(0, 24)}>{p}</Body>
                  ))}
                </div>
              </div>
              <div className="lg:mt-auto">
                <h3 data-reveal className={SUBHEAD}>
                  {sbcc.experience.title}
                </h3>
                <Body className="mt-3">{sbcc.experience.body}</Body>
              </div>
            </div>
          </div>
        </ServiceCard>

        {/* ---------------- Digital ---------------- */}
        <ServiceCard id={IDS.digital} tone="red" className="p-6 sm:p-10 lg:px-14 lg:py-12">
          <div className="grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <div>
              <CardTitle id={`${IDS.digital}-title`} lines={[digital.title]} />
              <Tagline lines={[digital.tagline]} className="mt-6" />
              <Body className="mt-3">{digital.intro}</Body>

              <ul className="my-8 flex flex-wrap gap-3 sm:gap-4" aria-label="Digital services">
                {digital.pills.map((words) => (
                  <li key={words.join(' ')}>
                    <RingCircle className="w-[5.75rem] sm:w-[6.5rem]">
                      <span className="text-center text-[0.7rem] leading-[1.2] font-semibold sm:text-[0.78rem]">
                        {words.map((w) => (
                          <span key={w} className="block">
                            {w}
                          </span>
                        ))}
                      </span>
                    </RingCircle>
                  </li>
                ))}
              </ul>

              <div className="space-y-5">
                {digital.leftParagraphs.map((p) => (
                  <Body key={p.slice(0, 24)}>{p}</Body>
                ))}
              </div>
            </div>

            <div className="space-y-5 lg:pt-[2.6rem]">
              {digital.rightParagraphs.map((p) => (
                <Body key={p.slice(0, 24)}>{p}</Body>
              ))}
            </div>
          </div>
        </ServiceCard>

        {/* ---------------- Bento: AM / Media / Experiential / Brand / PR / Creative ---------------- */}
        <div className="grid gap-3 sm:gap-3.5 md:grid-cols-2 lg:grid-cols-[1.18fr_1fr_1fr]">
          <ServiceCard
            id={IDS.accountManagement}
            tone="dark"
            className="flex flex-col p-6 sm:p-10 md:col-span-2 lg:col-span-1 lg:row-span-2 lg:px-10 lg:py-16"
          >
            <div className="md:grid md:grid-cols-2 md:items-center md:gap-10 lg:flex lg:h-full lg:flex-col lg:items-stretch">
              <div>
                <CardTitle id={`${IDS.accountManagement}-title`} lines={[am.title]} />
                <Tagline lines={am.taglineLines} className="mt-5" />
                <Body className="mt-3">{am.body}</Body>
              </div>
              <div data-reveal className="mt-12 md:mt-0 lg:mt-auto lg:pt-12">
                <OrgChart />
              </div>
            </div>
          </ServiceCard>

          <ServiceCard id={IDS.media} tone="red" className="p-6 sm:p-10 lg:px-11 lg:py-10">
            <CardTitle id={`${IDS.media}-title`} lines={[media.title]} />
            <Tagline lines={media.taglineLines} className="mt-6" />
            <Body className="mt-3">{media.body}</Body>
            <Body className="mt-3">
              {media.servicesLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </Body>
          </ServiceCard>

          <ServiceCard id={IDS.experiential} tone="dark" className="p-6 sm:p-10 lg:px-11 lg:py-10">
            <CardTitle id={`${IDS.experiential}-title`} lines={experiential.titleLines} />
            <Tagline lines={experiential.taglineLines} className="mt-6" />
            <Body className="mt-3">{experiential.body}</Body>
          </ServiceCard>

          <ServiceCard
            id={IDS.brandStrategy}
            tone="red"
            className="flex flex-col justify-center p-6 sm:p-10 md:col-span-2 lg:px-11 lg:py-14"
          >
            <h2
              id={`${IDS.brandStrategy}-title`}
              data-reveal
              className="font-display text-[clamp(2rem,3.7vw,3.75rem)] leading-[0.98] font-black tracking-[-0.015em] uppercase"
            >
              {brandStrategy.titleLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h2>
            <Tagline lines={[brandStrategy.tagline]} className="mt-8 lg:mt-12" />
            <Body className="mt-3 max-w-[62ch]">{brandStrategy.body}</Body>
          </ServiceCard>

          <ServiceCard
            id={IDS.pr}
            tone="red"
            className="p-6 sm:p-10 md:col-span-2 lg:col-span-1 lg:px-11 lg:py-14"
          >
            <CardTitle id={`${IDS.pr}-title`} lines={pr.titleLines} />
            <Tagline lines={pr.taglineLines} className="mt-6" />
            <Body className="mt-3">{pr.body}</Body>
            <ul
              data-reveal
              className="mt-6 list-disc pl-5 text-[clamp(0.875rem,0.85vw,1.05rem)] leading-[1.6] font-semibold marker:text-paper"
            >
              {pr.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </ServiceCard>

          <ServiceCard
            id={IDS.creative}
            tone="dark"
            className="p-6 sm:p-10 md:col-span-2 lg:px-11 lg:py-14"
          >
            <CardTitle id={`${IDS.creative}-title`} lines={[creative.title]} />
            <Tagline lines={[creative.tagline]} className="mt-3" />
            <Body className="mt-3 max-w-[60ch]">{creative.body}</Body>

            <ul className="mx-auto mt-8 grid max-w-[48rem] grid-cols-2 gap-2.5 sm:grid-cols-4 lg:mt-12">
              {creative.tiles.map((tile) => (
                <li
                  key={tile.icon}
                  data-reveal
                  className="flex flex-col items-center gap-4 rounded-xl bg-[#880000] px-3 pt-6 pb-6 text-center transition-[translate,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:bg-[#9a0000] sm:pb-8"
                >
                  <RingCircle className="w-[4.5rem] border-[5px] sm:w-[5.25rem]">
                    <img
                      src={CREATIVE_ICONS[tile.icon]}
                      alt=""
                      width={40}
                      height={40}
                      className="h-auto w-[52%]"
                    />
                  </RingCircle>
                  <span className="text-[clamp(0.85rem,0.95vw,1.05rem)] leading-[1.15] font-semibold">
                    {tile.labelLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </ServiceCard>
        </div>

        {/* ---------------- Production ---------------- */}
        <ServiceCard id={IDS.production} tone="dark" className="p-6 sm:p-10 lg:px-11 lg:py-10">
          <div className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-[1fr_auto]">
            <div>
              <CardTitle id={`${IDS.production}-title`} lines={[production.title]} />
              <Tagline lines={[production.tagline]} className="mt-6" />
              <Body className="mt-3 max-w-[52ch]">{production.body}</Body>
            </div>
            <ul className="flex flex-wrap justify-center gap-3 sm:gap-5 lg:justify-end" aria-label="Production services">
              {production.circles.map((items) => (
                <li key={items.join()}>
                  <RingCircle className="w-[6.75rem] border-[7px] sm:w-[9rem]">
                    <span className="px-3 text-center text-[0.72rem] leading-[1.25] font-semibold sm:text-[0.95rem]">
                      {items.map((it) => (
                        <span key={it} className="block">
                          • {it}
                        </span>
                      ))}
                    </span>
                  </RingCircle>
                </li>
              ))}
            </ul>
          </div>
        </ServiceCard>
      </div>
    </div>
  );
}
