import { defineConfig } from 'astro/config';

const isNetlify = !!process.env.NETLIFY;
const isCloudflarePages = !!process.env.CF_PAGES; // Cloudflare Pages で true になる
const isGitHubPages = !isNetlify && !isCloudflarePages;

export default defineConfig({
  site: isNetlify
    ? 'https://YOUR-SITE.netlify.app'
    : isCloudflarePages
      ? (process.env.CF_PAGES_URL || 'https://YOUR-PROJECT.pages.dev')
      : 'https://voltprogram.github.io/',

  base: isGitHubPages ? '/pet-hotel_kennel/' : '/',
});

