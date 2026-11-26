import type { WhatWeDoPage } from '../types';

/**
 * What We Do page copy (from design/MAAD McCANN Website-what_we_do.jpg).
 * Section ids double as deep-link anchors used by the footer SERVICES column.
 */
export const WHAT_WE_DO_IDS = {
  sbcc: 'sbcc',
  digital: 'digital',
  accountManagement: 'account-management',
  media: 'media',
  experiential: 'experiential-marketing',
  brandStrategy: 'brand-strategy',
  pr: 'public-relations',
  creative: 'creative',
  production: 'production',
} as const;

export const whatWeDo: WhatWeDoPage = {
  seo: {
    title: 'What We Do',
    description:
      'Strategy, creative, media, digital, PR, experiential, production and SBCC. Different disciplines, one MAAD mind building brands people notice, remember and choose.',
  },

  hero: {
    headlineLines: ['We do a lot.', 'Average isn’t one of them.'],
    bodyLines: [
      'Strategy. Creative. Media. Digital. PR. Experiences. Different disciplines,',
      'one MAAD mind working together to build brands people notice, remember and choose.',
    ],
  },

  sbcc: {
    id: WHAT_WE_DO_IDS.sbcc,
    title: 'SBCC',
    tagline: 'Change Starts With Understanding People.',
    body: 'We combine research, human insight and community participation to create communication that doesn’t just inform people, but helps shift attitudes, behaviours and social norms for meaningful, lasting change.',
    bullets: [
      'Research',
      'SBCC Strategy',
      'Community Engagement',
      'Campaign Implementation',
      'Human-Centred Design & Co-creation',
      'Message & Material Development',
    ],
    approaches: {
      title: 'Our Approaches',
      body: 'Through our interactive, culturally- appropriate, contextual, multi-layered delivery channels, we co-roll out and scale up campaign platforms, assets and activities that address efficacy, skills and knowledge gaps, agency and barriers at the individual, social and structural levels, generate demand and facilitate social and behavior change.',
    },
    humanCentered: {
      title: 'We’re Human-Centered Design Driven',
      body: 'Through our interactive, culturally- appropriate, contextual, multi-layered delivery channels, we co-roll out and scale up campaign platforms, assets and activities that address efficacy, skills and knowledge gaps, agency and barriers at the individual, social and structural levels, generate demand and facilitate social and behavior change.',
    },
    strength: {
      title: 'Our Strength',
      paragraphs: [
        'Being a creative design and media-oriented firm with inhouse capacity of Graphic Designers, Creative Directors, Art Directors, Illustrators, Motion Graphics Animators, Audio-Visual Production Specialists, Photographers, Copywriters, Content Creators, Brand Managers, Strategists, Business Developers, Media Planners and Buyers, Translators, Digital, Human-Center Design and SBCC Practitioners, we efficiently and expeditiously co-design, co-pretest and co-produce SBCC assets, brands, platforms and solutions.',
        'We have a good working relationship with all media houses across the country which enables us to secure better media deals for our partners.',
        'We also have a network of professional translators which enables us to translate materials in all languages spoken across Uganda and East Africa.',
      ],
    },
    experience: {
      title: 'Our Experience',
      body: 'Over the last 17 years, we have amassed multitudes of experience in working with partners and stakeholders at the national, regional and local levels to co-design and co-roll out SBCC campaigns across thematic areas, such Maternal and Child Health, Governance, HIV/AIDS, Conservation, Sexual Reproductive Health and Rights, Livelihoods, Malaria, Financial Literacy, Agriculture, Nutrition, WASH, Education, Gender and Social Inclusion and Renewable and Clean Energy.',
    },
  },

  digital: {
    id: WHAT_WE_DO_IDS.digital,
    title: 'Digital',
    tagline: 'Stop The Scroll. Start Something.',
    intro:
      'Data tells us where to go. Creativity gets people to stop, engage & act. Together, they turn attention into conversations, communities and results.',
    pills: [
      ['Digital', 'Media', 'Strategy'],
      ['Digital', 'Media', 'Buying'],
      ['Social', 'Media', 'Management'],
    ],
    leftParagraphs: [
      'Someone discovers your brand through a reel. Someone else searches for your website. Another trusts a creator’s recommendation enough to give you a try. At MAAD, our Digital Department brings these moments together, helping brands get noticed, build relationships and turn interest into business.',
      'It starts with digital strategy: understanding your audience, your ambitions and where the opportunities lie. We give each platform, campaign and piece of content a clear purpose, bringing creativity, strategy and insight together to guide how your brand shows up online.',
    ],
    rightParagraphs: [
      'Through content creation, we turn that direction into stories people want to spend time with. Think snackable videos, compelling visuals, sharp copy and timely content that taps into everyday life. We find the connection between what a brand wants to say and what its audience actually cares about.',
      'Our social media management keeps that connection alive. We plan, publish, listen and engage, making space for conversations that build familiarity and trust. Through analytics, we track how audiences respond and use those insights to sharpen the next move.\nWe also handle influencer sourcing and engagement, connecting brands with creators whose voices, audiences and personalities fit. From identifying the right partners to briefing, coordinating and evaluating their work, we help turn creator collaborations into credible, engaging brand stories.',
      'Our website and app development gives audiences somewhere useful to land, explore and take action. We create digital experiences that make it easier to find information, make an enquiry or complete a purchase. Performance marketing brings those experiences to the right people through targeted campaigns, with ongoing testing and optimisation to improve results and make budgets count.',
    ],
  },

  accountManagement: {
    id: WHAT_WE_DO_IDS.accountManagement,
    title: 'Account Management',
    taglineLines: ['Good Work Starts With People', 'Who Get Your Business.'],
    body: 'We get to know your business inside out, then bring the right people, thinking and expertise together to move your brand forward.',
  },

  media: {
    id: WHAT_WE_DO_IDS.media,
    title: 'Media',
    taglineLines: ['Right Message. Right Place.', 'Right Moment.'],
    body: 'We don’t buy media just to be seen. We use data, audience insight and smart planning to find the moments that matter and make every placement count.',
    servicesLines: ['Media Planning.  Media Buying.', 'Strategy. Execution. Media Monitoring.'],
  },

  experiential: {
    id: WHAT_WE_DO_IDS.experiential,
    titleLines: ['Experiential', 'Marketing'],
    taglineLines: ['Some Brands You See.', 'Great Ones You Experience.'],
    body: 'We take brands off the screen and into the real world, creating experiences that bring people closer, get them involved and give them something worth remembering.',
  },

  brandStrategy: {
    id: WHAT_WE_DO_IDS.brandStrategy,
    titleLines: ['Brand Strategy', '& Development'],
    tagline: 'Great Brands Don’t Happen By Accident.',
    body: 'We help brands define what they stand for, understand the people they need to connect with and find a clear, compelling place in the market. From strategy to identity, we build brands designed to stay relevant and grow.',
  },

  pr: {
    id: WHAT_WE_DO_IDS.pr,
    titleLines: ['Public Relations', '& Reputation', 'Management'],
    taglineLines: ['Be Seen. Be Heard.', 'Be Remembered Right.'],
    body: 'We shape stories, build relationships and protect reputations, helping brands show up in the conversations that matter and be remembered for the right reasons.',
    bullets: ['Brand Image & Reputation Management', 'Event Planning', 'Execution & Management'],
  },

  creative: {
    id: WHAT_WE_DO_IDS.creative,
    title: 'Creative',
    tagline: 'The Box Was Never The Point. The Idea Is.',
    body: 'From the first scribble to the final execution, we turn strategy and human insight into ideas people actually want to look at, listen to and talk about.',
    tiles: [
      { icon: 'ideation', labelLines: ['Ideation'] },
      { icon: 'concept', labelLines: ['Concept', 'Development'] },
      { icon: 'graphic-design', labelLines: ['Graphic', 'Design'] },
      { icon: 'animation', labelLines: ['Animation &', 'Motion Design'] },
    ],
  },

  production: {
    id: WHAT_WE_DO_IDS.production,
    title: 'Production',
    tagline: 'From “What If?” To “Watch This.”',
    body: 'We take ideas from “imagine if…” to “there it is,” bringing together the right craft, people and production expertise to turn creative thinking into beautifully executed work across every format.',
    circles: [['Film & TV', 'Radio', 'Photography'], ['Print', 'OOH'], ['Digital & Content Production']],
  },
};
