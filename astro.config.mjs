// @ts-check
import { defineConfig } from 'astro/config';

// BASE_PATH=/ai-homepage  → preview at lincolnkerry.github.io/ai-homepage
// BASE_PATH unset          → production at https://heungno.net (custom domain)
const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || 'https://heungno.net';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
});
