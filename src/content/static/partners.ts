import type { PartnerLogo, PartnersPage } from '../types';
import { logoImage } from './assets';

/**
 * Our Partners (/partners). Copy is transcribed from "MAAD McCANN Website Our Clients".
 * Logos are cropped from that design's artwork (3x render) into src/assets/img/partners/ as
 * {id}-{width}.webp; swap any of them for the brand's official file under the same name.
 */

const logo = (id: string, name: string, width: number, height: number, href?: string): PartnerLogo => ({
  id,
  name,
  image: logoImage(id, width, height, name),
  ...(href ? { href } : {}),
});

export const partners: PartnersPage = {
  seo: {
    title: 'Our Partners',
    description:
      'The brands and organisations MAAD McCANN partners with across beverages, banking, health, media, telecoms, development and more.',
  },
  hero: {
    headlineLines: ['The best work', 'is never made alone.'],
    subheading: 'The best work happens when ambitious brands and MAAD minds come together.',
  },
  intro:
    'We’ve partnered with brands and organisations across industries to solve challenges, create opportunities and make work that moves people and business forward.',
  filterLabel: 'Filter partners by sector',
  allLabel: 'All',
  labels: {
    announce: 'Showing {count} partners in {sector}',
    announceOne: 'Showing 1 partner in {sector}',
    announceAll: 'Showing all {count} partners',
    viewCaseStudy: 'View case study',
  },
  sectors: [
  {
    id: 'beverages',
    label: 'Beverages',
    logos: [
      logo('diageo', 'Diageo', 266, 67),
      logo('uganda-breweries', 'Uganda Breweries Limited', 206, 191),
      logo('bell', 'Bell Lager', 178, 152),
      logo('johnnie-walker', 'Johnnie Walker', 320, 169),
      logo('tusker-malt', 'Tusker Malt', 192, 199),
      logo('pilsner', 'Pilsner Lager', 182, 225),
      logo('uganda-waragi', 'Uganda Waragi', 158, 181),
      logo('iag', 'Inspire Africa Group', 264, 193),
      logo('coca-cola', 'Coca-Cola', 312, 106),
      logo('rwenzori', 'Rwenzori Bottling Company', 320, 96),
      logo('play', 'Play Energy Drink', 320, 112),
      logo('delisha', 'Delisha', 253, 134),
      logo('tusker-lite', 'Tusker Lite', 161, 175, '/work/tuskerlite-turn-on'),
      logo('guinness', 'Guinness', 162, 176),
      logo('va-sherry', 'V&A Sherry', 134, 177),
      logo('white-cap', 'White Cap', 287, 173),
    ],
  },
  {
    id: 'personal-home-care',
    label: 'Personal, Home & Care',
    logos: [
      logo('unilever', 'Unilever', 215, 237),
      logo('mbw-consulting', 'MBW Consulting', 320, 180),
      logo('movit', 'Movit', 295, 199),
      logo('uganda-baati', 'Uganda Baati', 320, 101, '/work/uganda-baati-crown'),
      logo('casabella', 'Casabella', 320, 93),
    ],
  },
  {
    id: 'banking-financial',
    label: 'Banking & Financial Services',
    filterLabel: 'Banking & Finance',
    logos: [
      logo('western-union', 'Western Union', 320, 100),
      logo('bni', 'BNI', 312, 128),
      logo('mastercard', 'Mastercard', 277, 218),
      logo('ifc', 'International Finance Corporation', 320, 86),
      logo('kcb', 'KCB Bank', 320, 60),
      logo('bank-of-africa', 'Bank of Africa', 320, 196),
      logo('task-managers', 'Task Managers', 320, 147),
      logo('mula', 'Mula', 320, 101),
      logo('tropical-bank', 'Tropical Bank', 320, 144),
      logo('pride-bank', 'Pride Bank', 320, 86, '/work/pride-bank-growing'),
    ],
  },
  {
    id: 'sbcc',
    label: 'Social and Behaviour Change Communication (SBCC)',
    filterLabel: 'SBCC',
    logos: [
      logo('unicef', 'UNICEF', 320, 83),
      logo('spring', 'SPRING', 320, 175),
      logo('chc', 'Communication for Healthy Communities', 320, 76),
      logo('rti', 'RTI International', 320, 134),
      logo('malaria-consortium', 'Malaria Consortium', 320, 157),
      logo('uhmg', 'Uganda Health Marketing Group', 320, 167),
      logo('a4hu', 'Action 4 Health Uganda', 320, 218),
      logo('kcca', 'Kampala Capital City Authority', 282, 230),
      logo('fhri', 'Foundation for Human Rights Initiative', 320, 165),
      logo('ccedu', 'Citizens’ Coalition for Electoral Democracy in Uganda', 320, 107),
      logo('save-the-children', 'Save the Children', 320, 66),
      logo('cdfu', 'Communication for Development Foundation Uganda', 320, 135),
      logo('giz', 'GIZ', 320, 105),
      logo('mission-green', 'Mission Green', 279, 248),
      logo('dgf', 'Democratic Governance Facility', 297, 191),
      logo('pace', 'PACE', 320, 186),
      logo('hanns-neumann', 'Hanns R. Neumann Stiftung', 320, 57),
    ],
  },
  {
    id: 'csr',
    label: 'Corporate Social Responsibility (CSR)',
    filterLabel: 'CSR',
    logos: [
      logo('rotary', 'Rotary', 320, 125),
      logo('red-cross', 'Uganda Red Cross Society', 249, 248),
      logo('run-for-the-nile', 'Run for the Nile', 320, 222),
      logo('kabaka-birthday-run', 'Kabaka Birthday Run', 320, 101),
      logo('philly-lutaaya', 'Philly Lutaaya', 320, 267),
    ],
  },
  {
    id: 'insurance-healthcare',
    label: 'Insurance & Healthcare',
    logos: [
      logo('cipla', 'Cipla', 296, 107),
      logo('lifelink', 'Lifelink', 320, 219),
      logo('aar', 'AAR Insurance', 271, 258),
      logo('case-medcare', 'CASE medCare', 202, 267),
      logo('afrisafe', 'Afrisafe', 320, 193),
      logo('prudential', 'Prudential', 320, 165),
    ],
  },
  {
    id: 'media-entertainment',
    label: 'Media & Entertainment',
    logos: [
      logo('ubc', 'UBC', 312, 166),
      logo('radio-simba', 'Radio Simba', 320, 180),
      logo('new-vision', 'New Vision', 320, 80),
    ],
  },
  {
    id: 'telecom-pay-tv',
    // Soft hyphen: the one-word sector label is wider than the label column at 1920 and up.
    label: 'Tele\u00ADcommunications & Pay TV',
    filterLabel: 'Telecoms & Pay TV',
    logos: [
      logo('multichoice', 'MultiChoice', 320, 199, '/work/gotv-ka-weekie'),
      logo('dstv', 'DStv', 320, 68),
      logo('gotv', 'GOtv', 320, 66, '/work/gotv-ka-weekie'),
    ],
  },
  {
    id: 'tourism-hospitality',
    label: 'Tourism & Hospitality',
    logos: [
      logo('south-african-tourism', 'South African Tourism', 320, 164),
      logo('uganda-convention-bureau', 'Uganda Convention Bureau', 320, 136),
      logo('eagle-stays', 'Eagle Stays', 320, 323),
    ],
  },
  {
    id: 'food-agriculture',
    label: 'Food & Agriculture',
    logos: [
      logo('ugachick', 'Ugachick', 276, 277),
      logo('jesa', 'JESA', 320, 135),
    ],
  },
  {
    id: 'aviation-transport',
    label: 'Aviation & Transport',
    logos: [
      logo('emirates', 'Emirates', 320, 127),
      logo('safarilink', 'Safarilink', 320, 56),
    ],
  },
  {
    id: 'government-public',
    label: 'Government & Public Sector',
    filterLabel: 'Government',
    logos: [
      logo('unbs', 'Uganda National Bureau of Standards', 320, 259),
    ],
  },
  {
    id: 'energy-oil',
    label: 'Energy & Oil',
    logos: [
      logo('totalenergies', 'TotalEnergies', 320, 235),
    ],
  },
  ],
};
