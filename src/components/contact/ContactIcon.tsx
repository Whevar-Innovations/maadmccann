import type { ContactDetailIcon } from '@/content/types';

/** Line icons for the Get In Touch details (drawn in currentColor inside the ringed circle). */
export function ContactIcon({ icon }: { icon: ContactDetailIcon }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: 'size-[48%]',
  };

  switch (icon) {
    case 'location':
      return (
        <svg {...common}>
          <path d="M12 21.5s-7-6.1-7-12a7 7 0 0 1 14 0c0 5.9-7 12-7 12z" />
          <circle cx="12" cy="9.5" r="2.6" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M6.2 3.5h2.6l1.6 4.2-2.1 1.5a11.5 11.5 0 0 0 6.5 6.5l1.5-2.1 4.2 1.6v2.6a2.2 2.2 0 0 1-2.4 2.2A16.8 16.8 0 0 1 4 5.9a2.2 2.2 0 0 1 2.2-2.4z" />
        </svg>
      );
    case 'email':
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="19" height="14" rx="1.2" />
          <path d="M2.8 5.6 12 13l9.2-7.4M2.8 18.4l6.6-6.6M21.2 18.4l-6.6-6.6" />
        </svg>
      );
    case 'hours':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6.8V12h4.2" />
        </svg>
      );
  }
}
