import { createBrowserRouter } from 'react-router';
import { RootLayout, rootLoader } from '@/components/layout/RootLayout';
import { BootFallback } from '@/routes/BootFallback';
import { HomeRoute, homeLoader } from '@/routes/home';
import { RouteError } from '@/routes/RouteError';
import { TheMaadOnesRoute, theMaadOnesLoader } from '@/routes/the-maad-ones';
import { WhatWeDoRoute, whatWeDoLoader } from '@/routes/what-we-do';

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
    ],
  },
]);
