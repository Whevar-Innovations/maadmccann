import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSmoothScroll } from './SmoothScroll';

export type PageTransitionContextValue = {
  /** Navigate to an internal href. Name kept so existing callers don't change. */
  navigateWithTransition: (to: string) => void;
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

/**
 * Direct page navigation: no curtain or fade. A click swaps straight to the new page, which
 * starts at the top (or at its #anchor, see SmoothScroll) and plays its own entrance animations.
 * - Same page + #anchor: smooth-scrolls to the anchor.
 * - Same page, no anchor: smooth-scrolls back to the top.
 */
export function PageTransition({ children, outsideStage }: PageTransitionProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { scrollToHash, scrollToTop } = useSmoothScroll();

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

      navigate(to);
    },
    [pathname, navigate, scrollToHash, scrollToTop],
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition }}>
      {outsideStage}
      <div data-page-stage className="w-full">
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
