import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

const PROXY_ROUTES = {
  '^/api': {
    target: 'https://rickandmortyapi.com',
    changeOrigin: true,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },

      {
        find: '@assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
      {
        find: '@components',
        replacement: fileURLToPath(
          new URL('./src/components', import.meta.url)
        ),
      },
    ],
  },
  server: {
    port: 5173,
    proxy: PROXY_ROUTES,
  },
  preview: {
    port: 5174,
    proxy: PROXY_ROUTES,
  },
  plugins: [vue()],
});
