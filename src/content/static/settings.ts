import type { SiteSettings } from '../types';

export const settings: SiteSettings = {
  nav: [
    { label: 'The MAADness', href: '/the-maadness' },
    { label: 'What We Do', href: '/what-we-do' },
    { label: 'Our Work', href: '/work' },
    { label: 'CSR', href: '/csr' },
    { label: 'Our Partners', href: '/partners' },
    { label: 'The MAAD Ones', href: '/team' },
    { label: 'Blog', href: '/blog' },
    { label: 'Awards', href: '/awards' },
  ],
  navCta: { label: 'Talk To Us', href: '/contact' },
  footer: {
    navigation: [
      { label: 'Let’s Talk', href: '/contact' },
      { label: 'The MAADness', href: '/the-maadness' },
      { label: 'What We Do', href: '/what-we-do' },
      { label: 'Our Work', href: '/work' },
      { label: 'Corporate Social Responsibility', href: '/csr' },
      { label: 'Our Partners', href: '/partners' },
      { label: 'The MAAD Ones', href: '/team' },
      { label: 'Blog', href: '/blog' },
      { label: 'Awards', href: '/awards' },
    ],
    services: [
      { label: 'Creative', href: '#' },
      { label: 'PR & Reputation Mgt', href: '#' },
      { label: 'Brand Strategy & Dev’t', href: '#' },
      { label: 'Experiential Marketing', href: '#' },
      { label: 'Account Management', href: '#' },
      { label: 'Production', href: '#' },
      { label: 'Media', href: '#' },
      { label: 'Digital', href: '#' },
      { label: 'SBCC', href: '#' },
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
    copyright: '© 2026 MAAD McCANN. All rights reserved.',
  },
};
