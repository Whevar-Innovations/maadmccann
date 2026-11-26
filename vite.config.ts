import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { blog } from './src/content/static/blog.ts';

/** Public routes that belong in the sitemap. Add real routes as they ship. */
const SITEMAP_ROUTES = [
  '/',
  '/what-we-do',
  '/csr',
  '/the-maad-ones',
  '/blog',
  // Read from the blog content so new articles are listed automatically.
  ...blog.posts.map((post) => `/blog/${post.slug}`),
];

/**
 * Domain-agnostic SEO URLs. The site URL is, in order:
 *   1. VITE_SITE_URL (explicit override, e.g. the custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (Vercel sets this to the custom domain once attached)
 *   3. the current Vercel URL
 * It replaces `__SITE_URL__` in index.html and generates robots.txt + sitemap.xml.
 */
function seoPlugin(siteUrl: string): Plugin {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_ROUTES.map(
  (r) => `  <url>
    <loc>${siteUrl}${r}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
).join('\n')}
</urlset>
`;

  return {
    name: 'maad-seo',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt' || req.url === '/sitemap.xml') {
          res.setHeader('Content-Type', req.url.endsWith('.txt') ? 'text/plain' : 'application/xml');
          res.end(req.url.endsWith('.txt') ? robots : sitemap);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const host =
    env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    env.VERCEL_URL || process.env.VERCEL_URL;
  const siteUrl = (
    env.VITE_SITE_URL ||
    (host ? `https://${host}` : 'https://maadmccann.vercel.app')
  ).replace(/\/+$/, '');

  return {
    plugins: [react(), tailwindcss(), seoPlugin(siteUrl)],
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) },
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  };
});
