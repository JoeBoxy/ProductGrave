import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://www.productgrave.net',
  output: 'hybrid',
  trailingSlash: 'always',
  adapter: vercel(),
  redirects: {
    '/validate-idea': '/validate-idea/',
  },
  integrations: [react(), tailwind({
    applyBaseStyles: false,
  }), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
