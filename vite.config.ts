import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'ReactMuiNestedFilter',
            fileName: (format) => `react-mui-nested-filter.${format}.js`,
        },
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
