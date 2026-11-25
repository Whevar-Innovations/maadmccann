import type { CaseStudyPage } from '@/content/types';
import { Img } from '@/components/ui/Img';
import { VideoFrame } from '@/components/ui/VideoFrame';

export type CaseMediaProps = {
  media: CaseStudyPage['media'];
  title: string;
};

/**
 * The case-study header frame: an inline video, or a hero image when the project has no film.
 * `data-shared-target` is where a clicked project tile's image settles (see motion/PageTransition).
 */
export function CaseMedia({ media, title }: CaseMediaProps) {
  return (
    <div className="container-site">
      <div data-shared-target>
        {media.kind === 'video' ? (
          <VideoFrame videoUrl={media.videoUrl} poster={media.poster} title={title} priority />
        ) : (
          <div className="aspect-video overflow-hidden bg-placeholder">
            <Img image={media.image} priority sizes="100vw" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
