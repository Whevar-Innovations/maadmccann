import { useRef } from 'react';
import type { ContactPage, SiteSettings } from '@/content/types';
import { SocialIcon } from '@/components/layout/Footer';
import { Link } from '@/components/ui/Link';
import { gsap, MEDIA_QUERIES, useGSAP } from '@/motion/gsap-setup';
import { CONTACT, DIST, DUR, EASE, SCROLL, STAGGER } from '@/motion/tokens';
import { ContactForm } from './ContactForm';
import { ContactIcon } from './ContactIcon';

export type ContactSectionProps = {
  intro: ContactPage['intro'];
  details: ContactPage['details'];
  followLabel: string;
  socials: SiteSettings['footer']['socials'];
  form: ContactPage['form'];
};

/**
 * Contact Us body on graphite: "Get In Touch" (eyebrow, title, copy, the four contact details and
 * the social row) beside the "Your Details" form.
 * Motion, once per column as it scrolls in: the KEEP CLOSE rule draws, titles rise out of a line
 * mask, copy and fields rise in turn, the detail circles pop. Mobile halves the distances.
 * Reduced motion: everything fades in.
 */
export function ContactSection({ intro, details, followLabel, socials, form }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = <T extends Element>(sel: string, root: ParentNode = section) =>
        Array.from(root.querySelectorAll<T>(sel));
      const columns = q<HTMLElement>('[data-contact-col]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA_QUERIES.reducedMotion, () => {
        for (const col of columns) {
          gsap.fromTo(
            q('[data-contact-rule], [data-contact-line], [data-contact-rise], [data-contact-field], [data-contact-detail]', col),
            { opacity: 0 },
            {
              opacity: 1,
              duration: DUR.ui,
              ease: EASE.soft,
              scrollTrigger: { trigger: col, start: SCROLL.start, once: true },
            },
          );
        }
      });

      mm.add({ motionOk: MEDIA_QUERIES.motionOk, isMobile: MEDIA_QUERIES.mobile }, (context) => {
        const { motionOk, isMobile } = context.conditions ?? {};
        if (!motionOk) return;
        const rise = isMobile ? DIST.rise / 2 : DIST.rise;
        const fieldRise = isMobile ? CONTACT.fieldRise / 2 : CONTACT.fieldRise;

        for (const col of columns) {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: col, start: SCROLL.start, once: true },
          });
          const rule = q('[data-contact-rule]', col);
          if (rule.length) {
            tl.fromTo(
              rule,
              { scaleX: CONTACT.ruleFrom },
              { scaleX: 1, duration: CONTACT.ruleDur, ease: EASE.out },
              0,
            );
          }
          tl.fromTo(
            q('[data-contact-line]', col),
            { yPercent: DIST.maskFrom },
            { yPercent: 0, duration: DUR.hero, ease: EASE.out, stagger: STAGGER.lines },
            rule.length ? CONTACT.titleAt : 0,
          );
          tl.fromTo(
            q('[data-contact-rise]', col),
            { y: rise, opacity: 0 },
            { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out, stagger: STAGGER.items },
            CONTACT.bodyAt,
          );
          const fields = q('[data-contact-field]', col);
          if (fields.length) {
            tl.fromTo(
              fields,
              { y: fieldRise, opacity: 0 },
              { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out, stagger: CONTACT.fieldStagger },
              CONTACT.bodyAt,
            );
          }
        }

        // Details: their own trigger (they sit lower than the title on desktop).
        const list = section.querySelector<HTMLElement>('[data-contact-details]');
        if (list) {
          const items = q<HTMLElement>('[data-contact-detail]', list);
          const tl = gsap.timeline({
            scrollTrigger: { trigger: list, start: CONTACT.detailsStart, once: true },
          });
          tl.fromTo(
            items.map((item) => item.querySelector('[data-contact-icon]')),
            { scale: CONTACT.iconScaleFrom, opacity: 0 },
            { scale: 1, opacity: 1, duration: DUR.text, ease: EASE.popStrong, stagger: CONTACT.detailStagger },
            0,
          ).fromTo(
            items.map((item) => item.querySelector('[data-contact-text]')),
            { y: fieldRise, opacity: 0 },
            { y: 0, opacity: 1, duration: DUR.text, ease: EASE.out, stagger: CONTACT.detailStagger },
            STAGGER.items,
          );
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="bg-graphite pt-20 text-paper sm:pt-24 lg:pt-[clamp(6rem,9.1vw,14.6rem)]"
    >
      <div className="container-wide grid gap-y-20 lg:grid-cols-2 lg:gap-x-[clamp(2rem,1.8vw,2.9rem)]">
        {/* Get In Touch */}
        <div data-contact-col className="flex min-w-0 flex-col lg:pt-[clamp(2.5rem,2.9vw,4.6rem)]">
          <p className="flex items-center gap-[1.1em] text-lead leading-none font-medium uppercase">
            <span
              aria-hidden="true"
              data-contact-rule
              className="block h-px w-[2.6em] origin-left bg-paper"
            />
            <span data-contact-rise>{intro.eyebrow}</span>
          </p>
          <h2
            id="contact-heading"
            className="mt-3 font-display text-contact-title font-bold tracking-display"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-contact-line className="block">
                {intro.title}
              </span>
            </span>
          </h2>
          <p data-contact-rise className="mt-6 max-w-[33em] text-body leading-[1.45] lg:mt-[clamp(1.75rem,2vw,3.2rem)]">
            {intro.body}
          </p>

          <ul
            data-contact-details
            className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-[clamp(3.5rem,5.7vw,9.1rem)] lg:max-w-[clamp(36rem,36.5vw,58.4rem)] lg:gap-y-[clamp(2rem,2.6vw,4.2rem)]"
          >
            {details.map((detail) => (
              <li key={detail.icon} data-contact-detail className="flex items-center gap-[clamp(0.75rem,0.8vw,1.3rem)]">
                <span
                  data-contact-icon
                  className="grid size-[clamp(3rem,3.125vw,5rem)] shrink-0 place-items-center rounded-full border-[1.5px] border-paper"
                >
                  <ContactIcon icon={detail.icon} />
                </span>
                <div data-contact-text className="min-w-0 text-stat-desc leading-[1.35]">
                  <span className="sr-only">{detail.label}: </span>
                  {detail.lines.map((line) => (
                    <span key={line.text} className="block">
                      {line.href ? (
                        <Link href={line.href} className="link-accent break-words">
                          {line.text}
                        </Link>
                      ) : (
                        line.text
                      )}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 lg:mt-auto lg:pt-16">
            <h3 data-contact-rise className="text-body font-medium tracking-[0.2em] uppercase">
              {followLabel}
            </h3>
            <ul data-contact-rise className="mt-5 flex items-center gap-5">
              {socials.map((social) => (
                <li key={social.platform}>
                  <Link
                    href={social.url}
                    external={social.url !== '#'}
                    aria-label={social.platform}
                    className="inline-flex size-7 items-center justify-center text-paper transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:scale-110 hover:text-maroon-200 focus-visible:text-maroon-200"
                  >
                    <SocialIcon platform={social.platform} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Your Details */}
        <div data-contact-col className="min-w-0">
          <ContactForm form={form} />
        </div>
      </div>
    </section>
  );
}
