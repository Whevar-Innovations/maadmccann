import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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
  scrollToTop: (opts?: { smooth?: boolean }) => void;
  /** Scroll to the element whose id matches `hash` ("#creative" or "creative"). */
  scrollToHash: (hash: string, opts?: { immediate?: boolean }) => boolean;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  stopScroll: () => {},
  startScroll: () => {},
  scrollToTop: () => {},
  scrollToHash: () => false,
});

/** Clearance for the fixed header when jumping to an in-page anchor. */
const HASH_OFFSET = -96;

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
  const { pathname, hash } = useLocation();
  const hashRef = useRef(hash);
  hashRef.current = hash;

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

  const scrollToHash = useCallback((target: string, opts?: { immediate?: boolean }) => {
    const id = decodeURIComponent(target.replace(/^#/, ''));
    const el = id ? document.getElementById(id) : null;
    if (!el) return false;
    const immediate = opts?.immediate ?? false;
    // Layout position (offsetTop ignores transforms), so in-progress entrance animations
    // don't skew the target.
    let top = 0;
    for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
      top += node.offsetTop;
    }
    top = Math.max(0, top + HASH_OFFSET);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, { immediate, force: true });
    } else {
      window.scrollTo({ top, left: 0, behavior: immediate ? 'instant' : 'smooth' });
    }
    return true;
  }, []);

  // We own scroll position on navigation; stop the browser restoring an old offset over it.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  // New page: jump to the top (or the #anchor) before the browser paints it, so the incoming
  // page never flashes at the previous page's scroll position. Any leftover wheel momentum
  // from the old page is cancelled by the immediate scroll.
  useLayoutEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Recalculate trigger positions once the new page has laid out.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const target = hashRef.current;
      if (target) scrollToHash(target, { immediate: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, scrollToHash]);

  const stopScroll = useCallback(() => {
    lockCountRef.current += 1;
    lenisRef.current?.stop();
    const root = document.documentElement;
    // Keep the scrollbar's space while locked, so the page (and fixed header) doesn't jump
    // sideways when the scrollbar disappears.
    if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
  }, []);

  const startScroll = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current === 0) {
      lenisRef.current?.start();
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollbarGutter = '';
    }
  }, []);

  const scrollToTop = useCallback((opts?: { smooth?: boolean }) => {
    const smooth = opts?.smooth ?? false;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: !smooth, force: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: smooth ? 'smooth' : 'instant' });
    }
    if (!smooth) ScrollTrigger.refresh();
  }, []);

  const value = useMemo(
    () => ({ stopScroll, startScroll, scrollToTop, scrollToHash }),
    [stopScroll, startScroll, scrollToTop, scrollToHash],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
