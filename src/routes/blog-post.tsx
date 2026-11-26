import { isRouteErrorResponse, useLoaderData, useRouteError, type LoaderFunctionArgs } from 'react-router';
import { getHomePage } from '@/content/api';
import { getBlogPost } from '@/content/static/blog';
import { BlogArticle } from '@/components/blog/BlogArticle';
import type { HeaderHandle } from '@/components/layout/Header';
import { Link } from '@/components/ui/Link';
import { useSeo } from '@/lib/useSeo';

export const blogPostLoader = async ({ params }: LoaderFunctionArgs) => {
  const post = getBlogPost(params.slug);
  if (!post) throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  return { cta: (await getHomePage()).cta, post };
};

/** Article pages sit on white, so they get the light header (white bar, two-tone logo). */
export const blogPostHandle: HeaderHandle = { headerTheme: 'light' };

/**
 * Blog article (/blog/:slug), pages 2–5 of "MAAD McCANN Website BLOG.pdf".
 * CtaBand + Footer come from RootLayout's shared FooterMotifStage, identical to every other page.
 */
export function BlogPostRoute() {
  const { post } = useLoaderData<typeof blogPostLoader>();
  useSeo({
    ...post.seo,
    path: `/blog/${post.slug}`,
    // Every hero ships a 1280px size: a good share-card resolution.
    image: post.hero.src.replace(/-\d+\.webp$/, '-1280.webp'),
  });

  return <BlogArticle key={post.slug} post={post} />;
}

/**
 * A mistyped or retired article link: keep the header and footer and point back to the Blog,
 * instead of the bare root error screen. Other errors still read "Something went wrong".
 */
export function BlogPostError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const title = notFound ? 'We couldn’t find that article' : 'Something went wrong';
  useSeo({ title, path: '/blog', noindex: true });

  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center bg-paper px-5 pt-[calc(5rem+3rem)] pb-24 text-center text-ink lg:pt-[calc(7rem+4rem)]">
      <h1 className="font-display text-[clamp(2rem,3.65vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.02em] text-balance">
        {title}
      </h1>
      <p className="mt-4 max-w-[46ch] text-[clamp(1rem,1.12vw,1.4rem)] leading-[1.4]">
        {notFound
          ? 'It may have moved, or the link may be mistyped. Our latest stories are on the Blog.'
          : 'Please try again, or head back to the Blog.'}
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-8 py-3 text-small font-semibold text-paper transition-colors duration-300 hover:bg-crimson-800 focus-visible:bg-crimson-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:text-body"
      >
        Back to the Blog
      </Link>
    </section>
  );
}
