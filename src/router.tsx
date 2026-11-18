import { createBrowserRouter } from 'react-router';
import { RootLayout, rootLoader } from '@/components/layout/RootLayout';
import { BootFallback } from '@/routes/BootFallback';
import { HomeRoute, homeLoader } from '@/routes/home';
import { RouteError } from '@/routes/RouteError';

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
    ],
  },
]);
