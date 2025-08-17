import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Select adapter based on the npm lifecycle event or explicit env var
const lifecycle = process.env.npm_lifecycle_event || '';
const useNodeAdapter = lifecycle === 'build:local' || process.env.ADAPTER === 'node';

// Dynamically import only the adapter we need so missing deps don't break other modes
const adapter = await (async () => {
	if (useNodeAdapter) {
		const { default: node } = await import('@sveltejs/adapter-node');
		return node({ out: 'build' });
	}
	const { default: vercel } = await import('@sveltejs/adapter-vercel');
	return vercel();
})();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { adapter },
	extensions: ['.svelte', '.svx']
};

export default config;
