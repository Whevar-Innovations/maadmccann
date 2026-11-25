#!/usr/bin/env node
/**
 * Project rule guard (see CLAUDE.md "Grounding rules"). Dependency-free; runs before every build.
 *
 *  1. static-import   Only files in src/content/ may import content/static. Everything else
 *                     gets content through api.ts -> route loader -> props.
 *  2. raw-colour      No hex / rgb() / hsl() literals outside src/content/ and src/styles/.
 *                     Add a token to @theme in globals.css and use its utility instead.
 *  3. string-ease     No `ease: '...'` string literals outside src/motion/tokens.ts. Use EASE.*.
 *  4. route-registry  Every route path in src/router.tsx must also be in ENABLED_ROUTES
 *                     (src/components/ui/Link.tsx) and SITEMAP_ROUTES (vite.config.ts).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const rel = (p) => relative(root, p).split(sep).join('/');
const errors = [];
const report = (file, line, rule, msg) => errors.push(`${file}:${line}  [${rule}] ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

// Hex inside quotes, backticks, brackets, parens or after a comma/space in an arbitrary value.
// Anchors like '#main' or '#footer' don't match because they contain non-hex letters.
const HEX = /(?<=['"`[(,\s_])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z-])/;
const FN_COLOUR = /\b(?:rgba?|hsla?)\(/;
const STATIC_IMPORT = /from\s+['"][^'"]*content\/static[^'"]*['"]|import\(\s*['"][^'"]*content\/static/;
const STRING_EASE = /\bease:\s*['"`]/;

for (const abs of walk(join(root, 'src'))) {
  const file = rel(abs);
  const inContent = file.startsWith('src/content/');
  const inStyles = file.startsWith('src/styles/');
  const isTokens = file === 'src/motion/tokens.ts';
  const lines = readFileSync(abs, 'utf8').split('\n');

  lines.forEach((text, i) => {
    const n = i + 1;
    // Ignore comments: `// …`, JSDoc/block lines starting with `*` or `/*`, and JSX `{/* … */}`.
    const trimmed = text.trim();
    if (/^(\*|\/\*|\{\/\*)/.test(trimmed)) return;
    const code = text.replace(/(^|[^:])\/\/.*$/, '$1');
    if (!inContent && STATIC_IMPORT.test(code)) {
      report(file, n, 'static-import', 'import content via api.ts + the route loader, not content/static');
    }
    if (!inContent && !inStyles && (HEX.test(code) || FN_COLOUR.test(code))) {
      report(file, n, 'raw-colour', `raw colour "${code.trim().slice(0, 80)}": add a token in globals.css`);
    }
    if (!isTokens && STRING_EASE.test(code)) {
      report(file, n, 'string-ease', 'use an EASE.* token from src/motion/tokens.ts');
    }
  });
}

// Route registry
const read = (p) => readFileSync(join(root, p), 'utf8');
const routerPaths = [...read('src/router.tsx').matchAll(/\bpath:\s*'([^']+)'/g)]
  .map((m) => m[1])
  .map((p) => (p.startsWith('/') ? p : `/${p}`));
const setOf = (src, name) => {
  const m = src.match(new RegExp(`${name}[^\\[]*\\[([^\\]]*)\\]`));
  return new Set(m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : []);
};
const enabled = setOf(read('src/components/ui/Link.tsx'), 'ENABLED_ROUTES');
const sitemap = setOf(read('vite.config.ts'), 'SITEMAP_ROUTES');
for (const p of routerPaths) {
  if (!enabled.has(p)) report('src/components/ui/Link.tsx', 1, 'route-registry', `route ${p} missing from ENABLED_ROUTES`);
  if (!sitemap.has(p)) report('vite.config.ts', 1, 'route-registry', `route ${p} missing from SITEMAP_ROUTES`);
}

if (errors.length) {
  console.error(`check-rules: ${errors.length} problem(s)\n\n${errors.join('\n')}\n`);
  console.error('See CLAUDE.md "Grounding rules" for the fix for each rule.');
  process.exit(1);
}
console.log('check-rules: ok');
