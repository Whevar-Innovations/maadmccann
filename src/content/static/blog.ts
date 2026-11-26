import type { BlogPage, BlogPost, ImageAsset } from '../types';
import { BLOG_POST_SLUGS } from './blogSlugs';

/**
 * Blog copy (/blog and /blog/:slug), from "MAAD McCANN Website BLOG.pdf".
 * Images live in /public/images/blog as {name}-{w}.webp:
 * - card-*: the exact 499 × 334 crops the design shows in the grid.
 * - hero-*: a 4:3 band around the design's wide crop, so phones can show more of the picture;
 *   `heroPosition` lines the band up with the design crop on wide screens.
 * - gayaza-*: the two-up photo row, at the design's 778 × 483 crop.
 */

type Size = readonly [w: number, h: number];

/** Builds an ImageAsset from the {name}-{w}.webp set; `src` is the size nearest 960px as the fallback. */
function set(name: string, sizes: readonly Size[], alt: string, lqip: string): ImageAsset {
  const largest = sizes[sizes.length - 1];
  if (!largest) throw new Error(`Blog image "${name}" has no sizes`);
  const fallback = sizes.reduce((a, b) => (Math.abs(b[0] - 960) < Math.abs(a[0] - 960) ? b : a));
  return {
    src: `/images/blog/${name}-${fallback[0]}.webp`,
    srcSet: sizes.map(([w]) => `/images/blog/${name}-${w}.webp ${w}w`).join(', '),
    width: largest[0],
    height: largest[1],
    alt,
    lqip,
  };
}

const CARD: readonly Size[] = [
  [520, 348],
  [780, 522],
  [1040, 696],
];

