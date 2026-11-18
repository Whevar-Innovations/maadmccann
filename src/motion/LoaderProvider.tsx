import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { gsap, MEDIA_QUERIES, useGSAP } from './gsap-setup';
import { useSmoothScroll } from './SmoothScroll';
import { DUR, EASE, LOADER } from './tokens';
import maadLogoWhiteSrc from '@/assets/svg/maad-logo-white.svg';

export type LoaderContextValue = {
  isHeroReady: boolean;
  skippedLoader: boolean;
};

const LoaderContext = createContext<LoaderContextValue>({
  isHeroReady: true,
  skippedLoader: true,
});

export function useLoaderState(): LoaderContextValue {
  return useContext(LoaderContext);
}

function shouldSkipLoaderOnBoot(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia(MEDIA_QUERIES.reducedMotion).matches) return true;
  try {
    return window.sessionStorage.getItem(LOADER.storageKey) === '1';
  } catch {
    return false;
  }
}

function markLoaderShown(): void {
  try {
    window.sessionStorage.setItem(LOADER.storageKey, '1');
  } catch {
    // ignore storage errors in restricted environments
  }
}

async function decodeHeroAssets(): Promise<void> {
  const selectors = [
    'img[data-hero-bg]',
    'img[data-hero-motif]',
    '[data-trophies-stage] img',
  ];
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>(selectors.join(',')),
  );

  await Promise.allSettled(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      if (typeof img.decode === 'function') {
        return img.decode().catch(() => undefined);
      }
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  );
}

/**
 * LoaderLogo (SPEC §8.2 fallback: built from maad-logo-white.svg with GSAP clip-path reveal).
 * Exposes onDone when the entrance animation finishes.
 */
function LoaderLogo({
  onDone,
  logoRef,
}: {
  onDone: () => void;
  logoRef: React.RefObject<HTMLDivElement | null>;
}) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const target = logoRef.current;
      if (!target) {
        onDone();
        return;
      }

      gsap.fromTo(
        target,
        {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          scale: 0.96,
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          scale: 1,
          duration: DUR.text,
          ease: EASE.out,
          onComplete: onDone,
        },
      );
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className="flex items-center justify-center px-6">
      <div ref={logoRef} className="will-change-transform">
        <img
          src={maadLogoWhiteSrc}
          alt="MAAD McCANN"
          width={320}
          height={37}
          fetchPriority="high"
          className="h-7 w-auto sm:h-9 lg:h-11"
        />
      </div>
    </div>
  );
}

/**
 * Full-screen loader panel & gating (SPEC §8.2).
 * - Minimum visible: 1.6s, hard timeout: 4.0s.
 * - Requires: LoaderLogo onDone + document.fonts.ready + hero assets decoded.
 * - Once per session (sessionStorage) and skipped for prefers-reduced-motion.
 * - Starts Hero timeline ~0.35s before the panel wipe ends.
 */
export function LoaderProvider({ children }: { children: ReactNode }) {
  const initialSkip = useMemo(() => shouldSkipLoaderOnBoot(), []);
  const [visible, setVisible] = useState(!initialSkip);
  const [isHeroReady, setIsHeroReady] = useState(initialSkip);
  const [logoDone, setLogoDone] = useState(false);

  const mountedAtRef = useRef<number>(
    typeof performance !== 'undefined' ? performance.now() : 0,
  );
  const panelRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const hasExitedRef = useRef(false);

  const { stopScroll, startScroll } = useSmoothScroll();

  useEffect(() => {
    if (!visible) return;
    stopScroll();
    return () => {
      startScroll();
    };
  }, [visible, stopScroll, startScroll]);

  const runExit = useCallback(() => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    markLoaderShown();

    const panel = panelRef.current;
    const logo = logoRef.current;

    if (!panel || !logo) {
      setIsHeroReady(true);
      setVisible(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
      },
    });

    // 1. Logo scale 1 -> 0.9 and fade (0.5s, power2.in)
    tl.to(logo, {
      scale: 0.9,
      opacity: 0,
      duration: DUR.loaderLogoOut,
      ease: EASE.loaderLogoOut,
    });

    // 2. Panel yPercent 0 -> -100 (0.9s, expo.inOut)
    tl.to(panel, {
      yPercent: -100,
      duration: DUR.loaderWipe,
      ease: EASE.inOut,
    });

    // 3. Hero timeline starts ~0.35s before the wipe ends so the two overlap
    const heroStartOffset =
      DUR.loaderLogoOut + Math.max(0, DUR.loaderWipe - LOADER.heroOverlapSec);
    tl.call(
      () => {
        setIsHeroReady(true);
      },
      [],
      heroStartOffset,
    );
  }, []);

  // Hard timeout: 4.0s max (SPEC §8.2)
  useEffect(() => {
    if (!visible || hasExitedRef.current) return;
    const hardTimeoutId = window.setTimeout(runExit, LOADER.hardTimeoutMs);
    return () => window.clearTimeout(hardTimeoutId);
  }, [visible, runExit]);

  // Exit once logoDone + fonts + hero assets decoded + 1.6s minimum elapsed
  useEffect(() => {
    if (!visible || !logoDone || hasExitedRef.current) return;

    let cancelled = false;
    let minTimerId: number | undefined;

    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();

    Promise.all([fontsReady, decodeHeroAssets()]).then(() => {
      if (cancelled || hasExitedRef.current) return;
      const elapsed = performance.now() - mountedAtRef.current;
      const remaining = Math.max(0, LOADER.minVisibleMs - elapsed);
      minTimerId = window.setTimeout(() => {
        if (!cancelled) runExit();
      }, remaining);
    });

    return () => {
      cancelled = true;
      if (minTimerId !== undefined) window.clearTimeout(minTimerId);
    };
  }, [visible, logoDone, runExit]);

  const contextValue = useMemo(
    () => ({ isHeroReady, skippedLoader: initialSkip }),
    [isHeroReady, initialSkip],
  );

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {visible && (
        <div
          ref={panelRef}
          role="status"
          aria-live="polite"
          aria-label="Loading MAAD McCANN"
          data-loader-panel
          className="fixed inset-0 z-50 flex items-center justify-center bg-crimson-950 text-paper will-change-transform"
        >
          <LoaderLogo logoRef={logoRef} onDone={() => setLogoDone(true)} />
        </div>
      )}
    </LoaderContext.Provider>
  );
}
