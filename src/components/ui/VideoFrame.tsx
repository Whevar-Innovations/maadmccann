import MuxPlayer, { type MuxPlayerProps } from '@mux/mux-player-react';
import type { ImageAsset } from '@/content/types';
import { toMuxPlaybackId } from '@/lib/mux';

export type VideoFrameProps = {
  /** Mux player URL (see lib/mux). */
  videoUrl: string;
  poster: ImageAsset;
  title: string;
  /** Load the poster at high priority: use for the above-the-fold frame only. */
  priority?: boolean;
  className?: string;
};

/**
 * Inline 16:9 Mux player with the poster as its still and the red (berry) scrubber, as in the
 * case-study design. The viewer's own click on the player's play button starts playback with sound,
 * so no autoplay or unmute workaround is needed. Falls back to the poster if the URL isn't a Mux URL.
 */
export function VideoFrame({ videoUrl, poster, title, priority = false, className = '' }: VideoFrameProps) {
  const playbackId = toMuxPlaybackId(videoUrl);

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-ink ${className}`.trim()}>
      {playbackId ? (
        <MuxPlayer
          playbackId={playbackId}
          streamType="on-demand"
          title={title}
          poster={poster.src}
          preload={priority ? 'auto' : 'metadata'}
          playsInline
          accentColor="var(--color-berry)"
          style={{
            width: '100%',
            height: '100%',
            '--media-object-fit': 'cover',
            '--media-object-position': 'center',
          } as NonNullable<MuxPlayerProps['style']>}
        />
      ) : (
        <img
          src={poster.src}
          srcSet={poster.srcSet}
          alt={poster.alt}
          width={poster.width}
          height={poster.height}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