export const blog: BlogPage = {
  seo: {
    title: 'Blog',
    description:
      'Where truth meets bold execution. Explore our latest thinking on brand strategy, creative innovation, and the stories shaping markets across the region.',
  },

  ogImage: '/images/blog/hero-iron-sharpens-iron-1280.webp',

  hero: {
    headlineLines: ['Ideas that move culture,', 'Strategies that drive growth'],
    subheading:
      'Where truth meets bold execution. Explore our latest thinking on brand strategy, creative innovation, and the stories shaping markets across the region.',
  },

  notFound: {
    title: 'We couldn’t find that article',
    body: 'It may have moved, or the link may be mistyped. Our latest stories are on the Blog.',
    backLabel: 'Back to the Blog',
  },

  postsLabel: 'Articles',

  posts: [
    {
      slug: 'iron-sharpens-iron',
      date: '2026-06-24',
      dateLabel: 'June 24, 2026',
      category: 'Learning Strategy',
      titleLead: 'Iron Sharpens Iron:',
      titleRest: 'Giving Creative Talent Room to Grow',
      card: set(
        'card-iron-sharpens-iron',
        [
          [520, 348],
          [780, 522],
          [953, 638],
        ],
        'Iron Sharpens Iron participants and the MAAD McCANN team crossing their arms in front of a painted wall.',
        'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAABwBACdASoYABAAPu1iqk4ppaQiMAgBMB2JbACdMoADTs4KQ075SZ/Da/IGAAD+juZ4d+msHX4trM7crPpckMAcr8iJNETkG2y8bpc2IwhK+pfFLPTmgAAA',
      ),
      hero: set(
        'hero-iron-sharpens-iron',
        [
          [640, 480],
          [960, 720],
          [1280, 960],
          [1591, 1193],
        ],
        'Emerging creatives and the MAAD McCANN team at an Iron Sharpens Iron portfolio review, arms crossed in the initiative’s signature pose.',
        'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAACwBACdASoYABIAPu1kpU4ppaMiMBgMATAdiUATpmQwNTNh1CvQglOa0rh6WdOAAP5Rh/Y0GQq8jFejZuS5TJ2zo0eM8/XYV1/PbUABRPSpSabBUVYoxj9it8IKlVE5yZ+vVA4RMqAAAA==',
      ),
      heroPosition: '50% 53.7%',
      heroRatio: '1582 / 647',
      lockup: 'iron-sharpens-iron',
      paragraphs: [
        'Every great creative has a story about someone who challenged their thinking, believed in their potential or gave them a chance to grow. Sometimes, all it takes is an honest conversation about their work.',
        'That belief inspired Iron Sharpens Iron, our portfolio review initiative, which has been connecting emerging creatives with experienced industry professionals since 2016.',
        'The concept is simple. Young designers, photographers, writers and other creative talents bring their portfolios, ideas and ambitions. Our team brings years of experience, practical guidance and constructive feedback.',
        'The conversations go beyond whether a design looks good or an idea sounds exciting. We explore the thinking behind the work, the quality of execution, creative problem-solving and how participants can better position themselves for opportunities in the industry.',
        'Uganda has no shortage of creative talent. What many emerging professionals need is access to experienced practitioners who can help bridge the gap between raw potential and professional readiness.',
        'Over the years, the initiative has welcomed students, graduates, freelancers and young professionals, helping them strengthen their portfolios, build connections and gain confidence. Some have even gone on to join our team, including graphic designer Benard Okello, who first participated as a student in 2016 before joining the agency in 2019.',
        'Learning goes both ways. Mentoring emerging talent challenges our own people to rethink their approaches, share knowledge and rediscover the excitement of creativity.',
        'After all, iron sharpens iron.',
        'For us, growing the creative industry is about more than producing great work today. It is also about helping develop the people who will create even better work tomorrow.',
      ],
      seo: {
        title: 'Iron Sharpens Iron: Giving Creative Talent Room to Grow',
        description:
          'Since 2016, our Iron Sharpens Iron portfolio reviews have connected emerging Ugandan creatives with experienced industry professionals for honest, constructive feedback.',
      },
    },
    {
      slug: 'run-for-the-nile',
      date: '2026-07-03',
      dateLabel: 'July 03, 2026',
      category: 'Running For Cause',
      titleLead: 'Run for the Nile:',
      titleRest: 'Showing Up for a River That Gives Us So Much',
      card: set(
        'card-run-for-the-nile',
        CARD,
        'Two runners in Run for the Nile 2026 vests against an illustrated river landscape.',
        'data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAABQBACdASoYABAAPu1kqk4ppaQiMAgBMB2JaACdMoACtXY7I3A62U4wWvoAAP7qlq0KPVtwsPIYtiEgxD2MHFcxrC5PAd8hXhlKCQOAdhQFMwzHW23Rml4rvHNlhDqE0RUvnKd5MdY4/wbznWK+jIwGcanAAA==',
      ),
      hero: set(
        'hero-run-for-the-nile',
        [
          [640, 480],
          [960, 720],
          [1280, 960],
          [1600, 1200],
          [2000, 1500],
          [2400, 1800],
        ],
        'Run for the Nile 2026 key visual: two smiling runners in “Run for the Nile, to protect Lake Victoria” vests, with the river and green hills behind them.',
        'data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAADwBACdASoYABIAPu1wsFIppiSiqAgBMB2JZACxHzLxgCTQrG1uwuHqiLFVqHAwy+AA/usBvRTmBQQr+ioH6G+6L/9XNBe/+LSOj1zaaDNrmq1zR5bHvTkGsREBf0kR1cb5HMTQITrGa/dNKWkBj43zQ4kS+EnNgyuGHSAxgAAAAA==',
      ),
      heroPosition: '50% 50%',
      heroRatio: '1582 / 647',
      lockup: 'run-for-the-nile',
      paragraphs: [
        'The River Nile is more than a national landmark. It supports livelihoods, sustains communities and forms part of Uganda’s natural heritage. Yet pollution, deforestation and increasing human activity continue to threaten its future.',
        'Run for the Nile is a reminder that protecting this extraordinary resource is everyone’s responsibility.',
        'Organized by the Rotary Club of Jinja alongside other Rotary clubs and partners, the initiative brings together individuals, businesses and communities to raise awareness and mobilize resources for conservation efforts around the Nile and Lake Victoria.',
        'Beyond the excitement of the run, the initiative supports practical interventions, including tree planting, environmental education, community cleanups and efforts to reduce plastic pollution entering vital water systems.',
        'In 2026, we strengthened our commitment to the cause with a contribution valued at UGX 50 million, supporting the fourth edition of Run for the Nile and its environmental conservation objectives.',
        'Our involvement reflects a belief that communication should do more than attract attention. It should inspire people to care, participate and take meaningful action.',
        'What makes Run for the Nile particularly powerful is its ability to turn a complex environmental challenge into something everyone can participate in. You do not have to be an environmental expert to make a difference. Sometimes, showing up, lending your voice or changing a small everyday habit is where meaningful action begins.',
        'The Nile has given generations of Ugandans so much. Protecting it is one way of ensuring it continues to do so for generations to come.',
        'And that is a cause worth running for.',
      ],
      seo: {
        title: 'Run for the Nile: Showing Up for a River That Gives Us So Much',
        description:
          'Why we back Run for the Nile: a Rotary-led movement turning the conservation of the River Nile and Lake Victoria into something everyone can take part in.',
      },
    },
    {
      slug: 'rotary-cancer-run',
      date: '2026-06-24',
      dateLabel: 'June 24, 2026',
      category: 'Better Communities',
      titleLead: 'Rotary Cancer Run:',
      titleRest: 'Much More Than a Run, a Commitment That Endures',
      card: set(
        'card-rotary-cancer-run',
        CARD,
        'Rotary Cancer Run “Ggwanga Mujje” poster with a smiling runner.',
        'data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAABQBACdASoYABAAPu1krU2ppaSiMAgBMB2JbACdMoADS/bkSdZJe4lk6BPAAP62n5PaSQVHhrV29VseRLceV/2ysTKHI3CXvVBXWBp+jC9OEpDXfNO4YktahDTncvSGz8hX/Kr7b/hQs+4fcXmPqhMo8Iza+AAA',
      ),
      hero: set(
        'hero-rotary-cancer-run',
        [
          [640, 480],
          [960, 720],
          [1280, 960],
          [1600, 1200],
          [2000, 1500],
        ],
        'Rotary Cancer Run 2026 poster, “Ggwanga Mujje, let’s run to restore hope”: proceeds go towards completing the Cancer Centre at Nsambya Hospital. Kololo Independence Grounds and major towns, 6:00am, Sunday 30 August 2026.',
        'data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAACQBQCdASoYABIAPu1mqk2ppaQiMAgBMB2JagCdMuukfDwFZztZLvfh6b7uUzh4LHJjlna48AD+10lm5b3ruljXyYudXXkVOPU84i8j6gJs755yd1fVah7JFVQRSGjKXaUhWPH6HZv/ahZy+89tGCdoX7H0NqvcqX7Hj++rIyXwWA3eqdJLZRwSePnwXSAA',
      ),
      heroPosition: '50% 49.9%',
      heroRatio: '1582 / 907',
      lockup: 'rotary-cancer-run',
      paragraphs: [
        'Almost everyone has a story about cancer. A family member undergoing treatment, a friend who survived or someone whose life was cut short. It is a disease whose impact reaches far beyond the person diagnosed.',
        'For over 12 years, we have proudly supported the Rotary Cancer Run, one of Uganda’s most recognizable initiatives mobilizing communities and resources in the fight against cancer.',
        'What began as a fundraising event has grown into a powerful movement, bringing together thousands of Ugandans annually to raise awareness, encourage participation and support better access to cancer care.',
        'Over the years, the initiative has raised billions of shillings and contributed to important healthcare investments, including a dedicated cancer ward at St. Francis Hospital Nsambya.',
        'Our role has been to help keep the cause visible and relevant through creative communication, public relations and campaign support, while encouraging our own people to participate.',
        'But beyond the campaigns and running kits, this partnership is about the people behind the statistics: patients seeking treatment, families navigating difficult diagnoses and communities learning the importance of early detection and timely medical care.',
        'The Rotary Cancer Run demonstrates what sustained collaboration between businesses, volunteers, healthcare institutions and ordinary citizens can achieve.',
        'It also reminds us that meaningful impact takes consistency. A single event cannot solve Uganda’s cancer burden, but years of collective effort can help improve awareness, mobilize resources and strengthen access to care.',
        'For us, this has never been about showing up once for a good cause. It is about standing alongside a movement that continues to make a difference.',
        'We run for those fighting, those who have survived and those we remember.',
        'And we keep showing up because the cause still matters.',
      ],
      seo: {
        title: 'Rotary Cancer Run: Much More Than a Run, a Commitment That Endures',
        description:
          'For over 12 years we have supported the Rotary Cancer Run, keeping the cause visible as it mobilises Ugandans and resources in the fight against cancer.',
      },
    },
    {
      slug: 'inspiring-the-next-generation-at-gayaza-high-school',
      date: '2026-07-03',
      dateLabel: 'July 03, 2026',
      category: 'Professional Growth',
      titleLead: 'Inspiring the Next Generation at',
      titleRest: 'Gayaza High School',
      card: set(
        'card-gayaza',
        CARD,
        'Gayaza High School students laughing inside a MAAD McCANN “We’re in the right frame of mind for future success” photo frame.',
        'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQBACdASoYABAAPu1mqk4ppaOiMAgBMB2JbACdLwABeWinMEtfyCLXQAD+Vr3NZkcxx/BZ+6TgcFUzrexPBXbIhisBJLNn6qby6Vzzsiv9mT5A0r2Ru99A/Lec13YhAs31Dz/XwXAAAA==',
      ),
      hero: set(
        'hero-gayaza',
        [
          [640, 429],
          [960, 643],
          [1280, 858],
          [1600, 1072],
          [2000, 1341],
        ],
        'A MAAD McCANN team member talks to Gayaza High School students beside a screen titled “What to study to join”, which maps agency departments to relevant subjects.',
        'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAACwAwCdASoYABAAPu1kq04ppaQiMAgBMB2JYwDCgBt8cXHJ3x7WgAD+l2YUIWvceWVIDIxoCLCux3GQl2K948AINh4SsWQ/VWDMFC1NMZnLXqbSNAo+CfpYuMIf5gAA',
      ),
      heroPosition: '50% 53.6%',
      heroRatio: '1582 / 737',
      gallery: [
        set(
          'gayaza-photo-frame',
          [
            [480, 298],
            [800, 497],
            [1200, 745],
            [1600, 993],
          ],
          'Gayaza High School students laughing inside a MAAD McCANN photo frame that reads “We’re in the right frame of mind for future success”.',
          'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABwAwCdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdAAoxOoGTPwAA/lbJChVUxdww4AUF/hABMVu8Jh3XRluIkmxXhSUlZE9y9qYyfIjNmaCa2F96zdn7BufPqAA=',
        ),
        set(
          'gayaza-handshake',
          [
            [480, 298],
            [800, 497],
            [1200, 745],
            [1600, 994],
          ],
          'A Gayaza High School student shakes hands with a MAAD McCANN team member in front of a colourful “Let’s make you the talk” backdrop.',
          'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAwCdASoYAA8APu1iqU2ppaOiMAgBMB2JaAC7IIjBrM6+wD47XyAA/KoWDM0K0pkmKDfb2U2Q7iy6VXiQ/ikYdBVwpCZQK1Jc4TLwe3w1cKopg+WVL7dLbFdyRa6IWMvY0eVzWJloKycAAAA=',
        ),
      ],
      paragraphs: [
        'Think back to your secondary school days. The ambitions were big, the possibilities endless, but the questions about the future were just as many.',
        'What career should I pursue? What am I good at? What does success look like beyond school?',
        'Sometimes, hearing from someone who has navigated those questions can make all the difference.',
        'That is the thinking behind our annual mentorship program at Gayaza High School, where members of our team engage young women in conversations about careers, personal development, leadership and life beyond the classroom.',
        'Drawing on experiences across advertising, strategy, digital communication, public relations, media and business management, our team shares practical lessons about professional life, the opportunities available and the skills needed to navigate an evolving world of work.',
        'The conversations are not simply about choosing careers. They explore confidence, curiosity, discipline, resilience and the importance of discovering one’s strengths.',
        'We also make room for honest conversations about setbacks, mistakes and the unexpected turns that careers sometimes take. Young people deserve to know that success rarely follows a perfectly straight line.',
        'Gayaza High School has a remarkable legacy of nurturing women who have gone on to make meaningful contributions across different sectors. Being part of that journey, even in a small way, is something we value deeply.',
        'And the experience is equally rewarding for our team. The students’ questions, curiosity and fresh perspectives remind us why sharing knowledge matters.',
        'We may not know which paths these young women will eventually pursue, but we hope our conversations leave them more confident about the possibilities ahead.',
        'Because mentorship is not about telling young people what to become. It is about helping them recognize just how much they can become.',
      ],
      seo: {
        title: 'Inspiring the Next Generation at Gayaza High School',
        description:
          'Our annual mentorship program at Gayaza High School: honest conversations with young women about careers, confidence and life beyond the classroom.',
      },
    },
  ],
};

// vite.config.ts lists /blog/:slug in the sitemap from blogSlugs.ts: fail fast if it drifts.
const slugs = blog.posts.map((post: BlogPost) => post.slug);
if (slugs.join('|') !== BLOG_POST_SLUGS.join('|')) {
  throw new Error(`blogSlugs.ts is out of sync with blog.ts: [${slugs.join(', ')}]`);
}
