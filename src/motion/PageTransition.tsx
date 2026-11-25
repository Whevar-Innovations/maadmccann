import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { gsap, MEDIA_QUERIES, ScrollTrigger } from './gsap-setup';
import { useSmoothScroll } from './SmoothScroll';
import { EASE, TRANSITION } from './tokens';

export type NavigateOptions = {
  /** The clicked element (the link). Reserved for shared-element transitions. */
  trigger?: HTMLElement;
};

export type PageTransitionContextValue = {
  /** Navigate to an internal href. Name kept so existing callers don't change. */
  navigateWithTransition: (to: string, options?: NavigateOptions) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateWithTransition: () => {},
});

export function usePageTransition(): PageTransitionContextValue {
  return useContext(PageTransitionContext);
}

export type PageTransitionProps = {
  children: ReactNode;
  /** Fixed UI (the site header) rendered inside the navigation context, outside the page wrapper. */
  outsideStage?: ReactNode;
};

const prefersReducedMotion = () => window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;

/**
 * Page navigation: the current page recedes (slides up a touch, scales down, fades), the router
 * swaps the route, then the new page rises into place while its own entrances (hero, headings,
 * grids) play on top. The fixed header sits outside the stage so it never moves.
 * - Same page + #anchor: smooth-scrolls to the anchor. Same page, no anchor: back to the top.
 * - Back/forward: no exit, the new page still rises in.
 * - Reduced motion: a plain 0.2s crossfade each way.
 */
export function PageTransition({ children, outsideStage }: PageTransitionProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { scrollToHash, scrollToTop, stopScroll, startScroll } = useSmoothScroll();

  const stageRef = useRef<HTMLDivElement | null>(null);
  const transitioningRef = useRef(false);
  const lockedRef = useRef(false);
  const releaseTimerRef = useRef<number | undefined>(undefined);
  const lastPathRef = useRef(pathname);

  const lock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    stopScroll();
  }, [stopScroll]);

  const unlock = useCallback(() => {
    window.clearTimeout(releaseTimerRef.current);
    transitioningRef.current = false;
    if (!lockedRef.current) return;
    lockedRef.current = false;
    startScroll();
  }, [startScroll]);

  const navigateWithTransition = useCallback(
    (to: string) => {
      const target = (to.split('#')[0] ?? '').split('?')[0] || pathname;
      const hash = to.includes('#') ? to.slice(to.indexOf('#')) : '';

      if (target === pathname) {
        if (hash && scrollToHash(hash)) {
          navigate(to, { replace: true, preventScrollReset: true });
        } else {
          scrollToTop({ smooth: true });
        }
        return;
      }

      const stage = stageRef.current;
      if (transitioningRef.current) return;
      if (!stage) {
        navigate(to);
        return;
      }

      transitioningRef.current = true;
      lock();
      // If the route never lands (loader error), give the page and scrolling back.
      releaseTimerRef.current = window.setTimeout(() => {
        gsap.set(stage, { clearProps: 'transform,opacity' });
        unlock();
      }, TRANSITION.releaseMs + 1000 * TRANSITION.coverDur);

      const reduced = prefersReducedMotion();
      gsap.to(stage, {
        opacity: 0,
        ...(reduced
          ? { duration: TRANSITION.reducedFade, ease: EASE.soft }
          : {
              y: TRANSITION.pageRecedeY,
              scale: TRANSITION.pageScale,
              duration: TRANSITION.coverDur,
              ease: EASE.softInOut,
            }),
        overwrite: 'auto',
        onComplete: () => navigate(to),
      });
    },
    [pathname, navigate, scrollToHash, scrollToTop, lock, unlock],
  );

  // Enter: runs before paint on every route change (link, back or forward).
  useLayoutEffect(() => {
    // Skip the initial mount (and StrictMode's second pass): only real route changes animate.
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = prefersReducedMotion();
    lock();
    gsap.fromTo(
      stage,
      reduced ? { opacity: 0 } : { opacity: 0, y: TRANSITION.pageEnterY },
      {
        opacity: 1,
        y: 0,
        duration: reduced ? TRANSITION.reducedFade : TRANSITION.revealDur,
        ease: reduced ? EASE.soft : EASE.out,
        overwrite: 'auto',
        // Leave no transform behind: fixed children and ScrollTrigger pins must not be affected.
        clearProps: 'transform,opacity',
        onComplete: () => {
          unlock();
          ScrollTrigger.refresh();
        },
      },
    );
  }, [pathname, lock, unlock]);

  useEffect(() => () => window.clearTimeout(releaseTimerRef.current), []);

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition }}>
      {outsideStage}
      <div ref={stageRef} data-page-stage className="w-full">
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
