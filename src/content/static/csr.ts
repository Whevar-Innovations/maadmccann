import type { ImageAsset } from '../types';
import { img } from './assets';

/**
 * CSR page copy (/csr), from "MAAD McCANN CSR.pdf".
 * Posters live in /public/images/csr as {name}-{w}.webp, exported from the high-resolution artwork in the PDF.
 */

export type CsrServiceIcon =
  | 'campaign-strategy'
  | 'experiential-marketing'
  | 'media-pr'
  | 'digital-content'
  | 'branding-identity'
  | 'event-experience'
  | 'community-engagement'
  | 'digital-storytelling';

export type CsrService = {
  icon: CsrServiceIcon;
  title: string;
  body: string;
};

const poster = (name: string, alt: string): ImageAsset =>
  img(`/images/csr/${name}-480.webp`, 480, 600, alt, `/images/csr/${name}-480.webp 480w, /images/csr/${name}-960.webp 960w`);

const ironPoster = (n: number, alt: string): ImageAsset =>
  img(
    `/images/csr/iron-sharpens-iron-${n}-400.webp`,
    400,
    452,
    alt,
    `/images/csr/iron-sharpens-iron-${n}-400.webp 400w, /images/csr/iron-sharpens-iron-${n}-800.webp 800w`,
  );

export const csr = {
  seo: {
    title: 'Corporate Social Responsibility',
    description:
      'We partner with purpose-driven organisations to turn important causes into powerful ideas, meaningful experiences and movements that make a real difference in people’s lives.',
  },

  hero: {
    eyebrow: 'Corporate Social Responsibility',
    headlineLines: ['Stronger people. Brighter Uganda.'],
    bodyLines: [
      'We partner with purpose-driven organisations to turn important causes into powerful ideas,',
      'meaningful experiences and movements that make a real difference in people’s lives.',
    ],
  },

  intro: {
    eyebrow: 'Our CSR Work',
    headlineLines: ['Ideas With', 'A Greater Purpose.'],
    body: 'From health to the environment, we help organisations turn important causes into national conversations and experiences that mobilise people, resources and lasting change.',
    /** Right column. `**MAAD McCANN**` is rendered bold. */
    paragraphs: [
      'At **MAAD McCANN**, we help turn the purpose of the run into a clear, compelling and recognisable campaign. We shape the creative direction and campaign messaging, develop visual communication and content, and support the experiences that bring people into the movement.',
      'From the first call to participate to the energy of event day, our work helps make the cause visible, memorable and easier for people to connect with.',
    ],
  },

  cancerRun: {
    id: 'cancer-run',
    logoAlt: 'Cancer Run 2027',
    title: 'Rotary Cancer Run',
    tagline: 'A nation moving for a cancer-free tomorrow.',
    paragraphs: [
      'The Rotary Cancer Run is a flagship annual initiative by Rotary Clubs of Uganda that brings people together to raise awareness and funds in support of cancer-related causes.',
      'It creates a platform for communities, organisations, families and individuals to stand together, encourage early action and contribute to the fight against cancer.',
    ],
    poster: poster(
      'cancer-run-poster',
      'Rotary Cancer Run 2026 poster: “Gwanga Mujje, let’s run to restore hope”, 30 August 2026, Kololo Independence Grounds.',
    ),
    servicesTitle: 'What We Do For The Cancer Run',
    services: [
      {
        icon: 'campaign-strategy',
        title: 'Campaign Strategy & Creative',
        body: 'We develop the campaign idea, messaging and visual direction to give the cause a clear, consistent voice.',
      },
      {
        icon: 'media-pr',
        title: 'Media & Public Relations',
        body: 'We support awareness and visibility through communication that helps the campaign reach wider audiences and build support.',
      },
      {
        icon: 'experiential-marketing',
        title: 'Experiential Marketing',
        body: 'We help bring the cause to life through event experiences, activations and community touchpoints that encourage participation.',
      },
      {
        icon: 'digital-content',
        title: 'Digital & Content',
        body: 'We create digital content and social storytelling that inform, engage and inspire people to take part.',
      },
    ],
  },

  runForTheNile: {
    id: 'run-for-the-nile',
    logoAlt: 'Run for the Nile, to protect Lake Victoria',
    headlineLines: ['Healthy Rivers.', 'Stronger Communities.'],
    paragraphs: [
      'Run for the Nile is an annual movement that uses the power of participation to raise awareness and support for the conservation of the River Nile and its surrounding ecosystems.',
      'It brings people, communities, organisations & partners together around a shared responsibility: protecting the natural resources that sustain life and livelihoods.',
    ],
    poster: poster(
      'run-for-the-nile-poster',
      'Run for the Nile 2026 poster: 5km, 10km and 21km runs to protect Lake Victoria, 28 March 2026, Jinja.',
    ),
    servicesTitle: 'What We Do For Run For The Nile',
    services: [
      {
        icon: 'branding-identity',
        title: 'Branding & Visual Identity',
        body: 'We build a recognisable campaign identity and apply it consistently across communication and event touchpoints.',
      },
      {
        icon: 'community-engagement',
        title: 'Community Engagement',
        body: 'We support initiatives and communication that encourage environmental responsibility and long-term conservation.',
      },
      {
        icon: 'event-experience',
        title: 'Event Experience',
        body: 'We help plan and communicate an engaging run experience that brings participants, partners and communities together.',
      },
      {
        icon: 'digital-storytelling',
        title: 'Digital Storytelling',
        body: 'We create content that shares the purpose, people and progress behind the movement across digital platforms.',
      },
    ],
  },

  ironSharpensIron: {
    id: 'iron-sharpens-iron',
    logoAlt: 'Iron Sharpens Iron',
    titleLines: ['Portfolio', 'Review'],
    subtitle: 'Progress is never a solo effort.',
    body: 'It happens when people, organisations and ideas come together with a shared purpose. Iron sharpens iron through collaboration, we make each other better, stronger and more effective.',
    paragraphs: [
      'Iron Sharpens Iron is more than a portfolio review. It is a platform for creative minds to challenge one another, exchange perspectives and grow through constructive feedback.',
      'Bringing together creatives, industry professionals and emerging talent, the initiative creates an opportunity to showcase ideas, receive honest critiques, discover new possibilities and refine creative thinking.',
      'It is built on a simple belief: excellence is rarely achieved in isolation. We become better when we learn from others, challenge our thinking and allow our work to be questioned.',
    ],
    posters: [
      ironPoster(1, 'Iron Sharpens Iron portfolio review poster: “Do you want to be an award winning creative?”, 2 May 2026.'),
      ironPoster(2, 'Iron Sharpens Iron portfolio review poster: “Do you live and breathe the creative arts?”, 2 May 2026.'),
      ironPoster(3, 'Iron Sharpens Iron poster: “Think your content is engaging?”, 6 September 2025.'),
      ironPoster(4, 'Iron Sharpens Iron poster: “Do you love for the likes?”, 6 September 2025.'),
    ],
  },
} as const;
