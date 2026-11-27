import type { CreativeIcon, WhatWeDoPage } from '@/content/types';
import ideationSrc from '@/assets/svg/services/ideation.svg';
import conceptSrc from '@/assets/svg/services/concept.svg';
import graphicDesignSrc from '@/assets/svg/services/graphic-design.svg';
import animationSrc from '@/assets/svg/services/animation.svg';
import { OrgChart } from './OrgChart';
import { SbccOrbit } from './SbccOrbit';
import { Body, CardTitle, RingCircle, ServiceCard, Tagline } from './ServiceCard';

const CREATIVE_ICONS: Record<CreativeIcon, string> = {
  ideation: ideationSrc,
  concept: conceptSrc,
  'graphic-design': graphicDesignSrc,
  animation: animationSrc,
};

const SUBHEAD = 'text-[clamp(1.05rem,1.2vw,1.92rem)] leading-[1.2] font-semibold';

/**
 * What We Do service cards (design: MAAD McCANN Website-what_we_do.jpg).
 * Desktop: bento layout. Tablet: two columns. Mobile: single column stack.
 */
export type ServicesProps = {
  page: Pick<
    WhatWeDoPage,
    'sbcc' | 'digital' | 'accountManagement' | 'media' | 'experiential' | 'brandStrategy' | 'pr' | 'creative' | 'production'
  >;
};

