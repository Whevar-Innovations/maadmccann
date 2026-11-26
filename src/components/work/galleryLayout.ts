import type { GalleryItem } from '@/content/types';

/**
 * Case-study gallery packer: turns the editor's flat, ordered artwork list (with optional hints)
 * into equal-height rows and "beside" blocks.
 *
 * Everything is in unitless aspect-ratio space. A row of items with ratios r1..rn, stretched to the
 * full width W, is W / Σr tall, so "Σr" is all a row needs to know. No DOM measuring: the same
 * layout comes out at every width, and the renderer's flex ratios do the sizing.
 */

/** Items on one row share a height (widths follow their aspect ratios). */
export type GalleryRow = GalleryItem[];

export type GalleryBlock =
  | { layout: 'rows'; rows: GalleryRow[] }
  /** One tall item beside a stack of rows, e.g. Take Pride's "Women Improvement Loan". */
  | { layout: 'beside'; tallSide: 'left' | 'right'; tall: GalleryItem; rows: GalleryRow[] };

/** Layout tuning (not motion), checked against the Our Work design galleries. */
export const GALLERY_LAYOUT = {
  maxPerRow: 3,
  /** Ideal Σratio of a full-width row: three portraits, or one wide banner. */
  rowTarget: 2.4,
  /** Ideal Σratio of a row inside the stack next to a feature (a narrower column). */
  stackTarget: 1.6,
  /** Ideal width share of the feature column, and how hard to pull towards it. */
  featureShare: 0.48,
  featureWeight: 10,
  /** Most items a feature's stack takes. */
  maxStack: 4,
  /** A `small` item counts as this fraction of its width when packing. */
  smallFactor: 0.5,
} as const;

export const ratioOf = (item: GalleryItem) => item.image.width / item.image.height;
const packRatio = (item: GalleryItem) =>
  ratioOf(item) * (item.size === 'small' ? GALLERY_LAYOUT.smallFactor : 1);
/** Height of a row relative to its width (Σ of the real ratios, not the packing ones). */
export const rowRatio = (row: GalleryRow) => row.reduce((sum, item) => sum + ratioOf(item), 0);

type Packed = { rows: GalleryRow[]; cost: number };

/**
 * Optimal split of `items` (in order) into rows of 1..maxPerRow, minimising Σ(Σratio − target)².
 * Linear-partition DP: O(n · maxPerRow).
 */
function packRows(items: GalleryItem[], target: number): Packed {
  const n = items.length;
  const best: number[] = [0];
  const cut: number[] = [0];
  for (let end = 1; end <= n; end++) {
    best[end] = Infinity;
    cut[end] = end - 1;
    let sum = 0;
    for (let size = 1; size <= GALLERY_LAYOUT.maxPerRow && size <= end; size++) {
      const item = items[end - size];
      if (!item) break;
      sum += packRatio(item);
      const cost = (best[end - size] ?? Infinity) + (sum - target) ** 2;
      if (cost < (best[end] ?? Infinity)) {
        best[end] = cost;
        cut[end] = end - size;
      }
    }
  }
  const rows: GalleryRow[] = [];
  for (let end = n; end > 0; end = cut[end] ?? 0) rows.unshift(items.slice(cut[end] ?? 0, end));
  return { rows, cost: best[n] ?? 0 };
}

/** Items that can join a row or a feature's stack (not a row-breaker of their own). */
const isPackable = (item: GalleryItem) => item.size !== 'full' && item.size !== 'feature';

/**
 * Choose how many of the following items stack beside a feature: the stack's own row cost plus how
 * far the feature column lands from its ideal width share.
 */
function packFeature(tall: GalleryItem, following: GalleryItem[]): { rows: GalleryRow[]; used: number } {
  const r = ratioOf(tall);
  let pick: { rows: GalleryRow[]; used: number; cost: number } | null = null;
  for (let k = 1; k <= Math.min(GALLERY_LAYOUT.maxStack, following.length); k++) {
    const { rows, cost } = packRows(following.slice(0, k), GALLERY_LAYOUT.stackTarget);
    // Stack height for a unit-wide column, then the tall column's share of the block width.
    const stackHeight = rows.reduce((sum, row) => sum + 1 / rowRatio(row), 0);
    const share = (r * stackHeight) / (1 + r * stackHeight);
    const total = cost + GALLERY_LAYOUT.featureWeight * (share - GALLERY_LAYOUT.featureShare) ** 2;
    if (!pick || total < pick.cost) pick = { rows, used: k, cost: total };
  }
  return pick ?? { rows: [], used: 0 };
}

export function layoutGallery(items: GalleryItem[]): GalleryBlock[] {
  const blocks: GalleryBlock[] = [];
  let run: GalleryItem[] = [];

  const pushRows = (rows: GalleryRow[]) => {
    if (rows.length === 0) return;
    const last = blocks[blocks.length - 1];
    if (last?.layout === 'rows') last.rows.push(...rows);
    else blocks.push({ layout: 'rows', rows });
  };
  const flush = () => {
    if (run.length) pushRows(packRows(run, GALLERY_LAYOUT.rowTarget).rows);
    run = [];
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;
    if (item.newRow) flush();

    if (item.size === 'full') {
      flush();
      pushRows([[item]]);
    } else if (item.size === 'feature') {
      flush();
      // The stack draws from the packable items that follow, up to the next row-breaker.
      const following: GalleryItem[] = [];
      for (let j = i + 1; j < items.length; j++) {
        const next = items[j];
        if (!next || !isPackable(next) || (following.length > 0 && next.newRow)) break;
        following.push(next);
      }
      const { rows, used } = packFeature(item, following);
      if (used === 0) pushRows([[item]]);
      else blocks.push({ layout: 'beside', tallSide: item.side ?? 'right', tall: item, rows });
      i += used;
    } else {
      run.push(item);
    }
  }
  flush();
  return blocks;
}
