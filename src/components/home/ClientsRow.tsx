import type { HomePage } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { FadeUp } from '@/motion/FadeUp';
import { REVEAL } from '@/motion/tokens';

export type ClientsRowProps = {
  clients: HomePage['clients'];
};

/**
 * Clients row section (SPEC §7 #4 & §8.5).
 * Centred small-caps label, then 7 logos in one row (wraps to 2 rows below 640px).
 * Uses <FadeUp> with stagger 0.05.
 */
export function ClientsRow({ clients }: ClientsRowProps) {
  return (
    <section
      aria-labelledby="clients-heading"
      data-clients-section
      className="bg-paper py-12 text-ink lg:py-16"
    >
      <div className="container-site">
        <FadeUp>
          <h2
            id="clients-heading"
            className="text-center text-small font-semibold tracking-[0.14em] text-ink/80 uppercase"
          >
            {clients.heading}
          </h2>
        </FadeUp>

        <FadeUp
          as="ul"
          stagger={REVEAL.clientsStagger}
          className="mt-8 grid grid-cols-4 items-center justify-items-center gap-6 sm:grid-cols-7 sm:gap-8 lg:mt-10"
        >
          {clients.logos.map((logo) => (
            <li
              key={logo.id}
              data-client-logo
              className="flex items-center justify-center will-change-transform"
            >
              <Img
                image={logo.image}
                sizes="120px"
                className="h-10 w-auto object-contain sm:h-12 lg:h-14"
              />
            </li>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
