import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from '@/router';
import '@/styles/globals.css';

/*
 * After a redeploy, a tab still running the old build asks for page chunks that no longer exist.
 * Reload once to pick up the new build. At most once per tab session, so a genuinely broken chunk
 * surfaces the route error page instead of looping.
 */
const RELOAD_KEY = 'maad:chunk-reload';
window.addEventListener('vite:preloadError', (event) => {
  try {
    if (sessionStorage.getItem(RELOAD_KEY)) return;
    sessionStorage.setItem(RELOAD_KEY, '1');
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
