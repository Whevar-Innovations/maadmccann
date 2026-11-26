import { createBrowserRouter } from 'react-router';
import { RootLayout, rootLoader } from '@/components/layout/RootLayout';
import { BootFallback } from '@/routes/BootFallback';
import { HomeRoute, homeLoader } from '@/routes/home';
import { RouteError } from '@/routes/RouteError';
import { PartnersRoute, partnersLoader } from '@/routes/partners';
import { TheMaadOnesRoute, theMaadOnesLoader } from '@/routes/the-maad-ones';
import { WhatWeDoRoute, whatWeDoLoader } from '@/routes/what-we-do';
import { WorkRoute, workLoader } from '@/routes/work';
import { WorkDetailRoute, workDetailLoader } from '@/routes/work-detail';

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
        loader: homeLoader,
        Component: HomeRoute,
      },
      {
        id: 'what-we-do',
        path: 'what-we-do',
        loader: whatWeDoLoader,
        Component: WhatWeDoRoute,
      },
      {
        id: 'the-maad-ones',
        path: 'the-maad-ones',
        loader: theMaadOnesLoader,
        Component: TheMaadOnesRoute,
      },
      {
        id: 'work',
        path: 'work',
        loader: workLoader,
        Component: WorkRoute,
      },
      {
        id: 'partners',
        path: 'partners',
        loader: partnersLoader,
        Component: PartnersRoute,
      },
      {
        id: 'work-detail',
        path: 'work/:slug',
        loader: workDetailLoader,
        Component: WorkDetailRoute,
        handle: { headerTone: 'light' },
      },
    ],
  },
]);
