import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ReactMuiNestedFilter',
            fileName: (format) => `react-mui-nested-filter.${format}.js`,
        },
        minify: false,
        rollupOptions: {
            external: ['react', 'react-dom', '@mui/material'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
