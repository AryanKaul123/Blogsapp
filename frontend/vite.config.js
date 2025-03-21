import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Ensure the build output directory
  },
  server: {
    open: true,             // Automatically opens the app in the browser
    historyApiFallback: true,  // Enables SPA fallback for routing issues
  },
  resolve: {
    alias: {
      '@': '/src',  // Optional: Use '@' as an alias for '/src'
    },
  },
});
