import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router';
import Lenis from 'lenis';
import { gsap, MEDIA_QUERIES, ScrollTrigger } from './gsap-setup';
import { SCROLL } from './tokens';

export type SmoothScrollContextValue = {
  stopScroll: () => void;
  startScroll: () => void;
  scrollToTop: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  stopScroll: () => {},
  startScroll: () => {},
  scrollToTop: () => {},
});

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

/**
 * Lenis smooth scroll synced to GSAP ticker and ScrollTrigger (SPEC §8.7).
 * Stopped during the loader, mobile menu, and video modal.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockCountRef = useRef(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: SCROLL.lerp,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    if (lockCountRef.current > 0) {
      lenis.stop();
    }

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  const stopScroll = useCallback(() => {
    lockCountRef.current += 1;
    lenisRef.current?.stop();
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const startScroll = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current === 0) {
      lenisRef.current?.start();
      document.documentElement.style.overflow = '';
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    ScrollTrigger.refresh();
  }, []);

  const value = useMemo(
    () => ({ stopScroll, startScroll, scrollToTop }),
    [stopScroll, startScroll, scrollToTop],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
