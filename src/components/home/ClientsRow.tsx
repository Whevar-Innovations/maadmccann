import type { HomePage } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { FadeUp } from '@/motion/FadeUp';
import { LogoCarousel } from '@/motion/LogoCarousel';

export type ClientsRowProps = {
  clients: HomePage['clients'];
};

/**
 * Clients row section (SPEC §7 #4 & §8.5).
 * Centred small-caps label, then a stepped, infinite logo carousel (visible count follows width; pauses on hover).
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
      </div>

      <FadeUp className="container-site mt-8 lg:mt-10">
        <LogoCarousel
          items={clients.logos}
          getKey={(logo) => logo.id}
          renderItem={(logo) => (
            <span
              data-client-logo
              className="relative flex h-12 w-full max-w-[9.5rem] items-center justify-center will-change-transform hover:z-10 active:z-10 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:active:scale-110 motion-safe:[@media(hover:hover)]:hover:scale-[1.15] sm:h-14 lg:h-16"
            >
              <Img
                image={logo.image}
                sizes="152px"
                className="h-full w-full object-contain"
              />
            </span>
          )}
        />
      </FadeUp>
    </section>
  );
}
