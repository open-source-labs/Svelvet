// import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-static';
import vercel from '@sveltejs/adapter-vercel'

/* export default {
  kit: {
    // default options are shown
    adapter: vercel({
      // if true, will deploy the app using edge functions
      // (https://vercel.com/docs/concepts/functions/edge-functions)
      // rather than serverless functions
      edge: false,

      // an array of dependencies that esbuild should treat
      // as external when bundling functions
      external: [],

      // if true, will split your app into multiple functions
      // instead of creating a single one for the entire app
      split: false
    })
  }
}; */


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		trailingSlash: 'always',
		adapter: vercel({
			pages: 'build',
			assets: 'build',
			fallback: '200.html',
			precompress: false,
			edge: false,
			split: false,
		}),
		prerender: {
			default: false
		},
		vite: {
			optimizeDeps: {
				include: [
					'codemirror',
					'codemirror/mode/javascript/javascript.js',
					'codemirror/mode/handlebars/handlebars.js',
					'codemirror/mode/htmlmixed/htmlmixed.js',
					'codemirror/mode/xml/xml.js',
					'codemirror/mode/css/css.js',
					'codemirror/mode/markdown/markdown.js',
					'codemirror/addon/edit/closebrackets.js',
					'codemirror/addon/edit/closetag.js',
					'codemirror/addon/edit/continuelist.js',
					'codemirror/addon/comment/comment.js',
					'codemirror/addon/fold/foldcode.js',
					'codemirror/addon/fold/foldgutter.js',
					'codemirror/addon/fold/brace-fold.js',
					'codemirror/addon/fold/xml-fold.js',
					'codemirror/addon/fold/indent-fold.js',
					'codemirror/addon/fold/markdown-fold.js',
					'codemirror/addon/fold/comment-fold.js'
				]
			},
			/* server: {
    		fs: {
      		// Allow serving files from one level up to the project root
      		allow: ['..']
				}
			} */
		}
	}
}

export default config;
