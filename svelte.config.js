// import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			fallback: 'app.html'
		})
		// vite: {
		// 	server: {
		// 		watch: {
		// 			usePolling: true
		// 		}
		// 	}
		// }
	}
};

export default config;
