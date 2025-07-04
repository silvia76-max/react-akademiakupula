import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Usa `mode` que viene como parámetro en defineConfig
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : '/react-akademiakupula/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@services': '/src/services',
        '@pages': '/src/pages'
      },
      extensions: ['.js', '.jsx', '.json'],
    },
    server: {
      headers: {
        'Cache-Control': 'no-store'
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        }
      }
    },
  };
});
