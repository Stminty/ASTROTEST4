// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    integrations: [
      mdx(),
      sitemap(),
      react(),
      tailwind(),
      sentry(),
      spotlightjs(),
    ],
});