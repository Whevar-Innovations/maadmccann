import { useLoaderData } from 'react-router';
import { getHomePage } from '@/content/api';
import { blog } from '@/content/static/blog';
import { BlogGrid } from '@/components/blog/BlogGrid';
import {
  BLOG_MOTIF_CENTERS,
  BLOG_MOTIF_H,
  BLOG_MOTIF_PATHS,
  BLOG_MOTIF_VIEWBOX,
  BLOG_MOTIF_W,
} from '@/components/blog/blogMotifPaths';
import { MotifHero, type MotifData } from '@/components/layout/MotifHero';
import { useSeo } from '@/lib/useSeo';

const MOTIF: MotifData = {
  w: BLOG_MOTIF_W,
  h: BLOG_MOTIF_H,
  viewBox: BLOG_MOTIF_VIEWBOX,
  paths: BLOG_MOTIF_PATHS,
  centers: BLOG_MOTIF_CENTERS,
};

/** Shares the homepage CTA ("Got something in mind?") so the copy has one source. */
export const blogLoader = async () => ({
  cta: (await getHomePage()).cta,
  posts: blog.posts,
});

/**
 * Blog index (/blog), page 1 of "MAAD McCANN Website BLOG.pdf".
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage, identical to every other page.
 */
export function BlogRoute() {
  const { posts } = useLoaderData<typeof blogLoader>();
  useSeo({ ...blog.seo, path: '/blog', image: '/images/blog/hero-iron-sharpens-iron-1280.webp' });

  return (
    <div className="bg-paper text-ink">
      <MotifHero
        id="blog-hero"
        tone="crimson"
        motif={MOTIF}
        headlineLines={blog.hero.headlineLines}
        bodyLines={blog.hero.bodyLines}
        heightClassName="min-h-[30rem] sm:min-h-[34rem] lg:min-h-[max(35.2vw,26rem)]"
        headlineClassName="text-[clamp(2.1rem,3.65vw,5.05rem)] leading-[1.05] tracking-[-0.01em]"
        bodyClassName="mt-5 max-w-[62ch] text-[clamp(0.95rem,1.04vw,1.45rem)] leading-[1.4] font-medium sm:mt-6 lg:mt-[1.9vw] lg:max-w-none"
      />

      <BlogGrid posts={posts} />
    </div>
  );
}
