import {
  data,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  type LoaderFunctionArgs,
} from 'react-router';
import { getBlogPage } from '@/content/api';
import type { BlogPage } from '@/content/types';
import { BlogArticle } from '@/components/blog/BlogArticle';
import { Link } from '@/components/ui/Link';
import { useSeo } from '@/lib/useSeo';
import { RouteError } from './RouteError';

export const blogPostLoader = async ({ params }: LoaderFunctionArgs) => {
  const page = await getBlogPage();
  const post = page.posts.find((p) => p.slug === params.slug);
  // 404 carries the Blog's own "not found" copy to BlogPostError.
  if (!post) throw data({ notFound: page.notFound }, { status: 404, statusText: 'Not Found' });
  return { post };
};

/**
 * Blog article (/blog/:slug), pages 2–5 of "MAAD McCANN Website BLOG.pdf".
 * Uses the light header (route handle) and the shared CtaBand + Footer from RootLayout.
 */
export function BlogPostRoute() {
  const { post } = useLoaderData<typeof blogPostLoader>();
  useSeo({
    ...post.seo,
    path: `/blog/${post.slug}`,
    // Every hero ships a 1280px size: a good share-card resolution.
    image: post.hero.src.replace(/-\d+\.webp$/, '-1280.webp'),
  });

  // Keyed so moving between articles replays the entrance.
  return <BlogArticle key={post.slug} post={post} />;
}

type NotFoundData = { notFound: BlogPage['notFound'] };

const isNotFoundData = (value: unknown): value is NotFoundData =>
  typeof value === 'object' && value !== null && 'notFound' in value;

/**
 * A mistyped or retired article link keeps the header and footer and points back to the Blog.
 * Any other error falls through to the site's RouteError.
 */
export function BlogPostError() {
  const error = useRouteError();
  const copy =
    isRouteErrorResponse(error) && error.status === 404 && isNotFoundData(error.data)
      ? error.data.notFound
      : undefined;
  useSeo({ title: copy?.title, path: '/blog', noindex: true });

  if (!copy) return <RouteError />;

  return (
    <section
      aria-labelledby="blog-not-found-heading"
      className="flex min-h-[70svh] flex-col items-center justify-center bg-paper px-5 pt-[calc(5rem+3rem)] pb-24 text-center text-ink lg:pt-[calc(7rem+4rem)]"
    >
      <h1
        id="blog-not-found-heading"
        className="font-display text-[clamp(2rem,3.65vw,4.5rem)] leading-[1.05] font-bold tracking-display text-balance"
      >
        {copy.title}
      </h1>
      <p className="mt-4 max-w-[46ch] text-[clamp(1rem,1.12vw,1.4rem)] leading-[1.4]">{copy.body}</p>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-8 py-3 text-small font-semibold text-paper transition-colors duration-300 hover:bg-crimson-800 focus-visible:bg-crimson-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:text-body"
      >
        {copy.backLabel}
      </Link>
    </section>
  );
}
