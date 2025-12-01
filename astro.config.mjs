// // @ts-check
// import { defineConfig } from 'astro/config';

// // https://astro.build/config
// export default defineConfig({
//   site: 'https://voltprogram.github.io',
//   base: '/pet-hotel_kennel',
// });

// @ts-check
import { defineConfig } from 'astro/config';

const isProd = import.meta.env.PROD;

export default defineConfig({
  site: isProd
    ? 'https://voltprogram.github.io/'
    : 'http://localhost:4321/',

  base: isProd
    ? '/pet-hotel_kennel/'
    : '/',  // ← ローカルでは base を空にする
});