import { createBrowserRouter } from 'react-router';
import { RootLayout, rootLoader } from '@/components/layout/RootLayout';
import { BootFallback } from '@/routes/BootFallback';
import { RouteError } from '@/routes/RouteError';

/**
 * Each page is its own chunk (route `lazy`): the first load only downloads the shell (header,
 * footer, motion) plus the page being visited, so its hero motif blooms on an idle main thread
 * instead of competing with every other page's code, motif paths and the video player.
 * `handle` stays static so the header knows its tone before the page chunk arrives.
 */
export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    loader: rootLoader,
    Component: RootLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: BootFallback,
    children: [
      {
        id: 'home',
        index: true,
        lazy: async () => {
          const m = await import('@/routes/home');
          return { loader: m.homeLoader, Component: m.HomeRoute };
        },
      },
      {
        id: 'what-we-do',
        path: 'what-we-do',
        lazy: async () => {
          const m = await import('@/routes/what-we-do');
          return { loader: m.whatWeDoLoader, Component: m.WhatWeDoRoute };
        },
      },
      {
        id: 'the-maad-ones',
        path: 'the-maad-ones',
        lazy: async () => {
          const m = await import('@/routes/the-maad-ones');
          return { loader: m.theMaadOnesLoader, Component: m.TheMaadOnesRoute };
        },
      },
      {
        id: 'work',
        path: 'work',
        lazy: async () => {
          const m = await import('@/routes/work');
          return { loader: m.workLoader, Component: m.WorkRoute };
        },
      },
      {
        id: 'partners',
        path: 'partners',
        lazy: async () => {
          const m = await import('@/routes/partners');
          return { loader: m.partnersLoader, Component: m.PartnersRoute };
        },
      },
      {
        id: 'work-detail',
        path: 'work/:slug',
        handle: { headerTone: 'light' },
        lazy: async () => {
          const m = await import('@/routes/work-detail');
          return { loader: m.workDetailLoader, Component: m.WorkDetailRoute };
        },
      },
      {
        id: 'csr',
        path: 'csr',
        lazy: async () => {
          const m = await import('@/routes/csr');
          return { loader: m.csrLoader, Component: m.CsrRoute };
        },
      },
      {
        id: 'blog',
        path: 'blog',
        lazy: async () => {
          const m = await import('@/routes/blog');
          return { loader: m.blogLoader, Component: m.BlogRoute };
        },
      },
      {
        id: 'blog-post',
        path: 'blog/:slug',
        // Articles sit on paper: dark type, two-tone logo, hairline under the bar (blog design).
        handle: { headerTone: 'light', headerRule: true },
        lazy: async () => {
          const m = await import('@/routes/blog-post');
          return { loader: m.blogPostLoader, Component: m.BlogPostRoute, ErrorBoundary: m.BlogPostError };
        },
      },
      {
        id: 'contact',
        path: 'contact',
        lazy: async () => {
          const m = await import('@/routes/contact');
          return { loader: m.contactLoader, Component: m.ContactRoute };
        },
      },
    ],
  },
]);
