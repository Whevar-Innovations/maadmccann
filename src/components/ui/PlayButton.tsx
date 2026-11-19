import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type PlayButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Cream circle with a maroon play triangle. A soft ring pulses at idle
 * (disabled for reduced motion); hover grows the disc and the triangle.
 */
export const PlayButton = forwardRef<HTMLButtonElement, PlayButtonProps>(
  function PlayButton({ className = '', ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={`group/play absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-cream text-crimson-800 shadow-[0_12px_40px_rgb(0_0_0/0.35)] transition-[scale,box-shadow,background-color,color] duration-500 ease-out hover:scale-110 hover:bg-crimson-800 hover:text-cream focus-visible:scale-110 focus-visible:bg-crimson-800 focus-visible:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:h-32 sm:w-32 lg:h-40 lg:w-40 ${className}`.trim()}
        {...props}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-cream/70 group-hover/play:border-crimson-600 motion-safe:animate-[play-ring_2.4s_ease-out_infinite] group-hover/play:animate-none group-hover/play:opacity-0"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="ml-[6%] h-[34%] w-[34%] fill-current transition-transform duration-500 ease-out group-hover/play:scale-110"
        >
          <path d="M6 3.5v17a1 1 0 0 0 1.5.86l14.5-8.5a1 1 0 0 0 0-1.72L7.5 2.64A1 1 0 0 0 6 3.5Z" />
        </svg>
      </button>
    );
  },
);
