import type { ContactPage } from '../types';

/** Copy from "MAAD McCANN Website Contact Us.pdf", verbatim. */
export const contact: ContactPage = {
  seo: {
    title: 'Contact Us',
    description:
      'Start a conversation with MAAD McCANN in Kampala. Visit us on Bukoto–Ntinda Road, call +256 701 222 522 or email maad@maad.co.ug.',
  },
  hero: {
    headlineLines: ['Start a conversation.', 'See where it goes.'],
    subheading: 'Every great idea starts with a conversation.',
  },
  services: [
    'Media',
    'Creative',
    'Experiential Marketing',
    'Digital',
    'Brand Strategy & Development',
    'Public Relations',
  ],
  servicesLabel: 'Our services',
  intro: {
    eyebrow: 'KEEP CLOSE',
    title: 'Get In Touch',
    body: 'Tell us what you’re working on, what you’re trying to solve, or even what you’re dreaming up. We’ll bring the strategy, creativity and just the right amount of MAAD.',
  },
  details: [
    {
      icon: 'location',
      label: 'Address',
      lines: [
        { text: 'Plot 2436 Bukoto–Ntinda Road' },
        { text: '(after Victory City Church)' },
        { text: 'P.O. Box 40185, Kampala, Uganda' },
      ],
    },
    {
      icon: 'phone',
      label: 'Phone',
      lines: [
        { text: '+256 701 222 522', href: 'tel:+256701222522' },
        { text: '+256 414 222 522', href: 'tel:+256414222522' },
      ],
    },
    {
      icon: 'email',
      label: 'Email',
      lines: [
        { text: 'maad@maad.co.ug', href: 'mailto:maad@maad.co.ug' },
        { text: 'hello.uganda@mccann.com', href: 'mailto:hello.uganda@mccann.com' },
      ],
    },
    {
      icon: 'hours',
      label: 'Opening hours',
      lines: [
        { text: 'Monday – Friday: 8:30 AM – 5:30 PM' },
        { text: 'Saturday: 9:30 AM – 1:00 PM' },
        { text: 'Sunday: Closed' },
      ],
    },
  ],
  followLabel: 'FOLLOW US',
  form: {
    title: 'Your Details',
    subtitle: 'Let us know how to get back to you.',
    fields: {
      name: 'NAME',
      email: 'EMAIL ADDRESS',
      subject: 'SUBJECT',
      message: 'COMMENTS / QUESTIONS',
    },
    submitLabel: 'Send Message',
    sendingLabel: 'Sending…',
    successMessage: 'Thanks! Your message is on its way. We’ll get back to you soon.',
    errorMessage: 'Something went wrong sending your message. Please try again, or email us at maad@maad.co.ug.',
    recipient: 'maad@maad.co.ug',
  },
  map: {
    title: 'MAAD McCANN on Google Maps',
    embedUrl:
      'https://www.google.com/maps?q=MAAD%20McCANN%2C%20Plot%202436%20Bukoto-Ntinda%20Road%2C%20Kampala&z=16&output=embed',
  },
};
