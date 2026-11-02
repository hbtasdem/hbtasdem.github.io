import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hbtasdem.github.io',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
