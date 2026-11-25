/** Extracts the playback id from a Mux player URL (`https://player.mux.com/{id}` or `/watch/{id}`). */
export function toMuxPlaybackId(rawUrl: string): string | null {
  const m = rawUrl.match(/^https:\/\/player\.mux\.com\/(?:watch\/)?([A-Za-z0-9]+)/);
  return m?.[1] ?? null;
}
