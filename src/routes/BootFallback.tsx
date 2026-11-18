/**
 * Shown while the first route loaders resolve. A plain crimson-950 panel, the same
 * colour as the loader (SPEC §8.2), so there's no flash when LoaderProvider takes over in step 4.
 */
export function BootFallback() {
  return <div className="fixed inset-0 bg-crimson-950" aria-hidden="true" />;
}
