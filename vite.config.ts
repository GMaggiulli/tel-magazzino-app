
import { join } from 'path';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	root: join(__dirname, "src", "app"),
	publicDir: join(__dirname, "src", "app", "public"),
	resolve: {
		alias: {
			"@": join(__dirname, "src")
		}
	}
});
