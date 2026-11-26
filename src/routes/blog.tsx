import { useLoaderData } from 'react-router';
import { getBlogPage } from '@/content/api';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogHero } from '@/components/blog/BlogHero';
import { useSeo } from '@/lib/useSeo';

export const blogLoader = async () => ({
  page: await getBlogPage(),
});

/**
 * Blog index (/blog), page 1 of "MAAD McCANN Website BLOG.pdf": motif hero, then the card grid.
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage (settings.cta).
 */
export function BlogRoute() {
  const { page } = useLoaderData<typeof blogLoader>();
  useSeo({ ...page.seo, path: '/blog', image: page.ogImage });

  return (
    <div className="bg-paper text-ink">
      <BlogHero hero={page.hero} />
      <BlogGrid posts={page.posts} label={page.postsLabel} />
    </div>
  );
}
