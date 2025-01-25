import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    alias: {
      $lib: 'src/lib'
    }
  },
  preprocess: vitePreprocess(),
  compilerOptions: {
    typescript: true,
    runes: true,
    customElement: false
  }
};

export default config;