export function Services({ page }: ServicesProps) {
  const { sbcc, digital, accountManagement: am, media, experiential, brandStrategy, pr, creative, production } =
    page;

  return (
    <div className="bg-paper py-20 sm:py-28 lg:py-40">
      <div className="mx-auto flex w-full max-w-column flex-col gap-3 px-4 sm:gap-3.5 sm:px-8">
        {/* ---------------- SBCC ---------------- */}
        <ServiceCard id={sbcc.id} tone="dark" className="p-6 sm:p-10 lg:px-14 lg:py-14">
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
            <div className="flex flex-col">
              {/* Tablet: intro beside the orbit so the card has no empty right half. Desktop: stacked. */}
              <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:items-center md:gap-x-10 lg:block">
                <div>
                  <CardTitle id={`${sbcc.id}-title`} lines={[sbcc.title]} />
                  <Tagline lines={[sbcc.tagline]} className="mt-4" />
                  <Body className="mt-3 max-w-[60ch] lg:max-w-[48ch]">{sbcc.body}</Body>
                  <ul
                    data-reveal
                    className="mt-5 list-disc pl-5 text-[clamp(0.875rem,0.85vw,1.36rem)] leading-[1.6] font-semibold marker:text-paper sm:grid sm:grid-flow-col sm:grid-cols-[auto_minmax(0,1fr)] sm:grid-rows-4 sm:gap-x-10 md:grid-flow-row md:grid-cols-1 md:grid-rows-none lg:grid-flow-col lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-3"
                  >
                    {/* Items wrap inside their column instead of spilling into the next one. */}
                    {sbcc.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="my-10 md:my-0 lg:my-14">
                  <SbccOrbit />
                </div>
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
        <ServiceCard id={digital.id} tone="red" className="p-6 sm:p-10 lg:px-14 lg:py-12">
          <div className="grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <div>
              <CardTitle id={`${digital.id}-title`} lines={[digital.title]} />
              <Tagline lines={[digital.tagline]} className="mt-6" />
              <Body className="mt-3">{digital.intro}</Body>

              {/* Phones: three equal columns so all circles stay on one line, however narrow.
                  From 1920 the circles grow with the copy (104px → 1.333× at 2560). */}
              <ul
                className="my-8 grid max-w-[20rem] grid-cols-3 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:gap-4 2xl:gap-[0.8333vw]"
                aria-label="Digital services"
              >
                {digital.pills.map((words) => (
                  <li key={words.join(' ')} className="min-w-0">
                    <RingCircle className="w-full border-[5px] sm:w-[clamp(6.5rem,5.4167vw,8.6667rem)] sm:border-[6px]">
                      <span className="px-0.5 text-center text-[clamp(0.58rem,2.6vw,0.7rem)] leading-[1.2] font-semibold sm:text-[clamp(0.78rem,0.65vw,1.04rem)]">
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
            id={am.id}
            tone="dark"
            className="flex flex-col p-6 sm:p-10 md:col-span-2 lg:col-span-1 lg:row-span-2 lg:px-10 lg:py-16"
          >
            <div className="md:grid md:grid-cols-2 md:items-center md:gap-10 lg:flex lg:h-full lg:flex-col lg:items-stretch">
              <div>
                <CardTitle id={`${am.id}-title`} lines={[am.title]} />
                <Tagline lines={am.taglineLines} className="mt-5" />
                <Body className="mt-3">{am.body}</Body>
              </div>
              <div data-reveal className="mt-12 md:mt-0 lg:mt-auto lg:pt-12">
                <OrgChart />
              </div>
            </div>
          </ServiceCard>

          <ServiceCard id={media.id} tone="red" className="@container p-6 sm:p-10 lg:px-11 lg:py-10">
            <CardTitle id={`${media.id}-title`} lines={[media.title]} />
            <Tagline lines={media.taglineLines} fit className="mt-6" />
            <Body className="mt-3">{media.body}</Body>
            <Body className="mt-3">
              {media.servicesLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </Body>
          </ServiceCard>

          <ServiceCard id={experiential.id} tone="dark" className="p-6 sm:p-10 lg:px-11 lg:py-10">
            <CardTitle id={`${experiential.id}-title`} lines={experiential.titleLines} />
            <Tagline lines={experiential.taglineLines} className="mt-6" />
            <Body className="mt-3">{experiential.body}</Body>
          </ServiceCard>

          <ServiceCard
            id={brandStrategy.id}
            tone="red"
            className="flex flex-col justify-center p-6 sm:p-10 md:col-span-2 lg:px-11 lg:py-14"
          >
            <h2
              id={`${brandStrategy.id}-title`}
              data-reveal
              className="font-display text-[clamp(2rem,min(3.7vw,max(3.75rem,3.125vw)),5rem)] leading-[0.98] font-black tracking-[-0.015em] uppercase"
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
            id={pr.id}
            tone="red"
            className="p-6 sm:p-10 md:col-span-2 lg:col-span-1 lg:px-11 lg:py-14"
          >
            <CardTitle id={`${pr.id}-title`} lines={pr.titleLines} />
            <Tagline lines={pr.taglineLines} className="mt-6" />
            <Body className="mt-3">{pr.body}</Body>
            <ul
              data-reveal
              className="mt-6 list-disc pl-5 text-[clamp(0.875rem,0.85vw,1.36rem)] leading-[1.6] font-semibold marker:text-paper"
            >
              {pr.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </ServiceCard>

          <ServiceCard
            id={creative.id}
            tone="dark"
            className="p-6 sm:p-10 md:col-span-2 lg:px-11 lg:py-14"
          >
            <CardTitle id={`${creative.id}-title`} lines={[creative.title]} />
            <Tagline lines={[creative.tagline]} className="mt-3" />
            <Body className="mt-3 max-w-[60ch]">{creative.body}</Body>

            <ul className="mx-auto mt-8 grid max-w-[48rem] grid-cols-2 gap-2.5 sm:grid-cols-4 lg:mt-12">
              {creative.tiles.map((tile) => (
                <li
                  key={tile.icon}
                  data-reveal
                  className="flex flex-col items-center gap-4 rounded-xl bg-service-red px-3 pt-6 pb-6 text-center transition-[translate,background-color] duration-500 ease-brand hover:-translate-y-1.5 hover:bg-service-red-hover sm:pb-8"
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
                  <span className="text-[clamp(0.85rem,min(0.95vw,max(1.05rem,0.875vw)),1.4rem)] leading-[1.15] font-semibold">
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
        <ServiceCard id={production.id} tone="dark" className="p-6 sm:p-10 lg:px-11 lg:py-10">
          <div className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-[1fr_auto]">
            <div>
              <CardTitle id={`${production.id}-title`} lines={[production.title]} />
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
