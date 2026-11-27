import { useState, type FormEvent, type PointerEvent } from 'react';
import type { ContactPage } from '@/content/types';
import { siteConfig } from '@/lib/site';
import { Magnetic } from '@/motion/Magnetic';

export type ContactFormProps = { form: ContactPage['form'] };

type Status = 'idle' | 'sending' | 'success' | 'error';

/** Spam trap (Formspree's convention): hidden from people, bots fill it in. */
const HONEYPOT = '_gotcha';

const labelClass = 'block text-sub font-semibold tracking-wide uppercase';
// 16px minimum (text-case-body) so iOS Safari doesn't zoom the page when a field is focused.
const fieldClass =
  'mt-[clamp(0.75rem,0.95vw,1.5rem)] block w-full rounded-none border-0 bg-paper px-4 text-case-body text-ink outline-offset-3 focus-visible:outline-2 focus-visible:outline-paper';

/**
 * "Your Details" form (Contact Us, right column). Native validation (required, type=email).
 * With VITE_CONTACT_ENDPOINT set, it POSTs JSON there and reports the result in a live region;
 * without one, it opens the visitor's mail app with the message drafted to `form.recipient`.
 * Entrance motion is owned by ContactSection (the [data-contact-*] hooks).
 */
export function ContactForm({ form }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const endpoint = siteConfig.contactEndpoint;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const el = e.currentTarget;
    const data = new FormData(el);
    const value = (key: string) => String(data.get(key) ?? '').trim();
    const message = {
      name: value('name'),
      email: value('email'),
      subject: value('subject'),
      message: value('message'),
    };

    if (value(HONEYPOT)) {
      el.reset();
      setStatus('success');
      return;
    }

    if (!endpoint) {
      const body = `${message.message}\n\n${message.name}\n${message.email}`;
      window.location.href = `mailto:${form.recipient}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...message, _replyto: message.email, _subject: message.subject }),
      });
      if (!res.ok) throw new Error(`Contact endpoint answered ${res.status}`);
      el.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  // The fill grows from wherever the pointer crosses the edge (same mechanic as ui/Button).
  const setOrigin = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--fx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--fy', `${e.clientY - r.top}px`);
  };

  const sending = status === 'sending';

  return (
    <form
      onSubmit={onSubmit}
      aria-labelledby="contact-form-heading"
      aria-describedby="contact-form-subtitle"
      className="min-w-0"
    >
      <h2
        id="contact-form-heading"
        className="font-display text-form-title font-bold tracking-display"
      >
        <span className="block overflow-hidden pb-[0.08em]">
          <span data-contact-line className="block">
            {form.title}
          </span>
        </span>
      </h2>
      <p id="contact-form-subtitle" data-contact-rise className="mt-2 text-sub font-medium">
        {form.subtitle}
      </p>

      <div className="mt-10 grid gap-x-[clamp(1.5rem,2vw,3.2rem)] gap-y-8 sm:grid-cols-2 lg:mt-[clamp(3rem,3.6vw,5.8rem)] lg:gap-y-[clamp(2rem,2.6vw,4.2rem)]">
        <div data-contact-field>
          <label htmlFor="contact-name" className={labelClass}>
            {form.fields.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={`${fieldClass} h-[clamp(3rem,3.23vw,5.17rem)]`}
          />
        </div>
        <div data-contact-field>
          <label htmlFor="contact-email" className={labelClass}>
            {form.fields.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            className={`${fieldClass} h-[clamp(3rem,3.23vw,5.17rem)]`}
          />
        </div>
        <div data-contact-field className="sm:col-span-2">
          <label htmlFor="contact-subject" className={labelClass}>
            {form.fields.subject}
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            className={`${fieldClass} h-[clamp(3rem,3.23vw,5.17rem)]`}
          />
        </div>
        <div data-contact-field className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelClass}>
            {form.fields.message}
          </label>
          {/* data-lenis-prevent: wheel scrolls the textarea itself, not the page. */}
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            data-lenis-prevent
            className={`${fieldClass} h-[clamp(9rem,8.65vw,13.85rem)] resize-y py-3`}
          />
        </div>
      </div>

      {/* Honeypot: off-screen and skipped by keyboard and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-hp">{HONEYPOT}</label>
        <input id="contact-hp" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div data-contact-rise className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-[clamp(2.5rem,3.2vw,5.1rem)]">
        <Magnetic className="w-fit">
          <button
            type="submit"
            disabled={sending}
            aria-disabled={sending || undefined}
            onPointerEnter={setOrigin}
            onPointerLeave={setOrigin}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-paper px-[clamp(2rem,2.6vw,4.2rem)] py-[clamp(0.9rem,1.15vw,1.85rem)] font-body text-lead font-regular text-ink transition-[translate,box-shadow,opacity] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-pill focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <span
              aria-hidden="true"
              style={{ left: 'var(--fx, 50%)', top: 'var(--fy, 50%)' }}
              className="pointer-events-none absolute aspect-square w-[240%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-crimson-800 transition-transform duration-700 ease-brand group-hover:scale-100 group-focus-visible:scale-100 group-disabled:scale-0 motion-reduce:transition-none"
            />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-paper group-focus-visible:text-paper group-disabled:text-ink">
              {sending ? form.sendingLabel : form.submitLabel}
            </span>
          </button>
        </Magnetic>

        <p role="status" aria-live="polite" className="min-h-[1.5em] max-w-[36ch] text-body font-medium">
          {status === 'success' && form.successMessage}
          {status === 'error' && <span className="text-maroon-200">{form.errorMessage}</span>}
        </p>
      </div>
    </form>
  );
}
