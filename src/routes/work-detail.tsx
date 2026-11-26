import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { getCaseStudy } from '@/content/api';
import { ArtworkGallery } from '@/components/work/ArtworkGallery';
import { CaseHeader } from '@/components/work/CaseHeader';
import { CaseMedia } from '@/components/work/CaseMedia';
import { CaseStory } from '@/components/work/CaseStory';
import { useSeo } from '@/lib/useSeo';

export const workDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  const study = params.slug ? await getCaseStudy(params.slug) : undefined;
  if (!study) throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  return { page: study };
};

/**
 * A case study (/work/:slug): title row, video or hero image, story, artwork mosaic.
 * Uses the light header (route handle) and the shared CtaBand + Footer from RootLayout.
 */
export function WorkDetailRoute() {
  const { page } = useLoaderData<typeof workDetailLoader>();
  const poster = page.media.kind === 'video' ? page.media.poster : page.media.image;
  useSeo({ ...page.seo, path: `/work/${page.slug}`, image: poster.src });

  return (
    <article className="bg-paper">
      <CaseHeader clientLabel={page.clientLabel} client={page.client} title={page.title} />
      <CaseMedia media={page.media} title={page.title} />
      <CaseStory headline={page.headline} story={page.story} />
      <ArtworkGallery gallery={page.gallery} />
    </article>
  );
}
