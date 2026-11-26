/**
 * A still copy of the page being left, frozen at its scroll position, so the router can swap the
 * route underneath while the new page slides up over it (see PageTransition).
 *
 * The copy is a deep clone of the page stage inside a fixed, viewport-sized window: inert, hidden
 * from assistive tech, ids stripped (no duplicates with the live page), media paused. Only the
 * whole copy moves (`drift`) and a dim layer fades over it, so it costs one composited layer.
 */
export type PageSnapshot = {
  root: HTMLDivElement;
  /** Moves as one piece (the old page drifting up as it is "scrolled past"). */
  drift: HTMLDivElement;
  /** Ink layer over the copy, faded in as the new page covers it. */
  dim: HTMLDivElement;
  remove: () => void;
};

export function createPageSnapshot(stage: HTMLElement): PageSnapshot {
  const root = document.createElement('div');
  root.dataset.pageSnapshot = '';
  root.setAttribute('aria-hidden', 'true');
  root.inert = true;
  // Under the header (z-40) and the incoming page (z-39 while it slides), over the live page.
  root.className = 'pointer-events-none fixed inset-0 z-[38] overflow-hidden bg-paper';

  const drift = document.createElement('div');
  drift.className = 'absolute inset-x-0 top-0 will-change-transform';

  const clone = stage.cloneNode(true) as HTMLElement;
  clone.removeAttribute('data-page-stage');
  clone.style.transform = `translateY(${-window.scrollY}px)`;
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  clone.querySelectorAll('video, iframe').forEach((el) => el.remove());

  const dim = document.createElement('div');
  dim.className = 'absolute inset-0 bg-ink opacity-0';

  drift.appendChild(clone);
  root.append(drift, dim);
  document.body.appendChild(root);

  return {
    root,
    drift,
    dim,
    remove() {
      root.remove();
    },
  };
}
