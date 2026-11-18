import { isRouteErrorResponse, useRouteError } from 'react-router';

/** Route error boundary. Shows only what the router reports: status and status text, or the error message. */
export function RouteError() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Error';
  const detail = isRouteErrorResponse(error)
    ? null
    : error instanceof Error
      ? error.message
      : null;

  return (
    <main id="main" className="container-site flex min-h-svh flex-col justify-center gap-4 bg-ink text-paper">
      <h1 className="font-display text-showreel font-bold">{title}</h1>
      {detail && import.meta.env.DEV && <pre className="text-small whitespace-pre-wrap">{detail}</pre>}
    </main>
  );
}
