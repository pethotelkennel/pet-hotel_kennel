import { defineConfig } from 'astro/config';

const isNetlify = !!process.env.NETLIFY;

export default defineConfig({
  site: isNetlify
    ? 'https://YOUR-SITE.netlify.app'
    : 'https://voltprogram.github.io/',

  base: isNetlify
    ? '/'
    : '/pet-hotel_kennel/',
});
