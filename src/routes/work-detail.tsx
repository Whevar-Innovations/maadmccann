import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { getCaseStudy } from '@/content/api';
import { useSeo } from '@/lib/useSeo';

export const workDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  const study = params.slug ? await getCaseStudy(params.slug) : undefined;
  if (!study) throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  return { page: study };
};

/** A case study (/work/:slug). */
export function WorkDetailRoute() {
  const { page } = useLoaderData<typeof workDetailLoader>();
  const poster = page.media.kind === 'video' ? page.media.poster : page.media.image;
  useSeo({ ...page.seo, path: `/work/${page.slug}`, image: poster.src });

  return (
    <div className="bg-paper pt-32">
      <h1 className="container-site font-display text-hero font-bold">{page.title}</h1>
    </div>
  );
}
