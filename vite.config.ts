import { defineConfig } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import react from '@vitejs/plugin-react';

export default defineConfig({
	root: 'src',
	build: {
		outDir: '../www'
	},
	plugins: [react(), nodePolyfills()],
})
