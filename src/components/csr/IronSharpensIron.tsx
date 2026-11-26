import { useRef } from 'react';
import type { CsrPage, ImageAsset } from '@/content/types';
import heroBgSrc from '@/assets/jpg/hero-bg.jpg';
import ironLogoSrc from '@/assets/svg/csr/iron-sharpens-iron-logo.svg';
import { Img } from '@/components/ui/Img';
import { useFallIn } from '@/motion/useFallIn';
import { CSR_BODY, CSR_CONTAINER } from './styles';
import { usePanelReveal } from './usePanelReveal';

function Poster({ image, index }: { image: ImageAsset; index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  useFallIn(ref, { delay: index * 0.08 });
  return (
    <li ref={ref}>
      <Img
        image={image}
        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 23vw, 46vw"
        className="block h-auto w-full"
      />
    </li>
  );
}

export type IronSharpensIronProps = { section: CsrPage['ironSharpensIron'] };

/**
 * Iron Sharpens Iron portfolio review: crimson textured panel (the CTA/footer texture), logo lockup
 * and copy, then the four event posters falling into a grid (2 × 2 on phones, 4 across from tablet).
 */
export function IronSharpensIron({ section: isi }: IronSharpensIronProps) {
  const ref = useRef<HTMLElement | null>(null);
  usePanelReveal(ref);

  return (
    <section
      aria-labelledby={`${isi.id}-title`}
      className={`${CSR_CONTAINER} pb-20 sm:pb-28 lg:pb-[9.7vw]`}
    >
      <article
        ref={ref}
        className="relative isolate overflow-hidden bg-crimson-800 px-6 py-10 text-paper sm:px-12 sm:py-14 lg:grid lg:grid-cols-[54.2%_minmax(0,1fr)] lg:pt-[5.9%] lg:pr-[6.8%] lg:pb-[5.5%] lg:pl-[6%]"
      >
        <img
          src={heroBgSrc}
          alt=""
          width={1922}
          height={1674}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />

        <div>
          {/* Lockup: logo mark + divider, then "PORTFOLIO REVIEW" sized so its two lines match the mark */}
          <h2
            id={`${isi.id}-title`}
            data-pop
            className="flex origin-left items-center gap-[0.18em] font-display text-[clamp(2.1rem,3.23vw,4.45rem)] leading-[0.92] font-bold tracking-[-0.02em] uppercase"
          >
            <img
              src={ironLogoSrc}
              alt={isi.logoAlt}
              width={444}
              height={406}
              className="h-[1.84em] w-auto shrink-0"
            />
            <span>
              {isi.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </h2>

          <h3
            data-reveal
            className="mt-8 text-[clamp(1.25rem,1.458vw,2rem)] leading-[1.25] font-bold sm:mt-10 lg:mt-[2.1vw]"
          >
            {isi.subtitle}
          </h3>
          <p data-reveal className={`mt-2 max-w-[25em] lg:mt-[0.6vw] ${CSR_BODY}`}>
            {isi.body}
          </p>
        </div>

        <div className={`mt-8 space-y-[1.35em] text-paper/95 sm:mt-10 lg:mt-0 ${CSR_BODY}`}>
          {isi.paragraphs.map((p) => (
            <p key={p} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </article>

      <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-4 lg:mt-[1.2vw] lg:gap-[1.15vw]">
        {isi.posters.map((poster, i) => (
          <Poster key={poster.src} image={poster} index={i} />
        ))}
      </ul>
    </section>
  );
}
