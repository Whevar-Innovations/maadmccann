import { createBrowserRouter } from 'react-router';
import { RootLayout, rootLoader } from '@/components/layout/RootLayout';
import { BootFallback } from '@/routes/BootFallback';
import { RouteError } from '@/routes/RouteError';
import { HomeRoute, homeLoader } from '@/routes/home';

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
        index: true,
        loader: homeLoader,
        Component: HomeRoute,
      },
    ],
  },
]);
