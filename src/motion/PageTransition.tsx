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
import {
  boxOf,
  createOverlay,
  findSharedSource,
  SHARED_TARGET_SELECTOR,
  viewportBox,
  type SharedOverlay,
} from './sharedTransition';
import { EASE, SHARED_TRANSITION, TRANSITION } from './tokens';

/** True while a tile image is expanding into the destination page (the page skips its own hero entrance). */
export const SHARED_ACTIVE_ATTR = 'sharedTransition';
export const isSharedTransitionActive = () => SHARED_ACTIVE_ATTR in document.documentElement.dataset;

export type NavigateOptions = {
  /** The clicked link. Its `[data-shared-image]` child is the shared element, if any. */
  trigger?: HTMLElement;
  /** The destination has a `[data-shared-target]` frame, so the tile image can expand into it. */
  shared?: boolean;
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
  const sharedRef = useRef<SharedOverlay | null>(null);

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
    (to: string, options?: NavigateOptions) => {
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
      releaseTimerRef.current = window.setTimeout(
        () => {
          gsap.set(stage, { clearProps: 'transform,opacity' });
          sharedRef.current?.remove();
          sharedRef.current = null;
          delete document.documentElement.dataset[SHARED_ACTIVE_ATTR];
          unlock();
        },
        1000 * (TRANSITION.coverDur + SHARED_TRANSITION.expand) + SHARED_TRANSITION.readyTimeoutMs,
      );

      const reduced = prefersReducedMotion();

      // Tile image to hero: grow the image from its tile to the screen over the dimmed old page.
      const source = options?.shared && !reduced ? findSharedSource(options.trigger) : null;
      if (source) {
        const overlay = createOverlay(source);
        overlay.apply(boxOf(source.el), SHARED_TRANSITION.radiusPx);
        source.el.style.visibility = 'hidden';
        sharedRef.current = overlay;
        document.documentElement.dataset[SHARED_ACTIVE_ATTR] = '';
        gsap.to(stage, { opacity: SHARED_TRANSITION.dimOpacity, duration: SHARED_TRANSITION.expand, ease: EASE.inOut });
        overlay.to(viewportBox(), 0, {
          duration: SHARED_TRANSITION.expand,
          ease: EASE.inOut,
          onComplete: () => navigate(to),
        });
        return;
      }

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

    const overlay = sharedRef.current;
    if (overlay) {
      sharedRef.current = null;
      gsap.killTweensOf(stage);
      gsap.set(stage, { clearProps: 'transform,opacity' });
      const target = stage.querySelector<HTMLElement>(SHARED_TARGET_SELECTOR);
      const finish = () => {
        target?.style.removeProperty('visibility');
        overlay.remove();
        delete document.documentElement.dataset[SHARED_ACTIVE_ATTR];
        unlock();
        ScrollTrigger.refresh();
      };
      if (!target) {
        gsap.to(overlay.root, { opacity: 0, duration: SHARED_TRANSITION.fadeOut, ease: EASE.soft, onComplete: finish });
        return;
      }
      // The page mounts hidden behind the full-screen image; once laid out, the image settles into the frame.
      target.style.visibility = 'hidden';
      let raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          overlay.to(boxOf(target), 0, {
            duration: SHARED_TRANSITION.settle,
            ease: EASE.out,
            onComplete: finish,
          });
        });
      });
      return () => cancelAnimationFrame(raf);
    }

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
