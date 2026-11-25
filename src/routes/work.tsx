import { useLoaderData } from 'react-router';
import { getWorkPage } from '@/content/api';
import { useSeo } from '@/lib/useSeo';

export const workLoader = async () => ({
  page: await getWorkPage(),
});

/** Our Work (/work): hero, sector filter and the paginated project grid. */
export function WorkRoute() {
  const { page } = useLoaderData<typeof workLoader>();
  useSeo({ ...page.seo, path: '/work', image: page.projects[0]?.image.src });

  return (
    <div className="bg-paper pt-32">
      <h1 className="container-site font-display text-hero font-bold">
        {page.hero.headlineLines.join(' ')}
      </h1>
    </div>
  );
}
