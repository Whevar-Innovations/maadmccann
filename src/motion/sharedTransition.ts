import { gsap } from './gsap-setup';

/**
 * Shared-element helpers: a fixed overlay shows the clicked tile's image and grows it from the
 * tile's rect to the screen, then to the destination frame's rect.
 *
 * Only clip-path and transform animate: the overlay is a full-viewport clip window, and the image
 * inside it is laid out at its natural size then moved/scaled so it covers whichever box (tile,
 * viewport, target frame) the window currently shows, exactly like `object-fit: cover`.
 */

export type Box = { x: number; y: number; w: number; h: number };

export type SharedSource = {
  /** The marked wrapper (data-shared-image): its rect is the starting box. */
  el: HTMLElement;
  image: HTMLImageElement;
};

export type SharedOverlay = {
  root: HTMLDivElement;
  img: HTMLImageElement;
  /** Natural image size and object-position (0..1) used for cover placement. */
  iw: number;
  ih: number;
  px: number;
  py: number;
  /** Set the window and the image placement for `box` (radius in px). */
  apply: (box: Box, radius: number) => void;
  /** Animate the window and image to `box`. */
  to: (
    box: Box,
    radius: number,
    opts: { duration: number; ease: string; onComplete?: () => void },
  ) => gsap.core.Timeline;
  remove: () => void;
};

export const SHARED_SELECTOR = '[data-shared-image]';
export const SHARED_TARGET_SELECTOR = '[data-shared-target]';

export function findSharedSource(trigger: HTMLElement | undefined): SharedSource | null {
  const el = trigger?.querySelector<HTMLElement>(SHARED_SELECTOR);
  const image = el?.querySelector<HTMLImageElement>('img');
  if (!el || !image || !image.currentSrc) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  return { el, image };
}

const toBox = (r: DOMRect): Box => ({ x: r.left, y: r.top, w: r.width, h: r.height });
export const boxOf = (el: Element): Box => toBox(el.getBoundingClientRect());

/** "50% 0%" / "center top" computed values to [0..1, 0..1]. */
function parsePosition(value: string): [number, number] {
  const [x = '50%', y = '50%'] = value.trim().split(/\s+/);
  const f = (v: string) => (v.endsWith('%') ? Math.min(1, Math.max(0, parseFloat(v) / 100)) : 0.5);
  return [f(x), f(y)];
}

/** Where the natural-size image goes to cover `box` (like object-fit: cover + object-position). */
function cover(o: { iw: number; ih: number; px: number; py: number }, box: Box) {
  const scale = Math.max(box.w / o.iw, box.h / o.ih);
  return {
    scale,
    x: box.x + (box.w - o.iw * scale) * o.px,
    y: box.y + (box.h - o.ih * scale) * o.py,
  };
}

const clipFor = (b: Box, radius: number) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return `inset(${b.y}px ${vw - b.x - b.w}px ${vh - b.y - b.h}px ${b.x}px round ${radius}px)`;
};

export function createOverlay(source: SharedSource): SharedOverlay {
  const { image } = source;
  const iw = image.naturalWidth || image.width;
  const ih = image.naturalHeight || image.height;
  const [px, py] = parsePosition(getComputedStyle(image).objectPosition);

  const root = document.createElement('div');
  root.setAttribute('aria-hidden', 'true');
  root.dataset.sharedOverlay = '';
  Object.assign(root.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9990',
    pointerEvents: 'none',
    overflow: 'hidden',
  });
  const img = document.createElement('img');
  img.alt = '';
  img.decoding = 'sync';
  img.src = image.currentSrc;
  Object.assign(img.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${iw}px`,
    height: `${ih}px`,
    maxWidth: 'none',
    transformOrigin: '0 0',
    willChange: 'transform',
  });
  root.appendChild(img);
  document.body.appendChild(root);

  const o = { iw, ih, px, py };
  const place = (box: Box) => {
    const c = cover(o, box);
    return { x: c.x, y: c.y, scale: c.scale };
  };

  return {
    root,
    img,
    ...o,
    apply(box, radius) {
      root.style.clipPath = clipFor(box, radius);
      gsap.set(img, place(box));
    },
    to(box, radius, { duration, ease, onComplete }) {
      return gsap
        .timeline({ onComplete })
        .to(root, { clipPath: clipFor(box, radius), duration, ease }, 0)
        .to(img, { ...place(box), duration, ease }, 0);
    },
    remove() {
      gsap.killTweensOf([root, img]);
      root.remove();
    },
  };
}

export const viewportBox = (): Box => ({ x: 0, y: 0, w: window.innerWidth, h: window.innerHeight });
