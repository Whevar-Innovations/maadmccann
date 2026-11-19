import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router';
import darkMotifBgSrc from '@/assets/img/dark-motif-bg.webp';
import maadLogoWhiteSrc from '@/assets/svg/maad-logo-white.svg';
import { gsap, MEDIA_QUERIES, ScrollTrigger } from './gsap-setup';
import { useSmoothScroll } from './SmoothScroll';
import { EASE, TRANSITION } from './tokens';

export type PageTransitionContextValue = {
  navigateWithTransition: (to: string, label?: string) => void;
  isTransitioning: boolean;
};

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export function usePageTransition(): PageTransitionContextValue {
  return useContext(PageTransitionContext);
}

export type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Dual-layer curtain page transition benchmarked on befreaky.co and SPEC §8.8.
 * - Outgoing page recedes (y: -24px, scale: 0.985, opacity: 0.55, 0.6s expo.inOut).
 * - Dual brand maroon curtain wipes from bottom (crimson-800 accent + crimson-950 main).
 * - Centered white MAAD mark rises into view.
 * - Waits for route mount & loader idle, resets scroll to top, refreshes ScrollTrigger.
 * - Curtain wipes off top (0.6s expo.inOut) as incoming page rises into place.
 * - prefers-reduced-motion: clean 0.2s crossfade.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const targetPathRef = useRef<string | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const curtainAccentRef = useRef<HTMLDivElement | null>(null);
  const curtainMainRef = useRef<HTMLDivElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const { stopScroll, startScroll, scrollToTop } = useSmoothScroll();

  // Reset curtains on mount
  useEffect(() => {
    if (curtainAccentRef.current && curtainMainRef.current && logoWrapperRef.current) {
      gsap.set([curtainAccentRef.current, curtainMainRef.current], {
        yPercent: 100,
        visibility: 'hidden',
      });
      gsap.set(logoWrapperRef.current, {
        yPercent: 100,
        opacity: 0,
      });
    }
  }, []);

  const runReveal = useCallback(() => {
    const stage = stageRef.current;
    const accent = curtainAccentRef.current;
    const main = curtainMainRef.current;
    const logo = logoWrapperRef.current;

    const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;

    if (reduced) {
      if (stage) {
        gsap.to(stage, {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            isTransitioningRef.current = false;
            setIsTransitioning(false);
            targetPathRef.current = null;
            startScroll();
            ScrollTrigger.refresh();
          },
        });
      } else {
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        targetPathRef.current = null;
        startScroll();
      }
      return;
    }

    if (!accent || !main || !stage || !logo) {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      targetPathRef.current = null;
      startScroll();
      return;
    }

    // Prepare incoming stage position
    gsap.set(stage, {
      y: TRANSITION.pageEnterY,
      scale: TRANSITION.pageScale,
      opacity: 0.7,
    });

    const revealTl = gsap.timeline({
      onComplete: () => {
        // Reset curtains back to bottom for the next transition
        gsap.set([accent, main], {
          yPercent: 100,
          visibility: 'hidden',
        });
        gsap.set(logo, {
          yPercent: 100,
          opacity: 0,
        });
        gsap.set(stage, {
          clearProps: 'transform,scale,opacity',
        });

        isTransitioningRef.current = false;
        setIsTransitioning(false);
        targetPathRef.current = null;
        startScroll();
        ScrollTrigger.refresh();
      },
    });

    timelineRef.current = revealTl;

    // Logo exits upward
    revealTl.to(
      logo,
      {
        yPercent: -100,
        opacity: 0,
        duration: 0.35,
        ease: EASE.loaderLogoOut,
      },
      0,
    );

    // Primary maroon curtain wipes off the top
    revealTl.to(
      main,
      {
        yPercent: -100,
        duration: TRANSITION.revealDur,
        ease: EASE.inOut,
      },
      0.08,
    );

    // Accent curtain wipes off the top following main
    revealTl.to(
      accent,
      {
        yPercent: -100,
        duration: TRANSITION.revealDur,
        ease: EASE.inOut,
      },
      0.08 + TRANSITION.layerLead,
    );

    // Incoming page rises smoothly into resting position
    revealTl.to(
      stage,
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: TRANSITION.revealDur,
        ease: EASE.out,
      },
      0.14,
    );
  }, [startScroll]);

  // Listen for route loader completion when transitioning
  useEffect(() => {
    if (!isTransitioningRef.current || !targetPathRef.current) return;

    // Check if we reached the target route and navigation is idle
    const currentPath = location.pathname;
    const target = targetPathRef.current;

    if (
      (currentPath === target || currentPath === target.replace(/\/$/, '')) &&
      navigation.state === 'idle'
    ) {
      // Scroll to top immediately while covered by the curtain
      scrollToTop();

      // Wait one animation frame for React DOM to render new route components
      const rafId = requestAnimationFrame(() => {
        runReveal();
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [location.pathname, navigation.state, scrollToTop, runReveal]);

  // Safety fallback: if navigation stalls or route fails, ensure curtains never get stuck
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      if (isTransitioningRef.current) {
        scrollToTop();
        runReveal();
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [isTransitioning, scrollToTop, runReveal]);

  const navigateWithTransition = useCallback(
    (to: string) => {
      if (isTransitioningRef.current) return;

      const currentPath = location.pathname;
      const cleanTarget = (to.split('#')[0] ?? '').split('?')[0] ?? '';

      // If navigating to the exact same page, smoothly scroll to top
      if (cleanTarget === currentPath) {
        scrollToTop();
        return;
      }

      const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;

      isTransitioningRef.current = true;
      targetPathRef.current = cleanTarget;
      setIsTransitioning(true);
      stopScroll();

      if (reduced) {
        const stage = stageRef.current;
        if (stage) {
          gsap.to(stage, {
            opacity: 0,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
              navigate(to);
            },
          });
        } else {
          navigate(to);
        }
        return;
      }

      const stage = stageRef.current;
      const accent = curtainAccentRef.current;
      const main = curtainMainRef.current;
      const logo = logoWrapperRef.current;

      if (!stage || !accent || !main || !logo) {
        navigate(to);
        return;
      }

      // Make curtains visible and set initial positions
      gsap.set([accent, main], {
        visibility: 'visible',
        yPercent: 100,
      });
      gsap.set(logo, {
        yPercent: 80,
        opacity: 0,
      });

      const coverTl = gsap.timeline({
        onComplete: () => {
          navigate(to);
        },
      });

      timelineRef.current = coverTl;

      // 1. Outgoing page gently recedes
      coverTl.to(
        stage,
        {
          y: TRANSITION.pageRecedeY,
          scale: TRANSITION.pageScale,
          opacity: 0.55,
          duration: TRANSITION.coverDur,
          ease: EASE.inOut,
        },
        0,
      );

      // 2. Accent crimson-800 curtain sweeps from bottom
      coverTl.to(
        accent,
        {
          yPercent: 0,
          duration: TRANSITION.coverDur - TRANSITION.layerLead,
          ease: EASE.inOut,
        },
        0,
      );

      // 3. Primary brand maroon crimson-950 curtain follows
      coverTl.to(
        main,
        {
          yPercent: 0,
          duration: TRANSITION.coverDur,
          ease: EASE.inOut,
        },
        TRANSITION.layerLead,
      );

      // 4. White MAAD mark rises into center
      coverTl.to(
        logo,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.45,
          ease: EASE.out,
        },
        TRANSITION.layerLead + 0.18,
      );
    },
    [location.pathname, navigate, stopScroll, scrollToTop],
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {/* Page content wrapper with hardware-accelerated transforms during transition */}
      <div
        ref={stageRef}
        data-page-stage
        className={`w-full ${isTransitioning ? 'will-change-[transform,opacity]' : ''}`}
      >
        {children}
      </div>

      {/* Transition curtains (fixed over viewport) */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[9990] transition-opacity duration-200 ${
          isTransitioning ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Accent dark leading lip */}
        <div
          ref={curtainAccentRef}
          data-curtain-accent
          style={{ visibility: 'hidden', transform: 'translateY(100%)' }}
          className="fixed inset-0 z-[9991] bg-[#1a1a1e] will-change-transform"
        />

        {/* Primary dark blackish curtain */}
        <div
          ref={curtainMainRef}
          data-curtain-main
          style={{ visibility: 'hidden', transform: 'translateY(100%)' }}
          className="fixed inset-0 z-[9992] flex items-center justify-center bg-[#0E0E10] will-change-transform"
        >
          {/* Subtle brand motif in curtain */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${darkMotifBgSrc})` }}
          />

          {/* Centered logo mark */}
          <div className="relative z-10 flex flex-col items-center overflow-hidden px-6 py-4">
            <div
              ref={logoWrapperRef}
              data-transition-logo
              className="flex flex-col items-center will-change-transform"
            >
              <img
                src={maadLogoWhiteSrc}
                alt="MAAD McCANN"
                width={220}
                height={26}
                className="h-6 w-auto sm:h-7"
              />
              <span className="mt-3.5 text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-paper/70 uppercase">
                TRUTH WELL TOLD
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
