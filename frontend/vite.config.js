import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      proxy: {
        '/api': {
          target: isDevelopment
            ? 'http://localhost:5000'
            : 'https://tiberium-backend.vercel.app',
          changeOrigin: true,
          secure: !isDevelopment,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    define: {
      __DEV__: isDevelopment,
    }
  };
});
