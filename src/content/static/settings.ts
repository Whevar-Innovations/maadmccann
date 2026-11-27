import type { SiteSettings } from '../types';
import { WHAT_WE_DO_IDS } from './whatWeDo';

export const settings: SiteSettings = {
  nav: [
    { label: 'The MAADness', href: '/' },
    { label: 'What We Do', href: '/what-we-do' },
    { label: 'Our Work', href: '/work' },
    { label: 'CSR', href: '/csr' },
    { label: 'Our Partners', href: '/partners' },
    { label: 'The MAAD Ones', href: '/the-maad-ones' },
    { label: 'Blog', href: '/blog' },
    { label: 'Awards', href: '/awards' },
  ],
  navCta: { label: 'Talk To Us', href: '/contact' },
  cta: {
    headlineLines: ['Got something in mind?', 'Let’s make something MAAD.'],
    body: 'Bring us the brief, the challenge or even the “we know something needs to change but we’re not quite sure what.” We’ll take it from there.',
    button: { label: 'Let’s Talk', href: '/contact' },
  },
  footer: {
    navigation: [
      { label: 'The MAADness', href: '/' },
      { label: 'What We Do', href: '/what-we-do' },
      { label: 'Our Work', href: '/work' },
      { label: 'Corporate Social Responsibility', href: '/csr' },
      { label: 'Our Partners', href: '/partners' },
      { label: 'The MAAD Ones', href: '/the-maad-ones' },
      { label: 'Blog', href: '/blog' },
      { label: 'Awards', href: '/awards' },
    ],
    services: [
      { label: 'Creative', href: `/what-we-do#${WHAT_WE_DO_IDS.creative}` },
      { label: 'PR & Reputation Mgt', href: `/what-we-do#${WHAT_WE_DO_IDS.pr}` },
      { label: 'Brand Strategy & Dev’t', href: `/what-we-do#${WHAT_WE_DO_IDS.brandStrategy}` },
      { label: 'Experiential Marketing', href: `/what-we-do#${WHAT_WE_DO_IDS.experiential}` },
      { label: 'Account Management', href: `/what-we-do#${WHAT_WE_DO_IDS.accountManagement}` },
      { label: 'Production', href: `/what-we-do#${WHAT_WE_DO_IDS.production}` },
      { label: 'Media', href: `/what-we-do#${WHAT_WE_DO_IDS.media}` },
      { label: 'Digital', href: `/what-we-do#${WHAT_WE_DO_IDS.digital}` },
      { label: 'SBCC', href: `/what-we-do#${WHAT_WE_DO_IDS.sbcc}` },
    ],
    contact: {
      email: 'maad@maad.co.ug',
      phone: '+256 701 222 522',
      landline: '0414 222 522',
      address: ['Plot 2436, Ntinda', '(off Bukoto–Ntinda Road),', 'Kampala, Uganda'],
    },
    socials: [
      { platform: 'x', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'youtube', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'instagram', url: '#' },
    ],
    copyright: '©{year} MAAD McCANN. All rights reserved.',
  },
};
